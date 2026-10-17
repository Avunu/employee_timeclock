# Copyright (c) 2022, Avunu LLC and Contributors
# See license.txt

"""
Tests for the Workday DocType: its hooks (``before_save`` totals the punches, ``on_update`` writes
them back to Employee Checkins) and ``bulk_add_punches``.

The hooks commit, so every record is deleted in teardown rather than rolled back.
"""

import datetime
from typing import Any, cast

import frappe
from frappe.tests import IntegrationTestCase

from timeclock.timeclock.doctype.workday.workday import Workday, bulk_add_punches
from timeclock.timeclock.test_api import _make_employee

DATE = "2021-03-01"

# The tests make their own Employee; generating Employee test records pulls in doctypes this bench
# does not have (Payment Gateway).
IGNORE_TEST_RECORD_DEPENDENCIES = ["Employee"]


class TestWorkday(IntegrationTestCase):
	employee: str
	employee_name: str

	@classmethod
	def setUpClass(cls) -> None:
		super().setUpClass()
		cls.employee, cls.employee_name = _make_employee()
		frappe.db.commit()

	@classmethod
	def tearDownClass(cls) -> None:
		frappe.delete_doc("Employee", cls.employee, force=True, ignore_permissions=True)
		frappe.db.commit()
		super().tearDownClass()

	def tearDown(self) -> None:
		frappe.db.delete("Employee Checkin", {"employee": self.employee})
		frappe.db.delete("Workday", {"employee": self.employee})
		frappe.db.commit()

	def _workdays(self) -> list[Workday]:
		names = frappe.get_all("Workday", filters={"employee": self.employee}, pluck="name")
		return [cast(Workday, frappe.get_doc("Workday", name)) for name in names]

	def _checkins(self) -> list[dict[str, Any]]:
		return frappe.get_all(
			"Employee Checkin",
			filters={"employee": self.employee},
			fields=["time", "log_type", "workday", "workday_override", "overridden_time", "device_id"],
			order_by="time asc",
		)

	def _new_workday(self, **slots: str) -> Workday:
		workday = cast(Workday, frappe.new_doc("Workday"))
		workday.employee = self.employee
		workday.employee_name = self.employee_name
		workday.date = DATE
		workday.update(slots)
		workday.insert(ignore_permissions=True)
		return workday

	def test_saving_totals_the_punches(self) -> None:
		workday = self._new_workday(check_in_1="7:30 AM", check_out_1="11:30 AM", check_in_2="12:00 PM")
		workday.check_out_2 = "4:15 PM"
		workday.save(ignore_permissions=True)

		self.assertAlmostEqual(workday.total_hours, 8.25)
		self.assertEqual(workday.check_in_1_dt, datetime.datetime(2021, 3, 1, 7, 30))
		self.assertEqual(workday.check_out_2_dt, datetime.datetime(2021, 3, 1, 16, 15))

	def test_saving_ignores_text_that_is_not_a_time(self) -> None:
		workday = self._new_workday(check_in_1="7:30 AM", check_out_1="lunch")

		self.assertEqual(workday.total_hours, 0)
		self.assertEqual(workday.check_in_1, "7:30 AM")
		self.assertIsNone(workday.check_out_1)

	def test_saving_writes_the_punches_to_employee_checkins(self) -> None:
		workday = self._new_workday(check_in_1="8:00 AM", check_out_1="12:00 PM")

		checkins = self._checkins()
		self.assertEqual([c["log_type"] for c in checkins], ["IN", "OUT"])
		self.assertEqual(
			[c["time"] for c in checkins],
			[datetime.datetime(2021, 3, 1, 8), datetime.datetime(2021, 3, 1, 12)],
		)
		self.assertEqual({c["workday"] for c in checkins}, {workday.name})
		self.assertEqual({c["device_id"] for c in checkins}, {"Workday Management"})

	def test_editing_a_punch_moves_its_checkin_and_keeps_the_original(self) -> None:
		workday = self._new_workday(check_in_1="8:00 AM", check_out_1="12:00 PM")

		workday.check_in_1 = "8:15 AM"
		workday.save(ignore_permissions=True)

		check_in = self._checkins()[0]
		self.assertEqual(check_in["time"], datetime.datetime(2021, 3, 1, 8, 15))
		self.assertEqual(check_in["workday_override"], 1)
		self.assertEqual(check_in["overridden_time"], datetime.datetime(2021, 3, 1, 8))

	def test_clearing_a_punch_deletes_its_checkin(self) -> None:
		workday = self._new_workday(check_in_1="8:00 AM", check_out_1="12:00 PM")

		workday.check_out_1 = ""
		workday.save(ignore_permissions=True)

		self.assertEqual([c["log_type"] for c in self._checkins()], ["IN"])

	def test_bulk_add_punches_creates_a_workday_per_employee(self) -> None:
		result = bulk_add_punches(
			DATE,
			[f" {self.employee}"],
			[{"checkin": "7:00 AM", "checkout": "3:30 PM"}, {}],
		)

		self.assertEqual(result, "success")
		workdays = self._workdays()
		self.assertEqual(len(workdays), 1)
		self.assertEqual(workdays[0].day_of_week, "Monday")
		self.assertEqual(workdays[0].employee_name, self.employee_name)
		self.assertAlmostEqual(workdays[0].total_hours, 8.5)
		self.assertEqual([c["log_type"] for c in self._checkins()], ["IN", "OUT"])

	def test_bulk_add_punches_accepts_json_arguments(self) -> None:
		"""frappe.call sends the employees and punches as JSON strings."""
		bulk_add_punches(
			DATE,
			frappe.as_json([self.employee]),
			frappe.as_json([{"checkin": "9:00 AM", "checkout": "10:00 AM"}]),
		)

		self.assertAlmostEqual(self._workdays()[0].total_hours, 1.0)
