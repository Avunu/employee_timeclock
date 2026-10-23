# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""Rebuild the Workdays built before punches were paired into shifts that can cross midnight.

Until the shift pairing in ``employee_timeclock.timeclock.shifts``, a Workday held the punches of one
calendar date, paired by position whatever their log type. A night shift's OUT sat on the next
day's Workday, and a day whose punches did not alternate IN, OUT paired the wrong ones. Those
Workdays keep their old slots and hours until they are rebuilt.

This patch rebuilds them with ``shifts.sync_workday``, the code behind the Workday Management
report's *Rebuild Workdays*. It only rewrites a Workday that the rebuild would change, and leaves
alone every Workday in a payroll period that has a Salary Slip (draft or submitted) for its
employee, and a changed Workday within a maximum shift length of such a period. Each Workday it
changes gets an Info comment with its hours before and after.

A site can limit the rebuild to Workdays on or after a date with the site config key
``employee_timeclock_rebuild_workdays_from`` (``YYYY-MM-DD``), set before ``bench migrate``.
"""

import datetime
import math
from collections.abc import Iterator
from dataclasses import dataclass, field
from typing import Any, cast

import frappe
from frappe.utils import flt, get_datetime, getdate
from pypika.terms import Tuple

from employee_timeclock.timeclock import shifts
from employee_timeclock.timeclock.doctype.workday.workday import Workday

BATCH_SIZE = 500
"""Workdays read, checked and (when not in a test) committed together."""

REBUILD_FROM_KEY = "employee_timeclock_rebuild_workdays_from"
"""Site config key: rebuild only Workdays on or after this date."""

HOURS_TOLERANCE = 1e-6
"""Stored hours closer than this to the rebuilt hours are the same (the column keeps 9 decimals)."""

SLOT_FIELDS = tuple(
	f"check_{kind}_{i}{suffix}"
	for i in range(1, shifts.WORKDAY_SLOTS + 1)
	for kind in ("in", "out")
	for suffix in ("", "_dt")
)

LOCKING_DOCTYPE = "Salary Slip"


@dataclass
class Summary:
	"""What a run looked at and did."""

	checked: int = 0
	rebuilt: int = 0
	unchanged: int = 0
	# Workdays in a payroll period with a Salary Slip, left alone, and how many of them were stale
	locked: int = 0
	locked_stale: int = 0
	# stale Workdays left alone because they are within a maximum shift length of such a period
	boundary: int = 0
	before_floor: int = 0
	failed: int = 0
	hours_before: float = 0.0
	hours_after: float = 0.0
	# stale Workdays this run left alone (locked or boundary), for HR to review
	left_alone: list[str] = field(default_factory=list)

	def message(self) -> str:
		text = (
			f"Rebuilt {self.rebuilt} of {self.checked} Workdays "
			f"({flt(self.hours_before, 2)} hours before, {flt(self.hours_after, 2)} after); "
			f"{self.unchanged} already matched their punches. "
			f"Left alone: {self.locked} in a payroll period with a Salary Slip "
			f"({self.locked_stale} of them out of date), {self.boundary} next to one, "
			f"{self.before_floor} before {REBUILD_FROM_KEY}. Failed: {self.failed}."
		)
		if self.left_alone:
			shown = ", ".join(self.left_alone[:50])
			more = f" and {len(self.left_alone) - 50} more" if len(self.left_alone) > 50 else ""
			text += f" Out of date but left alone: {shown}{more}."
		return text


def _rebuild_from() -> datetime.date | None:
	value = frappe.conf.get(REBUILD_FROM_KEY)
	return cast(datetime.date, getdate(value)) if value else None


def _workday_batches(
	floor: datetime.date | None, batch_size: int, employee: str | None = None
) -> Iterator[list[frappe._dict]]:
	"""Workdays in batches, by employee, date and creation. Keyset paging, so a large table is
	never read whole and rewriting a Workday never moves the next page."""
	Workdays = frappe.qb.DocType("Workday")
	order = (Workdays.employee, Workdays.date, Workdays.creation, Workdays.name)
	last: tuple[Any, ...] | None = None
	while True:
		query = (
			frappe.qb.from_(Workdays)
			.select(Workdays.name, Workdays.employee, Workdays.date, Workdays.creation)
			.select(Workdays.total_hours, *(Workdays[f] for f in SLOT_FIELDS))
			.where(Workdays.employee.isnotnull())
			.where(Workdays.date.isnotnull())
			.orderby(*order)
			.limit(batch_size)
		)
		if floor:
			query = query.where(Workdays.date >= floor)
		if employee:
			query = query.where(Workdays.employee == employee)
		if last:
			query = query.where(Tuple(*order) > Tuple(*last))
		rows = query.run(as_dict=True)
		if not rows:
			return
		last = (rows[-1].employee, rows[-1].date, rows[-1].creation, rows[-1].name)
		yield rows


def _locked_periods(
	employees: set[str], first: datetime.date, last: datetime.date
) -> dict[str, list[tuple[datetime.date, datetime.date]]]:
	"""Each employee's Salary Slip periods (drafts too, not cancelled ones) overlapping first..last."""
	if not frappe.db.table_exists(LOCKING_DOCTYPE):
		return {}
	rows = frappe.get_all(
		LOCKING_DOCTYPE,
		filters={
			"employee": ["in", list(employees)],
			"docstatus": ["<", 2],
			"start_date": ["<=", last],
			"end_date": [">=", first],
		},
		fields=["employee", "start_date", "end_date"],
	)
	periods: dict[str, list[tuple[datetime.date, datetime.date]]] = {}
	for row in rows:
		periods.setdefault(row.employee, []).append(
			(cast(datetime.date, getdate(row.start_date)), cast(datetime.date, getdate(row.end_date)))
		)
	return periods


