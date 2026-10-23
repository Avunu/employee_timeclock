# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""How an employee's punches pair into shifts. Every place that pairs or derives IN and OUT uses this.

The rule:

* Punches are taken in time order (then in the order they were recorded).
* An OUT closes the employee's open IN when it comes no more than the maximum shift length after
  it (Timeclock Settings, 16 hours unless changed). That pair is one shift.
* A shift belongs to the date of its IN, so a night shift from 10 PM to 6 AM is all on the first
  day: on its Workday, in that day's hours and in that week's overtime.
* A punch that pairs with nothing is a missed punch: an IN followed by another IN, or by an OUT
  more than the maximum shift length later, and an OUT with no open IN before it. A missed punch
  counts no hours. An unmatched OUT belongs to its own date.
* A punch with no log type is read as the OUT of an open IN within the window, otherwise an IN.

The kiosks pick a scan's direction with the same rule: OUT when the employee has an IN open from
the last maximum shift length, IN otherwise.
"""

import calendar
import datetime
from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from typing import Any, Literal, cast

import frappe
from frappe.query_builder import DocType
from frappe.utils import add_days, flt, get_datetime, getdate, now_datetime

from employee_timeclock.timeclock.doctype.workday.workday import Workday

DEFAULT_MAX_SHIFT_HOURS = 16.0
"""The maximum shift length when Timeclock Settings has none."""

WORKDAY_SLOTS = 12
"""In and out pairs a Workday holds."""

Checkins = DocType("Employee Checkin")

PUNCH_FIELDS = ("name", "employee", "time", "log_type")


def get_max_shift_hours() -> float:
	"""The longest an IN may stay open and still pair with an OUT, in hours."""
	hours = flt(frappe.db.get_single_value("Timeclock Settings", "max_shift_hours"))
	return hours if hours > 0 else DEFAULT_MAX_SHIFT_HOURS


def get_max_shift() -> datetime.timedelta:
	return datetime.timedelta(hours=get_max_shift_hours())


def _datetime(value: Any) -> datetime.datetime:
	return cast(datetime.datetime, get_datetime(value))


@dataclass
class Shift:
	"""One IN and the OUT that closes it; either is None for a missed punch."""

	check_in: frappe._dict | None = None
	check_out: frappe._dict | None = None

	@property
	def start(self) -> datetime.datetime:
		punch = self.check_in or self.check_out
		assert punch is not None
		return _datetime(punch.time)

	@property
	def date(self) -> datetime.date:
		"""The date the shift's hours belong to: its IN's, or a lone OUT's own."""
		return self.start.date()

	@property
	def missed(self) -> bool:
		return self.check_in is None or self.check_out is None

	@property
	def hours(self) -> float:
		if self.check_in is None or self.check_out is None:
			return 0.0
		return (_datetime(self.check_out.time) - _datetime(self.check_in.time)).total_seconds() / 3600

	@property
	def punches(self) -> list[frappe._dict]:
		return [punch for punch in (self.check_in, self.check_out) if punch is not None]


def pair_punches(punches: Iterable[Any], max_shift: datetime.timedelta | None = None) -> list[Shift]:
	"""Pair one employee's punches, given in time order, into shifts.

	Each punch needs ``time`` and ``log_type``; plain datetimes stand for punches of no log type.
	The shifts come back in the order they start.
	"""
	if max_shift is None:
		max_shift = get_max_shift()
	shifts: list[Shift] = []
	open_shift: Shift | None = None
	for raw in punches:
		if isinstance(raw, frappe._dict):
			punch = raw
		elif isinstance(raw, dict):
			punch = frappe._dict(raw)
		else:
			punch = frappe._dict(time=raw, log_type="")
		time = _datetime(punch.time)
		in_window = (
			open_shift is not None
			and open_shift.check_in is not None
			and time - _datetime(open_shift.check_in.time) <= max_shift
		)
		log_type = punch.get("log_type")
		if log_type not in ("IN", "OUT"):
			log_type = "OUT" if in_window else "IN"
			punch.inferred_log_type = log_type
		if log_type == "OUT" and in_window and open_shift is not None:
			open_shift.check_out = punch
			open_shift = None
		elif log_type == "OUT":
			# nothing open to close (or the IN is too long ago): a lone OUT, and any open IN is missed
			shifts.append(Shift(check_out=punch))
			open_shift = None
		else:
			# a new IN leaves an open IN unmatched
			open_shift = Shift(check_in=punch)
			shifts.append(open_shift)
	shifts.sort(key=lambda shift: shift.start)
	return shifts


