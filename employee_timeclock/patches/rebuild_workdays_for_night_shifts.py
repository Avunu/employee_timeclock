# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""Rebuild the Workdays built before punches were paired into shifts that can cross midnight.

Until the shift pairing in ``employee_timeclock.timeclock.shifts``, a Workday held the punches of one
calendar date, paired by position whatever their log type. A night shift's OUT sat on the next
day's Workday, and a day whose punches did not alternate IN, OUT paired the wrong ones. Those
Workdays keep their old slots and hours until they are rebuilt.

This patch rebuilds them with ``shifts.sync_workday``, the code behind the Workday Management
report's *Rebuild Workdays*. It only rewrites a Workday that the rebuild would change, and it never
lets a punch be counted twice or dropped:

* Rebuilding can move a punch from one Workday to another (a night shift's OUT moves onto the day
  before). Workdays that trade punches are rebuilt together, in one savepoint, or not at all.
* Such a group is left alone when one of its Workdays must not change: one in a payroll period with
  a Salary Slip (draft or submitted) for its employee, or one before the floor date below, or a date
  with punches and no Workday.
* It is also left alone when a Workday in it shows a time that no Employee Checkin backs (an hour
  typed straight into the Workday): the rebuild would drop it.

It only rebuilds Workdays dated on or after a floor date, so payroll history that is already paid
is not rewritten:

* When the site config key ``employee_timeclock_rebuild_workdays_from`` is set (``YYYY-MM-DD``), it
  is the floor, earlier or later than the default.
* Otherwise the floor is the site's date (``nowdate``) minus ``DEFAULT_WINDOW_DAYS`` days, so only
  the last two weeks are rebuilt.

Workdays before the floor are not written. The summary counts them and how many of them are out of
date; HR can rebuild those with *Rebuild Workdays*, or set the config key to an earlier date and run
``bench --site <site> execute employee_timeclock.patches.rebuild_workdays_for_night_shifts.execute``.

Each Workday it changes gets an Info comment with its hours before and after.
"""

import datetime
import math
from collections import Counter
from collections.abc import Iterator
from dataclasses import dataclass, field
from typing import Any, cast

import frappe
from frappe.utils import flt, get_datetime, getdate, nowdate

from employee_timeclock.timeclock import shifts
from employee_timeclock.timeclock.doctype.workday.workday import Workday

BATCH_SIZE = 500
"""Employees read together; the patch commits after each employee (not in a test)."""

REBUILD_FROM_KEY = "employee_timeclock_rebuild_workdays_from"
"""Site config key: rebuild only Workdays on or after this date. It overrides the default window."""

DEFAULT_WINDOW_DAYS = 14
"""With no site config date, rebuild only Workdays dated on or after today minus this many days."""

PATCH_METHOD = "employee_timeclock.patches.rebuild_workdays_for_night_shifts.execute"

HOURS_TOLERANCE = 1e-6
"""Stored hours closer than this to the rebuilt hours are the same (the column keeps 9 decimals)."""

SLOT_FIELDS = tuple(
	f"check_{kind}_{i}{suffix}"
	for i in range(1, shifts.WORKDAY_SLOTS + 1)
	for kind in ("in", "out")
	for suffix in ("", "_dt")
)

TIME_FIELDS = tuple(name for name in SLOT_FIELDS if name.endswith("_dt"))

LOCKING_DOCTYPE = "Salary Slip"

SAVEPOINT = "timeclock_rebuild_workdays"


@dataclass
class Summary:
	"""What a run looked at and did."""

	checked: int = 0
	rebuilt: int = 0
	unchanged: int = 0
	# Workdays in a payroll period with a Salary Slip, left alone, and how many of them were stale
	locked: int = 0
	locked_stale: int = 0
	# stale Workdays left alone because they trade punches with one that must not change
	held_back: int = 0
	# stale Workdays left alone because one in their group shows a time no punch backs
	unbacked: int = 0
	# Workdays before the floor, never written, and how many of them were stale
	floor: datetime.date | None = None
	before_floor: int = 0
	before_floor_stale: int = 0
	failed: int = 0
	hours_before: float = 0.0
	hours_after: float = 0.0
	# stale Workdays this run left alone, for HR to review
	left_alone: list[str] = field(default_factory=list)

	def message(self) -> str:
		text = (
			f"Rebuilt {self.rebuilt} of {self.checked} Workdays "
			f"({flt(self.hours_before, 2)} hours before, {flt(self.hours_after, 2)} after); "
			f"{self.unchanged} already matched their punches. "
			f"Left alone: {self.locked} in a payroll period with a Salary Slip "
			f"({self.locked_stale} of them out of date), {self.held_back} sharing a night shift with "
			f"one that can't change, {self.unbacked} with times no punch backs, "
			f"{self.before_floor} before {self.floor} ({self.before_floor_stale} of them out of date). "
			f"Failed: {self.failed}."
		)
		if self.before_floor_stale:
			text += (
				f" The {self.before_floor_stale} out-of-date Workdays before {self.floor} were not "
				"rebuilt, so paid history stays as it is. To rebuild them, use Rebuild Workdays in the "
				f"Workday Management report, or set the site config key {REBUILD_FROM_KEY} to an earlier "
				f"date and run: bench --site <site> execute {PATCH_METHOD}"
			)
		if self.left_alone:
			shown = ", ".join(self.left_alone[:50])
			more = f" and {len(self.left_alone) - 50} more" if len(self.left_alone) > 50 else ""
			text += f" Out of date but left alone: {shown}{more}."
		return text


@dataclass
class Day:
	"""One employee's date: its Workday as stored (None when it has none) and its shifts now."""

	date: datetime.date
	workday: frappe._dict | None
	day_shifts: list[shifts.Shift]
	frozen: bool = False
	locked: bool = False
	stale: bool = False
	shown: Counter[datetime.datetime] = field(default_factory=Counter)
	paired: Counter[datetime.datetime] = field(default_factory=Counter)

	@property
	def must_not_change(self) -> bool:
		"""A day the rebuild may not write: locked, before the floor, or with no Workday."""
		return self.workday is None or self.frozen or self.locked