def _overlaps(
	periods: list[tuple[datetime.date, datetime.date]], first: datetime.date, last: datetime.date
) -> bool:
	return any(start <= last and end >= first for start, end in periods)


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


def rebuild_stale_workdays(
	batch_size: int = BATCH_SIZE, commit: bool = False, employee: str | None = None
) -> Summary:
	"""Rebuild every Workday (of one employee, if given) whose slots, hours or punches differ from
	its shifts, outside payroll periods that have a Salary Slip. Running it again changes nothing."""
	summary = Summary()
	floor = _rebuild_from()
	if floor:
		before: dict[str, Any] = {"date": ["<", floor]}
		if employee:
			before["employee"] = employee
		summary.before_floor = frappe.db.count("Workday", before)
	# a rebuild moves punches as far as a maximum shift length to or from the neighbouring days
	reach = datetime.timedelta(days=math.ceil(shifts.get_max_shift_hours() / 24))
	scratch = cast(Workday, frappe.new_doc("Workday"))

	previous: tuple[str, datetime.date] | None = None
	for rows in _workday_batches(floor, batch_size, employee):
		employees = {cast(str, row.employee) for row in rows}
		dates = [cast(datetime.date, getdate(row.date)) for row in rows]
		periods = _locked_periods(employees, min(dates) - reach, max(dates) + reach)

		for workday in rows:
			owner = cast(str, workday.employee)
			date = cast(datetime.date, getdate(workday.date))
			# sync_workday writes the oldest Workday of a date; a duplicate after it is left as is
			if (owner, date) == previous:
				continue
			previous = (owner, date)
			summary.checked += 1
			employee_periods = periods.get(owner, [])
			locked = _overlaps(employee_periods, date, date)
			day_shifts = shifts.get_shifts(date, date, owner, fields=("workday",)).get(owner, [])
			stale = _is_stale(workday, day_shifts, scratch)
			if locked:
				summary.locked += 1
				if stale:
					summary.locked_stale += 1
					summary.left_alone.append(cast(str, workday.name))
				continue
			if not stale:
				summary.unchanged += 1
				continue
			if _overlaps(employee_periods, date - reach, date + reach):
				summary.boundary += 1
				summary.left_alone.append(cast(str, workday.name))
				continue

			before = flt(workday.total_hours)
			savepoint = "timeclock_rebuild_workday"
			frappe.db.savepoint(savepoint)
			try:
				rebuilt = shifts.sync_workday(owner, date, create=False)
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
			except Exception:
				frappe.db.rollback(save_point=savepoint)
				frappe.log_error(title=f"Workday rebuild failed for {workday.name}")
				summary.failed += 1
				continue
			frappe.db.release_savepoint(savepoint)
			summary.rebuilt += 1
			summary.hours_before += before
			summary.hours_after += after

		if commit:
			# each Workday's rebuild stands alone, and a rerun skips the ones already done
			frappe.db.commit()  # nosemgrep: frappe-semgrep-rules.rules.frappe-manual-commit

	return summary


def execute() -> None:
	summary = rebuild_stale_workdays(commit=not frappe.flags.in_test)
	frappe.logger("employee_timeclock.patches").info(summary.message())
	print(summary.message())  # noqa: T201 - shown in bench migrate's output
