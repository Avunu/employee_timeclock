# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""
Tests for the hours reports: the Payroll Report and the Work Day Hours Report (built from Employee
Checkins) and the Workday Payroll Report (built from Workdays).

Regressions:

* the reports grouped by ``employee_name``, so two employees with the same name were added together
  (and, in the checkin reports, their punches were paired with each other);
* the Payroll Report compared each punch with its End Date's midnight, so the End Date's punches
  were left out;
* the checkin reports paired punches by position (``ROW_NUMBER`` parity), so one missed punch shifted
  every later pair that week, and a night shift's OUT after midnight paired with the next punch;
* the payroll reports split a week that spans New Year's Day in two (``YEAR()`` and ``WEEK()``), so
  its overtime was undercounted.
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


class TestHoursReportsPairShifts(IntegrationTestCase):
	"""The checkin reports pair each IN with the OUT that closes it and count it on the IN's date."""

	employee: str
	name: str

	@classmethod
	def setUpClass(cls) -> None:
		super().setUpClass()
		cls.employee = cast(
			str,
			frappe.get_doc(
				{
					"doctype": "Employee",
					"first_name": f"_Test Night {random_string(6)}",
					"company": _ensure_company(),
					"gender": "Male",
					"date_of_birth": "1990-01-01",
					"date_of_joining": "2020-01-01",
					"status": "Active",
				}
			)
			.insert(ignore_permissions=True)
			.name,
		)
		cls.name = cast(str, frappe.db.get_value("Employee", cls.employee, "employee_name"))

	@classmethod
	def tearDownClass(cls) -> None:
		frappe.delete_doc("Employee", cls.employee, force=True, ignore_permissions=True)
		super().tearDownClass()

	def setUp(self) -> None:
		frappe.set_user("Administrator")

	def tearDown(self) -> None:
		frappe.db.delete("Employee Checkin", {"employee": self.employee})
		frappe.db.delete("Workday", {"employee": self.employee})

	def _write(self, *punches: tuple[datetime.datetime, str]) -> None:
		for time, log_type in punches:
			frappe.get_doc(
				{
					"doctype": "Employee Checkin",
					"employee": self.employee,
					"employee_name": self.name,
					"time": time,
					"log_type": log_type,
				}
			).db_insert()

	def _payroll(self, start: datetime.date, end: datetime.date) -> tuple[float, float, float, int] | None:
		result = cast(
			list[dict[str, Any]],
			run("Payroll Report", filters={"start_date": start, "end_date": end})["result"],
		)
		rows = [row for row in result if row.get("employee") == self.employee]
		if not rows:
			return None
		row = rows[0]
		return (
			float(row["regular_hours"]),
			float(row["overtime_hours"]),
			float(row["total_hours"]),
			row["missed_punch"],
		)

	def _day_hours(self, **filters: Any) -> list[tuple[str, datetime.timedelta, int]]:
		result = cast(list[dict[str, Any]], run("Work Day Hours Report", filters=filters)["result"])
		return [
			(str(row["date"]), row["total_work_hour"], row["missed_punch"])
			for row in result
			if row.get("employee") == self.employee
		]

	def test_a_night_shift_counts_on_the_day_it_started(self) -> None:
		self._write((_at(MONDAY, 22), "IN"), (_at(MONDAY + datetime.timedelta(1), 6), "OUT"))

		self.assertEqual(self._payroll(MONDAY, MONDAY), (8.0, 0.0, 8.0, 0))
		self.assertIsNone(self._payroll(MONDAY + datetime.timedelta(1), FRIDAY))
		self.assertEqual(
			self._day_hours(from_date=MONDAY, to_date=FRIDAY), [(str(MONDAY), datetime.timedelta(hours=8), 0)]
		)

	def test_a_missed_punch_does_not_shift_the_rest_of_the_week(self) -> None:
		tuesday = MONDAY + datetime.timedelta(1)
		self._write(
			(_at(MONDAY, 8), "IN"),
			# Monday's OUT was never punched
			(_at(tuesday, 8), "IN"),
			(_at(tuesday, 16), "OUT"),
			(_at(FRIDAY, 8), "IN"),
			(_at(FRIDAY, 16), "OUT"),
		)

		self.assertEqual(self._payroll(MONDAY, FRIDAY), (16.0, 0.0, 16.0, 1))
		self.assertEqual(
			self._day_hours(from_date=MONDAY, to_date=FRIDAY),
			[
				(str(MONDAY), datetime.timedelta(0), 1),
				(str(tuesday), datetime.timedelta(hours=8), 0),
				(str(FRIDAY), datetime.timedelta(hours=8), 0),
			],
		)

	def test_a_night_shift_across_the_week_boundary_counts_in_the_week_it_started(self) -> None:
		"""Five 9-hour nights, the last from Saturday into Sunday: 45 hours in one week."""
		saturday = FRIDAY + datetime.timedelta(1)
		punches: list[tuple[datetime.datetime, str]] = []
		for day in (MONDAY + datetime.timedelta(n) for n in (1, 2, 3, 4)):
			punches += [(_at(day, 21), "IN"), (_at(day + datetime.timedelta(1), 6), "OUT")]
		punches += [(_at(saturday, 21), "IN"), (_at(saturday + datetime.timedelta(1), 6), "OUT")]
		self._write(*punches)

		self.assertEqual(self._payroll(MONDAY, saturday + datetime.timedelta(7)), (40.0, 5.0, 45.0, 0))

	def test_a_week_spanning_new_years_day_is_one_week(self) -> None:
		"""Monday 28 December to Friday 1 January, 9 hours a day: 5 hours of overtime."""
		days = [datetime.date(2026, 12, 28) + datetime.timedelta(n) for n in range(5)]
		self._write(
			*((_at(day, hour), log_type) for day in days for hour, log_type in ((8, "IN"), (17, "OUT")))
		)
		for day in days:
			frappe.get_doc(
				{
					"doctype": "Workday",
					"employee": self.employee,
					"employee_name": self.name,
					"date": day,
					"total_hours": 9,
				}
			).db_insert()

		self.assertEqual(self._payroll(days[0], days[-1]), (40.0, 5.0, 45.0, 0))
		workday_rows = [
			row
			for row in cast(
				list[dict[str, Any]],
				run("Workday Payroll Report", filters={"start_date": days[0], "end_date": days[-1]})[
					"result"
				],
			)
			if row.get("employee") == self.employee
		]
		self.assertEqual(
			[(float(r["regular_hours"]), float(r["overtime_hours"])) for r in workday_rows], [(40.0, 5.0)]
		)

	def test_a_shift_past_the_maximum_length_is_two_missed_punches(self) -> None:
		self._write((_at(MONDAY, 6), "IN"), (_at(MONDAY + datetime.timedelta(1), 6), "OUT"))

		self.assertEqual(self._payroll(MONDAY, FRIDAY), (0.0, 0.0, 0.0, 1))

	def test_the_work_day_hours_report_runs_without_dates(self) -> None:
		self._write((_at(MONDAY, 8), "IN"), (_at(MONDAY, 12), "OUT"))

		self.assertEqual(self._day_hours(), [(str(MONDAY), datetime.timedelta(hours=4), 0)])
