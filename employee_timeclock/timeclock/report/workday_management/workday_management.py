# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import datetime
from itertools import groupby
from typing import Any, TypedDict, cast

import frappe
from frappe import _
from frappe.query_builder import DocType
from frappe.utils import cint, flt, get_datetime, get_first_day_of_week, get_time, getdate, today

from employee_timeclock.timeclock import shifts as shift_rules
from employee_timeclock.timeclock.api import check_range
from employee_timeclock.timeclock.custom.employee_checkin import EmployeeCheckin
from employee_timeclock.timeclock.doctype.workday.workday import Workday
from employee_timeclock.timeclock.shifts import (
	Shift,
	format_time,
	get_max_shift_hours,
	get_shift_of,
	get_shifts,
)

Workdays = DocType("Workday")
Checkins = DocType("Employee Checkin")

# device_id stamped on checkins created here, matching api.update_checkins_from_workday
DEVICE_ID = "Workday Management"

# Workday statuses, in priority order (the first issue found becomes the row status).
# Kept untranslated so the client can key indicator colors off them.
NO_WORKDAY = "No Workday"
DUPLICATE_WORKDAY = "Duplicate Workday"
MISSING_PUNCH = "Missing Punch"
OUT_OF_SYNC = "Out of Sync"
LOG_TYPE_MISMATCH = "Log Type Mismatch"
NO_PUNCHES = "No Punches"
OK = "OK"


class WorkdayManagementFilters(TypedDict, total=False):
	from_date: str
	to_date: str
	group_by: str
	employee: str
	issues_only: int


class Day(TypedDict):
	"""All Workdays for one employee on one date, and the shifts that belong to that date."""

	employee: str
	employee_name: str
	date: datetime.date
	workdays: list[frappe._dict]
	shifts: list[Shift]


# the Employee Checkin fields the punch rows show
PUNCH_ROW_FIELDS = ("employee_name", "device_id", "manual_override", "workday_override", "overridden_time")


def _datetime(value: Any) -> datetime.datetime:
	"""get_datetime for a value that is set (a punch time); frappe types the result Optional."""
	return cast(datetime.datetime, get_datetime(value))


def _date(value: Any) -> datetime.date:
	"""getdate for a value that is set; frappe types the result Optional."""
	return cast(datetime.date, getdate(value))


def get_columns(group_by: str = "Employee") -> list[dict]:
	columns = [
		{
			"fieldname": "label",
			"label": _("Employee") if group_by == "Employee" else _("Day"),
			"fieldtype": "Data",
			"width": 220,
		},
		{
			"fieldname": "status",
			"label": _("Status"),
			"fieldtype": "Data",
			"width": 140,
		},
		{
			"fieldname": "time",
			"label": _("Time"),
			"fieldtype": "Data",
			"width": 100,
			"editable": True,
		},
		{
			"fieldname": "hours",
			"label": _("Hours"),
			"fieldtype": "Float",
			"width": 100,
			"editable": True,
		},
		{
			"fieldname": "device_id",
			"label": _("Source"),
			"fieldtype": "Data",
			"width": 150,
		},
		{
			"fieldname": "override",
			"label": _("Override"),
			"fieldtype": "Data",
			"width": 110,
		},
		{
			"fieldname": "workday",
			"label": _("Workday"),
			"fieldtype": "Link",
			"options": "Workday",
			"width": 220,
		},
		{
			"fieldname": "checkin",
			"label": _("Employee Checkin"),
			"fieldtype": "Link",
			"options": "Employee Checkin",
			"width": 170,
		},
	]
	# Datatable column sorting sorts the tree's rows flat, mixing days and punches across
	# employees, so the row order from get_data is the only order
	for column in columns:
		column.update(sortable=False, dropdown=False)
	return columns


# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------


def _slot_fields() -> list[str]:
	"""Workday punch datetime fields in slot order: check_in_1_dt, check_out_1_dt, check_in_2_dt, ..."""
	return [f"check_{kind}_{i}_dt" for i in check_range for kind in ("in", "out")]


def _get_workdays(filters: WorkdayManagementFilters) -> list[frappe._dict]:
	query = (
		frappe.qb.from_(Workdays)
		.select(
			Workdays.name,
			Workdays.employee,
			Workdays.employee_name,
			Workdays.date,
			Workdays.total_hours,
			*(Workdays[field] for field in _slot_fields()),
		)
		.where(Workdays.date.between(getdate(filters["from_date"]), getdate(filters["to_date"])))
		.orderby(Workdays.creation)
	)
	employee = filters.get("employee")
	if employee:
		query = query.where(Workdays.employee == employee)
	return query.run(as_dict=True)


