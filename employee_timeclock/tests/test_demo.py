# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""The demo hook frappe-demo calls (`employee_timeclock.demo.setup`), and the apps-screen permission."""

import datetime

import frappe
from frappe.tests import IntegrationTestCase

from employee_timeclock import demo, kiosk, permissions
from employee_timeclock.tests.utils import make_kiosk_user
from employee_timeclock.timeclock.test_api import _ensure_company
from employee_timeclock.www.job_timeclock import job_timeclock

TODAY = datetime.date(2026, 1, 15)  # a Thursday


def ctx() -> dict:
	return {"today": TODAY, "seed": 1, "company": _ensure_company(), "erpnext_demo": False}


def employee(name: str) -> str:
	found = frappe.db.get_value("Employee", {"employee_name": name}, "name")
	assert isinstance(found, str)
	return found


class TestDemo(IntegrationTestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		demo.setup(ctx())

	def test_employees_badge_in_with_their_tags(self):
		self.assertEqual(kiosk.resolve_badge("0004417253"), employee("Maria Lopez"))
		self.assertEqual(
			frappe.db.get_value("Employee", {"user_id": demo.SESSION_USER}, "employee_name"), "Avery Chen"
		)

	def test_workdays_follow_the_punches(self):
		wednesday = frappe.db.get_value(
			"Workday", {"employee": employee("Avery Chen"), "date": "2026-01-14"}, "total_hours"
		)
		self.assertAlmostEqual(float(wednesday or 0), 8.07, places=2)
		forgot = frappe.db.get_value(
			"Workday",
			{"employee": employee("Jordan Patel"), "date": "2026-01-13"},
			["check_in_2", "check_out_2"],
			as_dict=True,
		)
		assert forgot is not None
		self.assertTrue(forgot.check_in_2)
		self.assertFalse(forgot.check_out_2)
		self.assertEqual(
			frappe.db.count(
				"Employee Checkin",
				{"employee": employee("Priya Nair"), "time": ["between", ["2026-01-15", "2026-01-15"]]},
			),
			1,
		)

	def test_avery_has_a_running_timer(self):
		active = job_timeclock.get_active_timer()["active_timer"]
		assert active is not None
		self.assertEqual(active["operation"], "Weld Frame")
		self.assertEqual(
			frappe.db.count(
				"Work Order",
				{"production_item": ["in", ["Steel Workbench", "Rolling Tool Cart"]], "docstatus": 1},
			),
			2,
		)

	def test_setup_is_idempotent(self):
		counts = [
			frappe.db.count(doctype) for doctype in ("Employee Checkin", "Work Order", "Job Card Time Log")
		]
		demo.setup(ctx())
		self.assertEqual(
			[frappe.db.count(doctype) for doctype in ("Employee Checkin", "Work Order", "Job Card Time Log")],
			counts,
		)


class TestAppsScreenPermission(IntegrationTestCase):
	def test_hr_sees_the_app_and_a_kiosk_does_not(self):
		frappe.set_user("Administrator")
		self.assertTrue(permissions.has_app_permission())
		frappe.set_user(make_kiosk_user())
		try:
			self.assertFalse(permissions.has_app_permission())
		finally:
			frappe.set_user("Administrator")