def get_punches(
	employee: str | None,
	start: datetime.datetime,
	end: datetime.datetime,
	fields: Sequence[str] = (),
	exclude: Iterable[str] = (),
) -> list[frappe._dict]:
	"""Employee Checkins from ``start`` (inclusive) to ``end`` (exclusive), by employee and time."""
	query = (
		frappe.qb.from_(Checkins)
		.select(*(Checkins[field] for field in dict.fromkeys((*PUNCH_FIELDS, *fields))))
		.where(Checkins.time >= start)
		.where(Checkins.time < end)
		.where(Checkins.docstatus < 2)
		.orderby(Checkins.employee)
		.orderby(Checkins.time)
		.orderby(Checkins.creation)
	)
	if employee:
		query = query.where(Checkins.employee == employee)
	excluded = list(exclude)
	if excluded:
		query = query.where(Checkins.name.notin(excluded))
	return query.run(as_dict=True)


def get_shifts(
	from_date: datetime.date | str,
	to_date: datetime.date | str,
	employee: str | None = None,
	fields: Sequence[str] = (),
	exclude: Iterable[str] = (),
) -> dict[str, list[Shift]]:
	"""Each employee's shifts that belong to a date from ``from_date`` to ``to_date``.

	Punches are read a maximum shift length either side of the range, so a night shift that started
	the day before ``from_date`` is left out and one that started on ``to_date`` keeps its OUT.
	"""
	max_shift = get_max_shift()
	first = cast(datetime.date, getdate(from_date))
	last = cast(datetime.date, getdate(to_date))
	start = datetime.datetime.combine(first, datetime.time()) - max_shift
	end = datetime.datetime.combine(cast(datetime.date, add_days(last, 1)), datetime.time()) + max_shift
	by_employee: dict[str, list[frappe._dict]] = {}
	for punch in get_punches(employee, start, end, fields, exclude):
		by_employee.setdefault(cast(str, punch.employee), []).append(punch)
	result: dict[str, list[Shift]] = {}
	for name, punches in by_employee.items():
		shifts = [shift for shift in pair_punches(punches, max_shift) if first <= shift.date <= last]
		if shifts:
			result[name] = shifts
	return result


def _dates_around(time: datetime.datetime) -> list[datetime.date]:
	"""The dates a shift holding a punch at ``time`` can belong to: up to a maximum shift earlier."""
	first = (time - get_max_shift()).date()
	return [first + datetime.timedelta(days=n) for n in range((time.date() - first).days + 1)]


def get_shift_of(checkin: str, employee: str, time: datetime.datetime) -> Shift | None:
	"""The shift an Employee Checkin is part of."""
	for date in _dates_around(time):
		for shift in get_shifts(date, date, employee).get(employee, []):
			if any(punch.name == checkin for punch in shift.punches):
				return shift
	return None


def open_check_in(employee: str, at: datetime.datetime | None = None) -> frappe._dict | None:
	"""The employee's IN still open at ``at`` (default now), from the last maximum shift length."""
	at = at or now_datetime()
	max_shift = get_max_shift()
	punches = get_punches(employee, at - max_shift, at + datetime.timedelta(microseconds=1))
	shifts = pair_punches(punches, max_shift)
	if shifts and shifts[-1].check_in is not None and shifts[-1].check_out is None:
		return shifts[-1].check_in
	return None