def _get_days(filters: WorkdayManagementFilters) -> list[Day]:
	"""Pair Workdays with the shifts that belong to their date, by employee and date.

	A shift belongs to its IN's date, the same rule the Workday sync uses, so a night shift's punches
	sit under the day it started, and punches that never got a Workday still show up.
	"""
	days: dict[tuple[str, datetime.date], Day] = {}

	def day_for(employee: str, employee_name: str | None, date: datetime.date) -> Day:
		key = (employee, date)
		if key not in days:
			days[key] = {
				"employee": employee,
				"employee_name": employee_name or employee,
				"date": date,
				"workdays": [],
				"shifts": [],
			}
		return days[key]

	for workday in _get_workdays(filters):
		day_for(cast(str, workday.employee), workday.employee_name, _date(workday.date))["workdays"].append(
			workday
		)
	shifts = get_shifts(
		filters["from_date"], filters["to_date"], filters.get("employee") or None, fields=PUNCH_ROW_FIELDS
	)
	for employee, employee_shifts in shifts.items():
		for shift in employee_shifts:
			day_for(employee, shift.punches[0].employee_name, shift.date)["shifts"].append(shift)

	return list(days.values())


def _get_issues(
	workday: frappe._dict | None, duplicate: bool, shifts: list[Shift], punch_hours: float
) -> list[str]:
	issues: list[str] = []
	if workday is None:
		issues.append(NO_WORKDAY)
	elif duplicate:
		issues.append(DUPLICATE_WORKDAY)

	if any(shift.missed for shift in shifts):
		issues.append(MISSING_PUNCH)

	checkins = [punch for shift in shifts for punch in shift.punches]

	if workday is not None:
		stored = sorted(
			_datetime(workday[field]).replace(microsecond=0) for field in _slot_fields() if workday[field]
		)
		punched = sorted(_datetime(c.time).replace(microsecond=0) for c in checkins)
		if stored != punched or flt(cast(float, workday.total_hours), 2) != flt(punch_hours, 2):
			issues.append(OUT_OF_SYNC)

	# a punch with no log type is paired by where it falls; Rebuild Workdays stores the one it got
	if any(c.log_type not in ("IN", "OUT") for c in checkins):
		issues.append(LOG_TYPE_MISMATCH)

	if not checkins and not issues:
		issues.append(NO_PUNCHES)

	return issues


def _format_day(date: datetime.date) -> str:
	return date.strftime("%A, %B %-d")


def _format_time(time: datetime.datetime) -> str:
	# matches the format fill_workday writes to the Workday check_in/check_out fields
	return format_time(time)


def _punch_row(checkin: frappe._dict, kind: str, slot: int, shift: Shift, date: datetime.date) -> dict:
	"""The row for one punch: its Workday slot (IN1, OUT1, IN2, ...), its time and its shift's hours."""
	time = _datetime(checkin.time)
	if checkin.workday_override:
		override = _("Workday Edit")
	elif checkin.manual_override:
		override = _("Manual")
	else:
		override = ""
	return {
		"row_type": "checkin",
		"row_key": f"checkin:{checkin.name}",
		"indent": 2,
		"label": f"{kind}{slot}",
		# a night shift's OUT shows that it is the next day's
		"time": _format_time(time) + (" (+1)" if time.date() > date else ""),
		"time_value": time.strftime("%H:%M"),
		# each OUT carries the hours since its IN; a missed punch has none
		"hours": None if kind == "IN" or shift.missed else shift.hours,
		"device_id": checkin.device_id or "",
		"override": override,
		"overridden_time": _format_time(_datetime(checkin.overridden_time))
		if checkin.overridden_time
		else "",
		"checkin": checkin.name,
	}


