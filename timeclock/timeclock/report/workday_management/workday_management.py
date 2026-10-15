# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import calendar
import datetime
from itertools import groupby
from typing import Any, TypedDict, cast

import frappe
from frappe import _
from frappe.query_builder import DocType
from frappe.utils import add_days, cint, flt, get_datetime, get_first_day_of_week, get_time, getdate, today

from timeclock.timeclock.api import LogType, build_workday, check_range
from timeclock.timeclock.custom.employee_checkin import EmployeeCheckin
from timeclock.timeclock.doctype.workday.workday import Workday

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
	"""All Workdays and Employee Checkins for one employee on one date."""

	employee: str
	employee_name: str
	date: datetime.date
	workdays: list[dict]
	checkins: list[dict]


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
			"fieldname": "log_type",
			"label": _("Log Type"),
			"fieldtype": "Data",
			"width": 90,
			"editable": True,
		},
		{
			"fieldname": "hours",
			"label": _("Workday Hours"),
			"fieldtype": "Float",
			"width": 120,
		},
		{
			"fieldname": "punch_hours",
			"label": _("Punch Hours"),
			"fieldtype": "Float",
			"width": 110,
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


def _get_workdays(filters: WorkdayManagementFilters) -> list[dict]:
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


def _get_checkins(filters: WorkdayManagementFilters) -> list[dict]:
	query = (
		frappe.qb.from_(Checkins)
		.select(
			Checkins.name,
			Checkins.employee,
			Checkins.employee_name,
			Checkins.time,
			Checkins.log_type,
			Checkins.device_id,
			Checkins.manual_override,
			Checkins.workday_override,
			Checkins.overridden_time,
		)
		.where(Checkins.time >= getdate(filters["from_date"]))
		.where(Checkins.time < add_days(getdate(filters["to_date"]), 1))
		.orderby(Checkins.time)
		.orderby(Checkins.creation)
	)
	employee = filters.get("employee")
	if employee:
		query = query.where(Checkins.employee == employee)
	return query.run(as_dict=True)


def _get_days(filters: WorkdayManagementFilters) -> list[Day]:
	"""Pair Workdays with Employee Checkins by employee and date.

	This is the same relationship build_workday uses, so checkins that never got a
	Workday (or whose workday link is stale) still show up.
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
				"checkins": [],
			}
		return days[key]

	for workday in _get_workdays(filters):
		day_for(workday.employee, workday.employee_name, getdate(workday.date))["workdays"].append(workday)
	for checkin in _get_checkins(filters):
		day_for(checkin.employee, checkin.employee_name, get_datetime(checkin.time).date())[
			"checkins"
		].append(checkin)

	return list(days.values())


def _pair_hours(times: list[datetime.datetime]) -> list[float | None]:
	"""Hours per punch, paired positionally like build_workday; each pair's second punch carries its duration."""
	return [(times[i] - times[i - 1]).total_seconds() / 3600 if i % 2 else None for i in range(len(times))]


def _get_issues(workday: dict | None, duplicate: bool, checkins: list[dict], punch_hours: float) -> list[str]:
	issues: list[str] = []
	if workday is None:
		issues.append(NO_WORKDAY)
	elif duplicate:
		issues.append(DUPLICATE_WORKDAY)

	if len(checkins) % 2:
		issues.append(MISSING_PUNCH)

	if workday is not None:
		stored = sorted(
			get_datetime(workday[field]).replace(microsecond=0) for field in _slot_fields() if workday[field]
		)
		punched = [get_datetime(c.time).replace(microsecond=0) for c in checkins]
		if stored != punched or flt(workday.total_hours, 2) != flt(punch_hours, 2):
			issues.append(OUT_OF_SYNC)

	if any(c.log_type != ("OUT" if i % 2 else "IN") for i, c in enumerate(checkins)):
		issues.append(LOG_TYPE_MISMATCH)

	if not checkins and not issues:
		issues.append(NO_PUNCHES)

	return issues


def _format_day(date: datetime.date) -> str:
	return date.strftime("%A, %B %-d")


def _format_time(time: datetime.datetime) -> str:
	# matches the format build_workday writes to the Workday check_in/check_out fields
	return time.strftime("%-I:%M %p")


def _day_rows(day: Day, group_by: str) -> list[dict]:
	"""Workday rows (indent 1) for a day, with its checkin rows (indent 2) under the first Workday."""
	checkins = day["checkins"]
	times = [get_datetime(c.time) for c in checkins]
	pair_hours = _pair_hours(times)
	punch_hours = sum(h for h in pair_hours if h)

	workdays: list[dict | None] = list(day["workdays"]) or [None]
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
		issues = _get_issues(workday, duplicate, checkins, punch_hours)
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
				# checkins belong to the day, so only the first Workday carries them
				"punch_hours": punch_hours if idx == 0 else None,
				"workday": workday_name,
			}
		)
		if idx:
			continue

		for i, (checkin, time) in enumerate(zip(checkins, times, strict=True)):
			if checkin.workday_override:
				override = _("Workday Edit")
			elif checkin.manual_override:
				override = _("Manual")
			else:
				override = ""
			rows.append(
				{
					**common,
					"row_type": "checkin",
					"row_key": f"checkin:{checkin.name}",
					"indent": 2,
					# the Workday slot this punch lands in (IN1, OUT1, IN2, ...)
					"label": f"{'OUT' if i % 2 else 'IN'}{i // 2 + 1}",
					"time": _format_time(time),
					"time_value": time.strftime("%H:%M"),
					"log_type": checkin.log_type or "",
					"punch_hours": pair_hours[i],
					"device_id": checkin.device_id or "",
					"override": override,
					"overridden_time": _format_time(get_datetime(checkin.overridden_time))
					if checkin.overridden_time
					else "",
					"workday": workday_name,
					"checkin": checkin.name,
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
		days.sort(key=lambda d: (d["employee_name"].lower(), d["employee"], d["date"].toordinal()))

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
				"punch_hours": sum(flt(r["punch_hours"]) for r in workday_rows),
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
		for key in ("hours", "punch_hours"):
			total_row[key] = sum(flt(r.get(key)) for r in data if r.get("indent") == 0)
		data.append(total_row)

	return columns, data


# ---------------------------------------------------------------------------
# Whitelisted helpers (called from JS)
# ---------------------------------------------------------------------------


def sync_workday(employee: str, date: datetime.date | str) -> Workday:
	"""Rebuild an employee's Workday for a date from their Employee Checkins, creating it if missing.

	Writes go through db_insert/db_update so the Workday on_update hook
	(update_checkins_from_workday), which deletes checkins for blank slots, doesn't fire.
	"""
	date = cast(datetime.date, getdate(date))
	name = frappe.db.get_value(
		"Workday", {"employee": employee, "date": date}, "name", order_by="creation asc"
	)
	if name:
		workday = cast(Workday, frappe.get_doc("Workday", cast(str, name)))
	else:
		workday = cast(Workday, frappe.new_doc("Workday"))
		workday.employee = employee
		workday.employee_name = cast(str, frappe.db.get_value("Employee", employee, "employee_name"))
		workday.date = date
		workday.day_of_week = calendar.day_name[date.weekday()]
		workday.db_insert()

	day_filter = (
		(Checkins.employee == employee) & (Checkins.time >= date) & (Checkins.time < add_days(date, 1))
	)
	times = (
		frappe.qb.from_(Checkins)
		.select(Checkins.time)
		.where(day_filter)
		.orderby(Checkins.time)
		.run(pluck=True)
	)

	workday = build_workday([get_datetime(t) for t in times], workday)
	workday.db_update()
	frappe.qb.update(Checkins).set(Checkins.workday, workday.name).where(day_filter).run()
	return workday


def _validate_log_type(log_type: str) -> LogType:
	if log_type not in ("IN", "OUT"):
		frappe.throw(_("Log Type must be IN or OUT"))
	return cast(LogType, log_type)


@frappe.whitelist()
def update_checkin(checkin: str, fieldname: str, value: str) -> str:
	"""Update the time (within the same day) or log type of an Employee Checkin, then resync its Workday."""
	frappe.has_permission("Workday", "write", throw=True)
	if fieldname not in ("time", "log_type"):
		frappe.throw(_("Field {0} is not editable").format(fieldname))

	doc = cast(EmployeeCheckin, frappe.get_doc("Employee Checkin", checkin))
	original_time = get_datetime(doc.time)

	if fieldname == "time":
		new_time = datetime.datetime.combine(original_time.date(), get_time(value))
		if new_time == original_time:
			return _("No changes made")
		# keep the original punch for audit, same as edits made through the Workday form
		if not doc.workday_override:
			doc.workday_override = 1
			doc.overridden_time = original_time
		doc.time = new_time
	else:
		doc.log_type = _validate_log_type(value)

	doc.save()
	sync_workday(doc.employee, original_time.date())
	return _("{0} updated").format(doc.name)


@frappe.whitelist()
def add_checkin(employee: str, date: str, time: str, log_type: str) -> str:
	"""Create an Employee Checkin for an employee on a date, then resync that day's Workday."""
	frappe.has_permission("Workday", "write", throw=True)

	doc = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
	doc.employee = employee
	doc.time = datetime.datetime.combine(getdate(date), get_time(time))
	doc.log_type = _validate_log_type(log_type)
	doc.device_id = DEVICE_ID
	doc.insert()

	sync_workday(employee, date)
	return _("{0} added").format(doc.name)


@frappe.whitelist()
def delete_checkins(checkins: str | list) -> str:
	"""Delete Employee Checkins, then resync each affected Workday."""
	frappe.has_permission("Workday", "write", throw=True)
	names: list[str] = frappe.parse_json(checkins) if isinstance(checkins, str) else checkins

	days: set[tuple[str, datetime.date]] = set()
	for name in names:
		doc = cast(EmployeeCheckin, frappe.get_doc("Employee Checkin", name))
		days.add((doc.employee, get_datetime(doc.time).date()))
		doc.delete()

	for employee, date in days:
		sync_workday(employee, date)
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
