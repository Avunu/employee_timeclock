# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""Regular and overtime hours per employee, from Employee Checkins paired into shifts.

Each IN is paired with the OUT that closes it (``employee_timeclock.timeclock.shifts``), and a
shift's hours count on its IN's date, so a night shift that crosses midnight, or the end of a week,
counts whole in the week it started. A missed punch counts no hours and flags the employee.
"""

import datetime
from typing import Any, TypedDict, cast

from frappe import _
from frappe.utils import flt, getdate

from employee_timeclock.timeclock.shifts import Shift, get_shifts

WEEKLY_REGULAR_HOURS = 40
"""Hours in a week paid at the regular rate; the rest is overtime."""


class PayrollReportFilters(TypedDict, total=False):
	start_date: str
	end_date: str


def week_start(date: datetime.date) -> datetime.date:
	"""The Sunday a payroll week starts on, the week MariaDB's ``WEEK()`` uses, without splitting a
	week that spans New Year's Day."""
	return date - datetime.timedelta(days=(date.weekday() + 1) % 7)


def employee_name_of(shifts: list[Shift]) -> str:
	names = [
		str(punch.employee_name) for shift in shifts for punch in shift.punches if punch.get("employee_name")
	]
	return max(names) if names else ""


def get_columns() -> list[dict[str, Any]]:
	return [
		{
			"fieldname": "employee",
			"label": _("Employee"),
			"fieldtype": "Link",
			"options": "Employee",
			"width": 150,
		},
		{"fieldname": "employee_name", "label": _("Employee Name"), "fieldtype": "Data", "width": 200},
		{"fieldname": "regular_hours", "label": _("Regular Hours"), "fieldtype": "Float", "width": 125},
		{"fieldname": "overtime_hours", "label": _("Overtime Hours"), "fieldtype": "Float", "width": 125},
		{"fieldname": "total_hours", "label": _("Total Hours"), "fieldtype": "Float", "width": 125},
		{"fieldname": "missed_punch", "label": _("Missed Punch"), "fieldtype": "Check", "width": 115},
	]


def get_data(filters: PayrollReportFilters) -> list[dict[str, Any]]:
	start = cast(datetime.date, getdate(filters["start_date"]))
	end = cast(datetime.date, getdate(filters["end_date"]))
	rows: list[dict[str, Any]] = []
	for employee, shifts in get_shifts(start, end, fields=("employee_name",)).items():
		weeks: dict[datetime.date, float] = {}
		for shift in shifts:
			weeks[week_start(shift.date)] = weeks.get(week_start(shift.date), 0.0) + shift.hours
		rows.append(
			{
				"employee": employee,
				"employee_name": employee_name_of(shifts),
				"regular_hours": flt(sum(min(hours, WEEKLY_REGULAR_HOURS) for hours in weeks.values()), 2),
				"overtime_hours": flt(
					sum(max(hours - WEEKLY_REGULAR_HOURS, 0) for hours in weeks.values()), 2
				),
				"total_hours": flt(sum(weeks.values()), 2),
				"missed_punch": int(any(shift.missed for shift in shifts)),
			}
		)
	rows.sort(key=lambda row: (row["employee_name"], row["employee"]))
	return rows


def execute(filters: PayrollReportFilters | None = None) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
	filters = cast(PayrollReportFilters, dict(filters or {}))
	return get_columns(), get_data(filters)
