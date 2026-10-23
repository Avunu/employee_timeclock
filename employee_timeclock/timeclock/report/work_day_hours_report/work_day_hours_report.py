# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""Hours per employee per day, from Employee Checkins paired into shifts.

A shift's hours count on its IN's date, so a night shift that crosses midnight is one day's hours.
A missed punch counts no hours and flags the day.
"""

import datetime
from typing import Any, TypedDict, cast

import frappe
from frappe import _
from frappe.query_builder import DocType
from frappe.query_builder.functions import Max, Min
from frappe.utils import getdate

from employee_timeclock.timeclock.report.payroll_report.payroll_report import employee_name_of
from employee_timeclock.timeclock.shifts import Shift, get_shifts


class WorkDayHoursFilters(TypedDict, total=False):
	from_date: str
	to_date: str


def get_columns() -> list[dict[str, Any]]:
	return [
		{"fieldname": "date", "label": _("Date"), "fieldtype": "Date", "width": 120},
		{"fieldname": "employee", "label": _("Employee"), "fieldtype": "Link", "options": "Employee", "width": 150},
		{"fieldname": "employee_name", "label": _("Employee Name"), "fieldtype": "Data", "width": 200},
		{"fieldname": "total_work_hour", "label": _("Work Hours"), "fieldtype": "Data", "width": 120},
		{"fieldname": "missed_punch", "label": _("Missed Punch"), "fieldtype": "Check", "width": 115},
	]


def _date_range(filters: WorkDayHoursFilters) -> tuple[datetime.date, datetime.date] | None:
	"""The report's dates: the filters', or, where one is left blank, the first or last punch's."""
	from_date: Any = filters.get("from_date")
	to_date: Any = filters.get("to_date")
	if not (from_date and to_date):
		checkins = DocType("Employee Checkin")
		first, last = frappe.qb.from_(checkins).select(Min(checkins.time), Max(checkins.time)).run()[0]
		from_date, to_date = from_date or first, to_date or last
	if not (from_date and to_date):
		return None
	return cast(datetime.date, getdate(from_date)), cast(datetime.date, getdate(to_date))


def get_data(filters: WorkDayHoursFilters) -> list[dict[str, Any]]:
	date_range = _date_range(filters)
	if date_range is None:
		return []
	days: dict[tuple[datetime.date, str], list[Shift]] = {}
	for employee, shifts in get_shifts(*date_range, fields=("employee_name",)).items():
		for shift in shifts:
			days.setdefault((shift.date, employee), []).append(shift)
	rows = [
		{
			"date": date,
			"employee": employee,
			"employee_name": employee_name_of(shifts),
			"total_work_hour": datetime.timedelta(seconds=round(sum(shift.hours for shift in shifts) * 3600)),
			"missed_punch": int(any(shift.missed for shift in shifts)),
		}
		for (date, employee), shifts in days.items()
	]
	rows.sort(key=lambda row: (row["date"], row["employee_name"], row["employee"]))
	return rows


def execute(filters: WorkDayHoursFilters | None = None) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
	filters = cast(WorkDayHoursFilters, dict(filters or {}))
	return get_columns(), get_data(filters)