def _day_rows(day: Day, group_by: str) -> list[dict]:
	"""Workday rows (indent 1) for a day, with its checkin rows (indent 2) under the first Workday."""
	shifts = sorted(day["shifts"], key=lambda shift: shift.start)
	punch_hours = sum(shift.hours for shift in shifts)

	workdays: list[frappe._dict | None] = list(day["workdays"]) or [None]
	duplicate = len(workdays) > 1
	date = str(day["date"])
	label = _format_day(day["date"]) if group_by == "Employee" else day["employee_name"]
	common = {
		"employee": day["employee"],
		"employee_name": day["employee_name"],
		"date": date,
	}

	rows: list[dict] = []
	for idx, workday in enumerate(workdays):
		workday_name = workday.name if workday else ""
		issues = _get_issues(workday, duplicate, shifts, punch_hours)
		rows.append(
			{
				**common,
				"row_type": "workday",
				"row_key": f"workday:{workday_name}:{day['employee']}:{date}",
				"indent": 1,
				"label": label,
				"status": issues[0] if issues else OK,
				"issues": ", ".join(_(issue) for issue in issues),
				"hours": flt(workday.total_hours) if workday else None,
				"workday": workday_name,
			}
		)
		if idx:
			continue

		for slot, shift in enumerate(shifts, start=1):
			for kind, checkin in (("IN", shift.check_in), ("OUT", shift.check_out)):
				if checkin is not None:
					rows.append(
						{
							**common,
							**_punch_row(checkin, kind, slot, shift, day["date"]),
							"workday": workday_name,
						}
					)

		# Blank punch row closing the day; a time entered in it adds a punch for this employee and date
		rows.append(
			{
				**common,
				"row_type": "new_punch",
				"row_key": f"new_punch:{day['employee']}:{date}",
				"indent": 2,
				"label": _("Add Punch"),
				"workday": workday_name,
			}
		)

	return rows


def get_data(filters: WorkdayManagementFilters) -> list[dict]:
	group_by = filters.get("group_by") or "Employee"
	issues_only = cint(filters.get("issues_only"))

	# Newest day first; punches within a day stay in time order so IN1/OUT1/... read top-down
	days = _get_days(filters)
	if group_by == "Day":
		days.sort(key=lambda d: (-d["date"].toordinal(), d["employee_name"].lower()))
	else:
		days.sort(key=lambda d: (d["employee_name"].lower(), d["employee"], -d["date"].toordinal()))

	result: list[dict] = []
	for _key, group_days in groupby(days, key=lambda d: d["date"] if group_by == "Day" else d["employee"]):
		group_days = list(group_days)
		rows: list[dict] = []
		for day in group_days:
			day_rows = _day_rows(day, group_by)
			if issues_only and all(r["status"] == OK for r in day_rows if r["row_type"] == "workday"):
				continue
			rows += day_rows
		if not rows:
			continue

		workday_rows = [r for r in rows if r["row_type"] == "workday"]
		first = group_days[0]
		result.append(
			{
				"row_type": "group",
				"row_key": f"group:{first['employee'] if group_by == 'Employee' else first['date']}",
				"indent": 0,
				"label": first["employee_name"] if group_by == "Employee" else _format_day(first["date"]),
				"issue_count": sum(1 for r in workday_rows if r["status"] != OK),
				"hours": sum(flt(r["hours"]) for r in workday_rows),
				"employee": first["employee"] if group_by == "Employee" else "",
				"date": str(first["date"]) if group_by == "Day" else "",
			}
		)
		result += rows

	return result


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def execute(filters: WorkdayManagementFilters | None = None):
	filters = cast(WorkdayManagementFilters, dict(filters or {}))
	filters.setdefault("from_date", get_first_day_of_week(today(), as_str=True))
	filters.setdefault("to_date", today())
	group_by = filters.get("group_by") or "Employee"

	columns = get_columns(group_by=group_by)
	data = get_data(filters)

	# Build total row from group-level rows only (indent 0) to avoid double-counting
	if data:
		total_row: dict[str, Any] = {"label": _("Total"), "indent": 0, "row_type": "total"}
		total_row["hours"] = sum(flt(r.get("hours")) for r in data if r.get("indent") == 0)
		data.append(total_row)

	return columns, data


# ---------------------------------------------------------------------------
# Whitelisted helpers (called from JS)
# ---------------------------------------------------------------------------


def sync_workday(employee: str, date: datetime.date | str) -> Workday:
	"""Rebuild an employee's Workday for a date from the shifts that belong to it, creating it if missing."""
	return cast(Workday, shift_rules.sync_workday(employee, date, create=True))


def _move_checkin(doc: EmployeeCheckin, new_time: datetime.datetime) -> str:
	"""Move an Employee Checkin to new_time, then resync the Workdays around both times."""
	original_time = _datetime(doc.time)
	if new_time == original_time:
		return _("No changes made")
	# keep the original punch for audit, same as edits made through the Workday form
	if not doc.workday_override:
		doc.workday_override = 1
		doc.overridden_time = original_time
	doc.time = new_time

	doc.save()
	shift_rules.resync_around(doc.employee, [original_time, new_time])
	return _("{0} updated").format(doc.name)


