# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""
Tests for the Workday Management report: the rows it builds from Workdays and Employee Checkins,
and the punch edits its grid sends (add, move, delete, rebuild).

The shared Employee is committed in setUpClass, so teardown deletes the records explicitly instead
of relying on a rollback.
"""

import datetime
from typing import Any, cast

import frappe
from frappe.tests import IntegrationTestCase

from employee_timeclock.timeclock.custom.employee_checkin import EmployeeCheckin
from employee_timeclock.timeclock.report.workday_management import workday_management as report
from employee_timeclock.timeclock.test_api import _make_employee

DATE = "2021-03-01"
FILTERS = {"from_date": DATE, "to_date": DATE}


class TestWorkdayManagement(IntegrationTestCase):
	employee: str
	employee_name: str

	@classmethod
	def setUpClass(cls) -> None:
		super().setUpClass()
		cls.employee, cls.employee_name = _make_employee()

	@classmethod
	def tearDownClass(cls) -> None:
		frappe.delete_doc("Employee", cls.employee, force=True, ignore_permissions=True)
		super().tearDownClass()

	def tearDown(self) -> None:
		frappe.db.delete("Employee Checkin", {"employee": self.employee})
		frappe.db.delete("Workday", {"employee": self.employee})

	def _punch(self, time: str, log_type: str) -> str:
		"""An Employee Checkin inserted without its hooks, as a device sync would leave it."""
		checkin = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
		checkin.employee = self.employee
		checkin.employee_name = self.employee_name
		checkin.time = f"{DATE} {time}"
		checkin.log_type = cast(Any, log_type)
		checkin.db_insert()
		return cast(str, checkin.name)

	def _rows(self, **filters: Any) -> list[dict[str, Any]]:
		_columns, data = report.execute(cast(Any, {**FILTERS, "employee": self.employee, **filters}))
		return data

	def _checkins(self) -> list[dict[str, Any]]:
		return frappe.get_all(
			"Employee Checkin",
			filters={"employee": self.employee},
			fields=["name", "time", "log_type", "workday", "workday_override", "overridden_time"],
			order_by="time asc",
		)

	def _workday(self) -> dict[str, Any]:
		return frappe.get_all(
			"Workday",
			filters={"employee": self.employee},
			fields=["name", "total_hours", "check_in_1", "check_out_1", "check_in_2"],
		)[0]

	def test_punches_without_a_workday_are_reported(self) -> None:
		self._punch("08:00:00", "IN")
		self._punch("12:00:00", "OUT")

		rows = self._rows()

		self.assertEqual(
			[r["row_type"] for r in rows], ["group", "workday", "checkin", "checkin", "new_punch", "total"]
		)
		group, workday, check_in, check_out = rows[:4]
		self.assertEqual(group["label"], self.employee_name)
		self.assertEqual(group["issue_count"], 1)
		self.assertEqual(workday["status"], report.NO_WORKDAY)
		self.assertEqual(workday["label"], "Monday, March 1")
		self.assertEqual((check_in["label"], check_in["time"]), ("IN1", "8:00 AM"))
		self.assertEqual((check_out["label"], check_out["hours"]), ("OUT1", 4.0))
		self.assertEqual(rows[-1]["label"], "Total")

	def test_a_synced_day_is_ok_and_hidden_by_issues_only(self) -> None:
		self._punch("08:00:00", "IN")
		self._punch("12:00:00", "OUT")
		report.rebuild_workdays(frappe.as_json([{"employee": self.employee, "date": DATE}]))

		workday = next(r for r in self._rows() if r["row_type"] == "workday")
		self.assertEqual(workday["status"], report.OK)
		self.assertEqual(workday["hours"], 4.0)
		self.assertEqual(self._rows(issues_only=1), [])

	def test_issues_are_reported_in_priority_order(self) -> None:
		self._punch("08:00:00", "OUT")
		report.rebuild_workdays([{"employee": self.employee, "date": DATE}])
		# a second Workday for the same day, and an odd punch count
		frappe.get_doc(
			{"doctype": "Workday", "employee": self.employee, "date": DATE, "total_hours": 1}
		).db_insert()
		frappe.db.set_value("Employee Checkin", {"employee": self.employee}, "log_type", "OUT")

		workday = next(r for r in self._rows() if r["row_type"] == "workday")

		self.assertEqual(workday["status"], report.DUPLICATE_WORKDAY)
		self.assertIn("Missing Punch", workday["issues"])
		self.assertIn("Log Type Mismatch", workday["issues"])

	def test_rows_group_by_day(self) -> None:
		self._punch("08:00:00", "IN")

		rows = self._rows(group_by="Day")

		self.assertEqual(rows[0]["label"], "Monday, March 1")
		self.assertEqual(rows[0]["date"], DATE)
		self.assertEqual(rows[1]["label"], self.employee_name)

	def test_columns_follow_the_grouping(self) -> None:
		self.assertEqual(report.get_columns("Day")[0]["label"], "Day")
		self.assertEqual(report.get_columns()[0]["label"], "Employee")

	def test_add_checkin_picks_the_log_type_from_its_slot(self) -> None:
		report.add_checkin(self.employee, DATE, "08:00")
		report.add_checkin(self.employee, DATE, "12:30")

		checkins = self._checkins()
		self.assertEqual([c["log_type"] for c in checkins], ["IN", "OUT"])
		workday = self._workday()
		self.assertEqual(workday["check_in_1"], "8:00 AM")
		self.assertEqual(workday["check_out_1"], "12:30 PM")
		self.assertEqual(workday["total_hours"], 4.5)
		self.assertEqual({c["workday"] for c in checkins}, {workday["name"]})

	def test_update_checkin_moves_the_punch_and_keeps_the_original(self) -> None:
		name = self._punch("08:00:00", "IN")

		report.update_checkin(name, "07:45")

		checkin = self._checkins()[0]
		self.assertEqual(checkin["time"], datetime.datetime(2021, 3, 1, 7, 45))
		self.assertEqual(checkin["workday_override"], 1)
		self.assertEqual(checkin["overridden_time"], datetime.datetime(2021, 3, 1, 8))
		self.assertEqual(self._workday()["check_in_1"], "7:45 AM")

	def test_update_checkin_to_the_same_time_changes_nothing(self) -> None:
		name = self._punch("08:00:00", "IN")

		self.assertEqual(report.update_checkin(name, "08:00"), "No changes made")
		self.assertEqual(self._checkins()[0]["workday_override"], 0)

	def test_delete_checkins_resyncs_the_day(self) -> None:
		keep = self._punch("08:00:00", "IN")
		drop = self._punch("09:00:00", "OUT")
		late = self._punch("10:00:00", "IN")

		report.delete_checkins(frappe.as_json([drop]))

		checkins = self._checkins()
		self.assertEqual([c["name"] for c in checkins], [keep, late])
		# the remaining punches alternate again: the 10:00 punch is now the day's first OUT
		self.assertEqual([c["log_type"] for c in checkins], ["IN", "OUT"])
		self.assertEqual(self._workday()["total_hours"], 2.0)

	def test_editing_requires_write_access_to_workdays(self) -> None:
		frappe.set_user("Guest")
		try:
			with self.assertRaises(frappe.PermissionError):
				report.add_checkin(self.employee, DATE, "08:00")
		finally:
			frappe.set_user("Administrator")
