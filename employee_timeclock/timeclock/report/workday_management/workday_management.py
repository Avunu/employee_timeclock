# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import calendar
import datetime
from itertools import groupby
from typing import Any, TypedDict, cast

import frappe
from frappe import _
from frappe.query_builder import DocType
from frappe.query_builder.functions import Count
from frappe.utils import add_days, cint, flt, get_datetime, get_first_day_of_week, get_time, getdate, today

from employee_timeclock.timeclock.api import LogType, build_workday, check_range
from employee_timeclock.timeclock.custom.employee_checkin import EmployeeCheckin
from employee_timeclock.timeclock.doctype.workday.workday import Workday

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
	workdays: list[frappe._dict]
	checkins: list[frappe._dict]


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


def _get_checkins(filters: WorkdayManagementFilters) -> list[frappe._dict]:
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
		.where(Checkins.time < add_days(_date(filters["to_date"]), 1))
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
		day_for(cast(str, workday.employee), workday.employee_name, _date(workday.date))["workdays"].append(
			workday
		)
	for checkin in _get_checkins(filters):
		day_for(cast(str, checkin.employee), checkin.employee_name, _datetime(checkin.time).date())[
			"checkins"
		].append(checkin)

	return list(days.values())


def _pair_hours(times: list[datetime.datetime]) -> list[float | None]:
	"""Hours per punch, paired positionally like build_workday; each pair's second punch carries its duration."""
	return [(times[i] - times[i - 1]).total_seconds() / 3600 if i % 2 else None for i in range(len(times))]


def _get_issues(
	workday: frappe._dict | None, duplicate: bool, checkins: list[frappe._dict], punch_hours: float
) -> list[str]:
	issues: list[str] = []
	if workday is None:
		issues.append(NO_WORKDAY)
	elif duplicate:
		issues.append(DUPLICATE_WORKDAY)

	if len(checkins) % 2:
		issues.append(MISSING_PUNCH)

	if workday is not None:
		stored = sorted(
			_datetime(workday[field]).replace(microsecond=0) for field in _slot_fields() if workday[field]
		)
		punched = [_datetime(c.time).replace(microsecond=0) for c in checkins]
		if stored != punched or flt(cast(float, workday.total_hours), 2) != flt(punch_hours, 2):
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
	times = [_datetime(c.time) for c in checkins]
	pair_hours = _pair_hours(times)
	punch_hours = sum(h for h in pair_hours if h)

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
					# each OUT carries the hours since its IN
					"hours": pair_hours[i],
					"device_id": checkin.device_id or "",
					"override": override,
					"overridden_time": _format_time(_datetime(checkin.overridden_time))
					if checkin.overridden_time
					else "",
					"workday": workday_name,
					"checkin": checkin.name,
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


def _day_filter(employee: str, date: datetime.date):
	return (Checkins.employee == employee) & (Checkins.time >= date) & (Checkins.time < add_days(date, 1))


def _day_punches(employee: str, date: datetime.date) -> list[frappe._dict]:
	"""An employee's Employee Checkins on a date, in the order the report pairs them (IN1, OUT1, IN2, ...)."""
	return (
		frappe.qb.from_(Checkins)
		.select(Checkins.name, Checkins.time, Checkins.log_type)
		.where(_day_filter(employee, date))
		.orderby(Checkins.time)
		.orderby(Checkins.creation)
		.run(as_dict=True)
	)


def sync_workday(employee: str, date: datetime.date | str) -> Workday:
	"""Rebuild an employee's Workday for a date from their Employee Checkins, creating it if missing.

	Writes go through db_insert/db_update so the Workday on_update hook
	(update_checkins_from_workday), which deletes checkins for blank slots, doesn't fire.
	"""
	date = _date(date)
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

	day_filter = _day_filter(employee, date)
	punches = _day_punches(employee, date)

	workday = build_workday([_datetime(punch.time) for punch in punches], workday)
	workday.db_update()
	frappe.qb.update(Checkins).set(Checkins.workday, workday.name).where(day_filter).run()

	# The day alternates IN, OUT, IN, ... by time. The employee clock pages read the last
	# punches log_type to pick the next one, so keep every stored value on that pattern.
	for i, punch in enumerate(punches):
		log_type = "OUT" if i % 2 else "IN"
		if punch.log_type != log_type:
			frappe.qb.update(Checkins).set(Checkins.log_type, log_type).where(
				Checkins.name == punch.name
			).run()
	return workday


def _next_log_type(employee: str, time: datetime.datetime) -> LogType:
	"""IN or OUT for a new punch, by the slot it lands in among the employee's punches that day."""
	earlier = (
		frappe.qb.from_(Checkins)
		.select(Count("*"))
		.where(Checkins.employee == employee)
		.where(Checkins.time >= time.date())
		.where(Checkins.time < time)
		.run()[0][0]
	)
	return "OUT" if earlier % 2 else "IN"


def _move_checkin(doc: EmployeeCheckin, new_time: datetime.datetime) -> str:
	"""Move an Employee Checkin to new_time, then resync its Workday."""
	original_time = _datetime(doc.time)
	if new_time == original_time:
		return _("No changes made")
	# keep the original punch for audit, save as edits made through the Workday form
	if not doc.workday_override:
		doc.workday_override = 1
		doc.overridden_time = original_time
	doc.time = new_time

	doc.save()
	sync_workday(doc.employee, original_time.date())
	return _("{0} updated").format(doc.name)


@frappe.whitelist()
def update_checkin(checkin: str, time: str) -> str:
	"""Move an Employee Checkin to a new time wihtin its day, then resync its Workday."""
	frappe.has_permission("Workday", "write", throw=True)

	doc = cast(EmployeeCheckin, frappe.get_doc("Employee Checkin", checkin))
	date = _datetime(doc.time).date()
	return _move_checkin(doc, datetime.datetime.combine(date, get_time(time)))


@frappe.whitelist()
def set_punch_hours(checkin: str, hours: float) -> str:
	"""Move and OUT punch so it falls `hours` after the IN it pairs with, then resync its Workday."""
	frappe.has_permission("Workday", "write", throw=True)
	hours = flt(hours)
	if hours <= 0:
		frappe.throw(_("Hours must be more than 0"))

	doc = cast(EmployeeCheckin, frappe.get_doc("Employee Checkin", checkin))
	date = _datetime(doc.time).date()
	punches = _day_punches(doc.employee, date)
	idx = next(i for i, punch in enumerate(punches) if punch.name == doc.name)
	if idx % 2 == 0:
		frappe.throw(_("Hours can only be set on an OUT punch"))

	new_time = _datetime(punches[idx - 1].time) + datetime.timedelta(seconds=round(hours * 3600))
	# the punch has to stay in its slot: same day, and before the next punch
	if new_time.date() != date:
		frappe.throw(_("{0} hours would end the shift after midnight").format(f"{hours:g}"))
	if idx + 1 < len(punches):
		next_time = _datetime(punches[idx + 1].time)
		if new_time >= next_time:
			frappe.throw(
				_("{0} hours would end the shift after the next punch at {1}").format(
					f"{hours:g}", _format_time(next_time)
				)
			)
	return _move_checkin(doc, new_time)



@frappe.whitelist()
def add_checkin(employee: str, date: str, time: str) -> str:
	"""Create an Employee Checkin for an employee on a date, then resync that day's workday."""
	frappe.has_permission("Workday", "write", throw=True)

	doc = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
	doc.employee = employee
	doc.time = datetime.datetime.combine(_date(date), get_time(time))
	doc.log_type = _next_log_type(employee, doc.time)
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
		days.add((doc.employee, _datetime(doc.time).date()))
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
