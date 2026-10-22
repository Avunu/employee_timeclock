# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""
Tests for the hours reports: the Payroll Report and the Work Day Hours Report (built from Employee
Checkins) and the Workday Payroll Report (built from Workdays).

Regressions:

* the reports grouped by ``employee_name``, so two employees with the same name were added together
  (and, in the checkin reports, their punches were paired with each other);
* the Payroll Report compared each punch with its End Date's midnight, so the End Date's punches
  were left out.
"""

import datetime
from typing import Any, cast

import frappe
from frappe.desk.query_report import run
from frappe.tests import IntegrationTestCase
from frappe.utils import random_string

from employee_timeclock.timeclock.test_api import _ensure_company

# Monday to Friday of one week
MONDAY = datetime.date(2021, 3, 1)
FRIDAY = datetime.date(2021, 3, 5)


def _at(day: datetime.date, hour: int) -> datetime.datetime:
	return datetime.datetime.combine(day, datetime.time(hour))


class TestHoursReports(IntegrationTestCase):
	first: str
	second: str
	name: str

	@classmethod
	def setUpClass(cls) -> None:
		super().setUpClass()
		# two employees who share a name
		first_name = f"_Test Payroll {random_string(6)}"
		cls.first, cls.second = (
			cast(
				str,
				frappe.get_doc(
					{
						"doctype": "Employee",
						"first_name": first_name,
						"company": _ensure_company(),
						"gender": "Female",
						"date_of_birth": "1990-01-01",
						"date_of_joining": "2020-01-01",
						"status": "Active",
					}
				)
				.insert(ignore_permissions=True)
				.name,
			)
			for _ in range(2)
		)
		cls.name = cast(str, frappe.db.get_value("Employee", cls.first, "employee_name"))
		# written directly, so the Workday hooks don't run and every row is under test control
		for employee, day, hour, log_type in (
			(cls.first, MONDAY, 8, "IN"),
			(cls.first, MONDAY, 12, "OUT"),
			(cls.second, MONDAY, 9, "IN"),
			(cls.second, MONDAY, 10, "OUT"),
			(cls.first, FRIDAY, 8, "IN"),
			(cls.first, FRIDAY, 10, "OUT"),
		):
			frappe.get_doc(
				{
					"doctype": "Employee Checkin",
					"employee": employee,
					"employee_name": cls.name,
					"time": _at(day, hour),
					"log_type": log_type,
				}
			).db_insert()
		for employee, day, hours in ((cls.first, MONDAY, 4), (cls.second, MONDAY, 1), (cls.first, FRIDAY, 2)):
			frappe.get_doc(
				{
					"doctype": "Workday",
					"employee": employee,
					"employee_name": cls.name,
					"date": day,
					"total_hours": hours,
				}
			).db_insert()

	@classmethod
	def tearDownClass(cls) -> None:
		for employee in (cls.first, cls.second):
			frappe.db.delete("Employee Checkin", {"employee": employee})
			frappe.db.delete("Workday", {"employee": employee})
			frappe.delete_doc("Employee", employee, force=True, ignore_permissions=True)
		super().tearDownClass()

	def setUp(self) -> None:
		frappe.set_user("Administrator")

	def _rows(self, report: str, filters: dict[str, Any] | None = None) -> list[dict[str, Any]]:
		"""This test's rows of a report, the ones whose Employee is one of the two employees."""
		result = cast(list[dict[str, Any]], run(report, filters=filters or {})["result"])
		return [row for row in result if row.get("employee") in (self.first, self.second)]

	def test_payroll_report_keeps_namesakes_apart_and_counts_the_end_date(self) -> None:
		rows = self._rows("Payroll Report", {"start_date": MONDAY, "end_date": FRIDAY})

		self.assertEqual(
			sorted(
				(row["employee"], row["employee_name"], float(row["total_hours"]), row["missed_punch"])
				for row in rows
			),
			sorted([(self.first, self.name, 6.0, 0), (self.second, self.name, 1.0, 0)]),
		)

	def test_payroll_report_leaves_out_punches_after_the_end_date(self) -> None:
		rows = self._rows(
			"Payroll Report", {"start_date": MONDAY, "end_date": FRIDAY - datetime.timedelta(1)}
		)

		self.assertEqual(
			sorted((row["employee"], float(row["total_hours"])) for row in rows),
			sorted([(self.first, 4.0), (self.second, 1.0)]),
		)

	def test_work_day_hours_report_keeps_namesakes_apart(self) -> None:
		rows = self._rows("Work Day Hours Report")

		self.assertEqual(
			sorted(
				(str(row["date"]), row["employee"], row["total_work_hour"], row["missed_punch"])
				for row in rows
			),
			sorted(
				[
					(str(MONDAY), self.first, datetime.timedelta(hours=4), 0),
					(str(MONDAY), self.second, datetime.timedelta(hours=1), 0),
					(str(FRIDAY), self.first, datetime.timedelta(hours=2), 0),
				]
			),
		)

	def test_workday_payroll_report_keeps_namesakes_apart(self) -> None:
		rows = self._rows("Workday Payroll Report", {"start_date": MONDAY, "end_date": FRIDAY})

		self.assertEqual(
			sorted((row["employee"], row["employee_name"], float(row["total_hours"])) for row in rows),
			sorted([(self.first, self.name, 6.0), (self.second, self.name, 1.0)]),
		)
