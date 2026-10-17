# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""
Tests for the RFID kiosk at ``/timeclock`` (``timeclock.www.timeclock``) and the token signing key.

The kiosk is a guest page: a badge scan calls ``authenticate_employee`` for a token, and the
clock-in/out buttons send it back to ``log_in_employee`` / ``log_out_employee``.
"""

import datetime
from typing import Any, cast

import frappe
import jwt
from frappe.tests import IntegrationTestCase
from frappe.utils import random_string
from frappe.utils.password import get_encryption_key
from frappe.utils.redis_wrapper import RedisWrapper

from timeclock import auth
from timeclock.timeclock.test_api import _make_employee
from timeclock.www import timeclock as kiosk
from timeclock.www.timeclock import index as kiosk_page

PUNCH_TIME = "2021-03-01 07:45:00"


class TestTimeclockKiosk(IntegrationTestCase):
	employee: str
	employee_name: str
	rfid: str

	@classmethod
	def setUpClass(cls) -> None:
		super().setUpClass()
		get_encryption_key()
		cls.employee, cls.employee_name = _make_employee()
		cls.rfid = f"RFID{random_string(8)}"
		frappe.get_doc(
			{
				"doctype": "Attendance Device ID",
				"id": cls.rfid,
				"parent": cls.employee,
				"parenttype": "Employee",
				"parentfield": "attendance_device_ids",
			}
		).insert(ignore_permissions=True)
		frappe.db.commit()

	@classmethod
	def tearDownClass(cls) -> None:
		frappe.set_user("Administrator")
		frappe.db.delete("Attendance Device ID", {"parent": cls.employee})
		frappe.db.delete("Employee Checkin", {"employee": cls.employee})
		frappe.db.delete("Workday", {"employee": cls.employee})
		frappe.delete_doc("Employee", cls.employee, force=True, ignore_permissions=True)
		frappe.db.commit()
		super().tearDownClass()

	def setUp(self) -> None:
		frappe.set_user("Guest")
		cast(RedisWrapper, frappe.cache).delete_keys("rl:*")  # authenticate_employee is rate limited

	def tearDown(self) -> None:
		frappe.set_user("Administrator")
		frappe.db.delete("Employee Checkin", {"employee": self.employee})
		frappe.db.delete("Workday", {"employee": self.employee})
		frappe.db.commit()

	def _checkins(self) -> list[dict[str, Any]]:
		return frappe.get_all(
			"Employee Checkin",
			filters={"employee": self.employee},
			fields=["log_type", "device_id", "time"],
			order_by="time asc",
		)

	def test_authenticate_employee_issues_a_token(self) -> None:
		result = kiosk.authenticate_employee(self.rfid)

		self.assertEqual(result["status"], "success")
		self.assertIsNone(result["last_checkin"])
		payload = jwt.decode(result["token"], auth.get_token_secret(), algorithms=["HS256"])
		self.assertEqual(payload["employee_id"], self.employee)
		self.assertEqual(payload["employee_name"], self.employee_name)

	def test_authenticate_employee_rejects_an_unknown_badge(self) -> None:
		result = kiosk.authenticate_employee("not-a-badge")

		self.assertEqual(result, {"status": "error", "message": "Invalid RFID"})

	def test_log_in_and_out_record_checkins(self) -> None:
		token = kiosk.refresh_token(self.employee)

		self.assertEqual(kiosk.log_in_employee(token, PUNCH_TIME)["status"], "success")
		self.assertEqual(kiosk.log_out_employee(token, "2021-03-01 16:15:00")["status"], "success")

		checkins = self._checkins()
		self.assertEqual([c["log_type"] for c in checkins], ["IN", "OUT"])
		self.assertEqual({c["device_id"] for c in checkins}, {"Timeclock Scanner"})
		self.assertEqual(checkins[0]["time"], datetime.datetime(2021, 3, 1, 7, 45))

	def test_last_checkin_is_reported_after_a_punch(self) -> None:
		kiosk.log_in_employee(kiosk.refresh_token(self.employee), PUNCH_TIME)

		self.assertEqual(kiosk.authenticate_employee(self.rfid)["last_checkin"], "IN")

	def test_an_expired_token_is_rejected(self) -> None:
		expired = jwt.encode(
			{"employee_id": self.employee, "exp": datetime.datetime(2020, 1, 1).timestamp()},
			auth.get_token_secret(),
			algorithm="HS256",
		)

		with self.assertRaises(frappe.AuthenticationError):
			kiosk.log_in_employee(expired, PUNCH_TIME)
		self.assertEqual(self._checkins(), [])

	def test_a_token_without_an_employee_is_rejected(self) -> None:
		token = jwt.encode({"exp": 4102444800}, auth.get_token_secret(), algorithm="HS256")

		with self.assertRaises(frappe.AuthenticationError):
			kiosk.extract_employee_from_token(token)

	def test_no_tokens_without_an_encryption_key(self) -> None:
		"""The key fails closed: with no encryption_key the kiosk neither issues nor accepts tokens."""
		conf = cast(frappe._dict, frappe.local.conf)
		key = conf.pop("encryption_key")
		try:
			with self.assertRaises(frappe.AuthenticationError):
				auth.get_token_secret()
			with self.assertRaises(frappe.AuthenticationError):
				kiosk.refresh_token(self.employee)
		finally:
			conf["encryption_key"] = key

	def test_page_context_carries_a_csrf_token(self) -> None:
		context = frappe._dict()

		kiosk_page.get_context(context)

		self.assertTrue(context.csrf_token)