def last_log_type(employee: str, at: datetime.datetime | None = None) -> Literal["IN", "OUT"] | None:
	"""IN when the employee is on shift at ``at``, OUT when they punched within the window but are
	not, None when they have not punched within the last maximum shift length."""
	at = at or now_datetime()
	if open_check_in(employee, at):
		return "IN"
	recent = get_punches(employee, at - get_max_shift(), at + datetime.timedelta(microseconds=1))
	return "OUT" if recent else None


def next_log_type(employee: str, at: datetime.datetime | None = None) -> Literal["IN", "OUT"]:
	"""The direction of the employee's next punch at ``at``: OUT while an IN is open, else IN."""
	return "OUT" if open_check_in(employee, at) else "IN"


# ---------------------------------------------------------------------------
# Workdays
# ---------------------------------------------------------------------------


def format_time(time: datetime.datetime) -> str:
	"""A punch as the Workday's text fields show it."""
	return time.strftime("%-I:%M %p")


def fill_workday(workday: Workday, shifts: Iterable[Shift]) -> Workday:
	"""Write shifts into a Workday's slots, in the order they start, and total its hours.

	A missed punch keeps its slot with the other half blank. Shifts past the twelfth are dropped.
	"""
	ordered = sorted(shifts, key=lambda shift: shift.start)
	for i in range(1, WORKDAY_SLOTS + 1):
		shift = ordered[i - 1] if i <= len(ordered) else None
		for kind, punch in (
			("in", shift.check_in if shift else None),
			("out", shift.check_out if shift else None),
		):
			time = _datetime(punch.time) if punch is not None else None
			workday.set(f"check_{kind}_{i}", format_time(time) if time else None)
			workday.set(f"check_{kind}_{i}_dt", time)
	workday.total_hours = sum(shift.hours for shift in ordered[:WORKDAY_SLOTS])
	return workday


def sync_workday(
	employee: str, date: datetime.date | str, create: bool = True, exclude: Iterable[str] = ()
) -> Workday | None:
	"""Rebuild an employee's Workday for a date from the shifts that belong to that date.

	With ``create`` the Workday is made if it is missing; without it, only when the date has shifts.
	Writes go through db_insert and db_update, so the Workday's own hooks (which write punches back
	to Employee Checkins) do not run. A punch with no log type gets the one it was paired as.
	"""
	date = cast(datetime.date, getdate(date))
	excluded = list(exclude)
	shifts = get_shifts(date, date, employee, exclude=excluded).get(employee, [])
	name = frappe.db.get_value(
		"Workday", {"employee": employee, "date": date}, "name", order_by="creation asc"
	)
	if name:
		workday = cast(Workday, frappe.get_doc("Workday", cast(str, name)))
	elif create or shifts:
		workday = cast(Workday, frappe.new_doc("Workday"))
		workday.employee = employee
		workday.employee_name = cast(str, frappe.db.get_value("Employee", employee, "employee_name"))
		workday.date = date
		workday.day_of_week = calendar.day_name[date.weekday()]
		workday.last_modified = now_datetime()
		workday.db_insert(ignore_if_duplicate=True)
	else:
		return None

	fill_workday(workday, shifts)
	workday.db_update()
	for shift in shifts:
		for punch in shift.punches:
			values: dict[str, Any] = {"workday": workday.name}
			if punch.get("inferred_log_type"):
				values["log_type"] = punch.inferred_log_type
			frappe.db.set_value("Employee Checkin", punch.name, values, update_modified=False)
	return workday


def resync_around(employee: str, times: Iterable[datetime.datetime], exclude: Iterable[str] = ()) -> None:
	"""Rebuild every Workday a punch at one of ``times`` could belong to.

	Used after a punch is added, moved or deleted: the punch can change which shift its neighbours
	pair into, and a night shift's OUT belongs to the day before its own date.
	"""
	excluded = list(exclude)
	dates = sorted({date for time in times for date in _dates_around(_datetime(time))})
	for date in dates:
		sync_workday(employee, date, create=False, exclude=excluded)