def _rebuild_from() -> datetime.date:
	"""The first date to rebuild: the site config date when set, else the last DEFAULT_WINDOW_DAYS."""
	value = frappe.conf.get(REBUILD_FROM_KEY)
	if value:
		return cast(datetime.date, getdate(value))
	return cast(datetime.date, getdate(nowdate())) - datetime.timedelta(days=DEFAULT_WINDOW_DAYS)


def _reach() -> datetime.timedelta:
	"""How many days a rebuild can move a punch: a maximum shift length, in whole days."""
	return datetime.timedelta(days=math.ceil(shifts.get_max_shift_hours() / 24))


def _employee_batches(batch_size: int, employee: str | None) -> Iterator[list[str]]:
	"""The employees that have Workdays, in batches (keyset paged)."""
	if employee:
		yield [employee]
		return
	Workdays = frappe.qb.DocType("Workday")
	last: str | None = None
	while True:
		query = (
			frappe.qb.from_(Workdays)
			.select(Workdays.employee)
			.distinct()
			.where(Workdays.employee.isnotnull())
			.orderby(Workdays.employee)
			.limit(batch_size)
		)
		if last is not None:
			query = query.where(Workdays.employee > last)
		names = [row[0] for row in query.run()]
		if not names:
			return
		last = names[-1]
		yield names


def _workdays(employee: str) -> list[frappe._dict]:
	"""The employee's Workdays, the oldest of each date first."""
	Workdays = frappe.qb.DocType("Workday")
	query = (
		frappe.qb.from_(Workdays)
		.select(Workdays.name, Workdays.date, Workdays.total_hours, *(Workdays[f] for f in SLOT_FIELDS))
		.where(Workdays.employee == employee)
		.where(Workdays.date.isnotnull())
		.orderby(Workdays.date)
		.orderby(Workdays.creation)
		.orderby(Workdays.name)
	)
	return query.run(as_dict=True)