@frappe.whitelist()
def update_checkin(checkin: str, time: str) -> str:
	"""Move an Employee Checkin to a new time of day, then resync its Workday.

	An IN keeps its date. The OUT of a shift is put at the first such time after its IN, so a night
	shift's OUT can be moved across midnight either way.
	"""
	frappe.has_permission("Workday", "write", throw=True)

	doc = cast(EmployeeCheckin, frappe.get_doc("Employee Checkin", checkin))
	original_time = _datetime(doc.time)
	new_time = datetime.datetime.combine(original_time.date(), get_time(time))
	shift = get_shift_of(checkin, doc.employee, original_time)
	if (
		shift
		and shift.check_in is not None
		and shift.check_out is not None
		and shift.check_out.name == doc.name
	):
		check_in_time = _datetime(shift.check_in.time)
		new_time = datetime.datetime.combine(check_in_time.date(), get_time(time))
		if new_time < check_in_time:
			new_time += datetime.timedelta(days=1)
	return _move_checkin(doc, new_time)


@frappe.whitelist()
def set_punch_hours(checkin: str, hours: float) -> str:
	"""Move an OUT punch so it falls `hours` after the IN it pairs with, then resync its Workday.

	The hours may run past midnight, up to the maximum shift length, but the OUT can't reach the
	employee's next punch.
	"""
	frappe.has_permission("Workday", "write", throw=True)
	hours = flt(hours)
	if hours <= 0:
		frappe.throw(_("Hours must be more than 0"))
	max_hours = get_max_shift_hours()
	if hours > max_hours:
		frappe.throw(
			_("{0} hours is longer than the maximum shift of {1} hours").format(
				f"{hours:g}", f"{max_hours:g}"
			)
		)

	doc = cast(EmployeeCheckin, frappe.get_doc("Employee Checkin", checkin))
	shift = get_shift_of(checkin, doc.employee, _datetime(doc.time))
	check_out = shift.check_out if shift else None
	if check_out is None or check_out.name != doc.name:
		frappe.throw(_("Hours can only be set on an OUT punch"))
	check_in = shift.check_in if shift else None
	if check_in is None:
		frappe.throw(_("This OUT punch has no IN to count the hours from"))
	check_in_time = _datetime(cast(frappe._dict, check_in).time)

	new_time = check_in_time + datetime.timedelta(seconds=round(hours * 3600))
	# the punch has to stay in its shift: before the employee's next punch
	next_punch = (
		frappe.qb.from_(Checkins)
		.select(Checkins.time)
		.where(Checkins.employee == doc.employee)
		.where(Checkins.time > check_in_time)
		.where(Checkins.name != doc.name)
		.orderby(Checkins.time)
		.limit(1)
		.run(pluck="time")
	)
	if next_punch:
		next_time = _datetime(next_punch[0])
		if new_time >= next_time:
			frappe.throw(
				_("{0} hours would end the shift after the next punch at {1}").format(
					f"{hours:g}", _format_time(next_time)
				)
			)
	return _move_checkin(doc, new_time)


@frappe.whitelist()
def add_checkin(employee: str, date: str, time: str) -> str:
	"""Create an Employee Checkin for an employee at a date and time, then resync the Workdays around it.

	It is OUT when the employee has an IN open at that time, from the last maximum shift length, and
	IN otherwise. A night shift's OUT is added on the next day's date.
	"""
	frappe.has_permission("Workday", "write", throw=True)

	doc = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
	doc.employee = employee
	doc.time = datetime.datetime.combine(_date(date), get_time(time))
	doc.log_type = shift_rules.next_log_type(employee, doc.time)
	doc.device_id = DEVICE_ID
	doc.insert()

	shift_rules.resync_around(employee, [doc.time])
	return _("{0} added").format(doc.name)


@frappe.whitelist()
def delete_checkins(checkins: str | list) -> str:
	"""Delete Employee Checkins, then resync each affected Workday."""
	frappe.has_permission("Workday", "write", throw=True)
	names: list[str] = frappe.parse_json(checkins) if isinstance(checkins, str) else checkins

	punches: dict[str, list[datetime.datetime]] = {}
	for name in names:
		doc = cast(EmployeeCheckin, frappe.get_doc("Employee Checkin", name))
		punches.setdefault(doc.employee, []).append(_datetime(doc.time))
		doc.delete()

	for employee, times in punches.items():
		shift_rules.resync_around(employee, times)
	return _("{0} punch(es) deleted").format(len(names))


@frappe.whitelist()
def rebuild_workdays(days: str | list) -> str:
	"""Resync Workdays from Employee Checkins for a list of {employee, date} days."""
	frappe.has_permission("Workday", "write", throw=True)
	parsed: list[dict] = frappe.parse_json(days) if isinstance(days, str) else days

	unique = {(d["employee"], str(getdate(d["date"]))) for d in parsed}
	for employee, date in unique:
		sync_workday(employee, date)
	return _("{0} workday(s) rebuilt").format(len(unique))