def _locked_periods(
	employee: str, first: datetime.date, last: datetime.date
) -> list[tuple[datetime.date, datetime.date]]:
	"""The employee's Salary Slip periods (drafts too, not cancelled ones) overlapping first..last."""
	if not frappe.db.table_exists(LOCKING_DOCTYPE):
		return []
	rows = frappe.get_all(
		LOCKING_DOCTYPE,
		filters={
			"employee": employee,
			"docstatus": ["<", 2],
			"start_date": ["<=", last],
			"end_date": [">=", first],
		},
		fields=["start_date", "end_date"],
	)
	return [
		(cast(datetime.date, getdate(row.start_date)), cast(datetime.date, getdate(row.end_date)))
		for row in rows
	]


def _same(stored: Any, rebuilt: Any, fieldname: str) -> bool:
	if not stored and not rebuilt:
		return True
	if not stored or not rebuilt:
		return False
	if fieldname.endswith("_dt"):
		return get_datetime(stored) == get_datetime(rebuilt)
	return str(stored) == str(rebuilt)


def _is_stale(stored: frappe._dict, day_shifts: list[shifts.Shift], scratch: Workday) -> bool:
	"""Whether ``sync_workday`` would change this Workday or its punches."""
	shifts.fill_workday(scratch, day_shifts)
	if abs(flt(stored.total_hours) - flt(scratch.total_hours)) > HOURS_TOLERANCE:
		return True
	if not all(_same(stored.get(f), scratch.get(f), f) for f in SLOT_FIELDS):
		return True
	return any(
		punch.get("inferred_log_type") or punch.get("workday") != stored.name
		for shift in day_shifts
		for punch in shift.punches
	)


def _times(values: Any) -> Counter[datetime.datetime]:
	return Counter(cast(datetime.datetime, get_datetime(value)) for value in values if value)


def _days(employee: str, floor: datetime.date, scratch: Workday) -> list[Day]:
	"""Every date of the employee's that has a Workday or a shift. Days before the floor are read (to
	keep a night shift across it whole, and to count the stale ones) but frozen."""
	reach = _reach()
	rows = _workdays(employee)
	if not rows:
		return []
	days: dict[datetime.date, Day] = {}
	for row in rows:
		date = cast(datetime.date, getdate(row.date))
		# sync_workday writes the oldest Workday of a date; a later duplicate is left as it is
		days.setdefault(date, Day(date=date, workday=row, day_shifts=[]))
	first, last = min(days), max(days)
	found = shifts.get_shifts(first - reach, last + reach, employee, fields=("workday",)).get(employee, [])
	for shift in found:
		days.setdefault(shift.date, Day(date=shift.date, workday=None, day_shifts=[])).day_shifts.append(
			shift
		)
	periods = _locked_periods(employee, first - reach, last + reach)
	for day in days.values():
		# the punches the rebuilt Workday would show (fill_workday keeps the first twelve shifts)
		kept = sorted(day.day_shifts, key=lambda shift: shift.start)[: shifts.WORKDAY_SLOTS]
		day.paired = _times(punch.time for shift in kept for punch in shift.punches)
		day.locked = any(start <= day.date <= end for start, end in periods)
		day.frozen = day.date < floor
		if day.workday is not None:
			day.shown = _times(day.workday.get(f) for f in TIME_FIELDS)
			day.stale = _is_stale(day.workday, day.day_shifts, scratch)
	return sorted(days.values(), key=lambda day: day.date)


def _groups(days: list[Day]) -> list[list[Day]]:
	"""The days that trade punches: a time shown on one day and paired on another joins them."""
	parent = list(range(len(days)))

	def root(i: int) -> int:
		while parent[i] != i:
			parent[i] = parent[parent[i]]
			i = parent[i]
		return i

	holder: dict[datetime.datetime, int] = {}
	for i, day in enumerate(days):
		for time in (*day.shown, *day.paired):
			if time in holder:
				parent[root(i)] = root(holder[time])
			else:
				holder[time] = i
	groups: dict[int, list[Day]] = {}
	for i, day in enumerate(days):
		groups.setdefault(root(i), []).append(day)
	return list(groups.values())


def _changes(day: Day) -> bool:
	"""Whether rebuilding would write this day: a stale Workday, or a missing one with shifts."""
	return day.stale if day.workday is not None else bool(day.paired)


def _rebuild_group(employee: str, group: list[Day], summary: Summary) -> None:
	stale = [day for day in group if day.workday is not None and day.stale]
	names = [cast(str, day.workday.name) for day in stale if day.workday is not None]
	frappe.db.savepoint(SAVEPOINT)
	try:
		hours: list[tuple[float, float]] = []
		for day in stale:
			workday = cast(frappe._dict, day.workday)
			before = flt(workday.total_hours)
			rebuilt = shifts.sync_workday(employee, day.date, create=False)
			after = flt(rebuilt.total_hours) if rebuilt else 0.0
			frappe.get_doc(
				{
					"doctype": "Comment",
					"comment_type": "Info",
					"reference_doctype": "Workday",
					"reference_name": workday.name,
					"content": (
						"Rebuilt from its punches after night shifts began pairing across midnight: "
						f"{flt(before, 2)} hours before, {flt(after, 2)} after."
					),
				}
			).insert(ignore_permissions=True)
			hours.append((before, after))
	except Exception:
		frappe.db.rollback(save_point=SAVEPOINT)
		frappe.log_error(title=f"Workday rebuild failed for {', '.join(names)}")
		summary.failed += len(stale)
		summary.left_alone.extend(names)
		return
	frappe.db.release_savepoint(SAVEPOINT)
	summary.rebuilt += len(stale)
	summary.hours_before += sum(before for before, _after in hours)
	summary.hours_after += sum(after for _before, after in hours)


def _rebuild_employee(employee: str, floor: datetime.date, scratch: Workday, summary: Summary) -> None:
	for group in _groups(_days(employee, floor, scratch)):
		summary.before_floor_stale += sum(
			1 for day in group if day.frozen and day.workday is not None and day.stale
		)
		workdays = [day for day in group if day.workday is not None and not day.frozen]
		summary.checked += len(workdays)
		for day in workdays:
			if day.locked:
				summary.locked += 1
				if day.stale:
					summary.locked_stale += 1
					summary.left_alone.append(cast(str, cast(frappe._dict, day.workday).name))
		stale = [day for day in workdays if day.stale and not day.locked]
		summary.unchanged += sum(1 for day in workdays if not day.stale and not day.locked)
		if not stale:
			continue
		names = [cast(str, cast(frappe._dict, day.workday).name) for day in stale]
		# a stale Workday that may not be written holds its night shifts' punches for the whole group
		if any(day.must_not_change and _changes(day) for day in group):
			summary.held_back += len(stale)
			summary.left_alone.extend(names)
			continue
		# a time a Workday shows that no punch pairs onto any day would be dropped by the rebuild
		if sum((day.shown for day in group), Counter()) - sum((day.paired for day in group), Counter()):
			summary.unbacked += len(stale)
			summary.left_alone.extend(names)
			continue
		_rebuild_group(employee, group, summary)


def rebuild_stale_workdays(
	batch_size: int = BATCH_SIZE, commit: bool = False, employee: str | None = None
) -> Summary:
	"""Rebuild every Workday (of one employee, if given) on or after the floor date whose slots, hours
	or punches differ from its shifts, as far as it can without changing a locked day, a day before
	the floor or losing a punch. Running it again changes nothing."""
	summary = Summary()
	floor = summary.floor = _rebuild_from()
	before: dict[str, Any] = {"date": ["<", floor]}
	if employee:
		before["employee"] = employee
	summary.before_floor = frappe.db.count("Workday", before)
	scratch = cast(Workday, frappe.new_doc("Workday"))
	for employees in _employee_batches(batch_size, employee):
		for name in employees:
			_rebuild_employee(name, floor, scratch, summary)
			if commit:
				# each employee's rebuild stands alone, and a rerun skips the Workdays already done
				frappe.db.commit()  # nosemgrep: frappe-semgrep-rules.rules.frappe-manual-commit
	return summary


def execute() -> None:
	summary = rebuild_stale_workdays(commit=not frappe.flags.in_test)
	frappe.logger("employee_timeclock.patches").info(summary.message())
	print(summary.message())  # noqa: T201 - shown in bench migrate's output
