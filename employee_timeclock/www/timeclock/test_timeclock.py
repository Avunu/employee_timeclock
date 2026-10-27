# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""
Tests for the RFID kiosk at ``/timeclock`` (``employee_timeclock.www.timeclock``) and the token signing key.

The kiosk runs signed in as a Timeclock Kiosk user: a badge scan calls ``punch``, with a hand-entered time and IN/OUT
for a forgotten punch. The older token endpoints (``authenticate_employee`` for a token, sent back to
``log_in_employee`` / ``log_out_employee``) are still served and tested here.
"""

import datetime
from typing import Any, cast
from unittest.mock import patch

import frappe
import jwt
from frappe.tests import IntegrationTestCase
from frappe.utils import add_days, get_datetime, now_datetime, random_string, today
from frappe.utils.password import get_encryption_key
from frappe.utils.redis_wrapper import RedisWrapper

from employee_timeclock import auth
from employee_timeclock.kiosk import DEVICE_ID, KioskAuthenticationError
from employee_timeclock.tests.utils import make_kiosk_user
from employee_timeclock.timeclock import api
from employee_timeclock.timeclock.test_api import _make_employee
from employee_timeclock.www import timeclock as kiosk
from employee_timeclock.www.timeclock import index as kiosk_page

PUNCH_TIME = "2021-03-01 07:45:00"


def _today_at(clock: str) -> datetime.datetime:
	"""A time today, for punches ``determine_next_log_type`` counts (it looks at today's only)."""
	return get_datetime(f"{today()} {clock}")


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

	@classmethod
	def tearDownClass(cls) -> None:
		frappe.set_user("Administrator")
		frappe.db.delete("Attendance Device ID", {"parent": cls.employee})
		frappe.db.delete("Employee Checkin", {"employee": cls.employee})
		frappe.db.delete("Workday", {"employee": cls.employee})
		frappe.delete_doc("Employee", cls.employee, force=True, ignore_permissions=True)
		super().tearDownClass()

	def setUp(self) -> None:
		frappe.set_user(make_kiosk_user())
		cast(RedisWrapper, frappe.cache).delete_keys("rl:*")  # authenticate_employee is rate limited

	def tearDown(self) -> None:
		frappe.set_user("Administrator")
		frappe.db.delete("Employee Checkin", {"employee": self.employee})
		frappe.db.delete("Workday", {"employee": self.employee})

	def _checkins(self) -> list[dict[str, Any]]:
		return frappe.get_all(
			"Employee Checkin",
			filters={"employee": self.employee},
			fields=["log_type", "device_id", "time"],
			order_by="time asc",
		)

	def test_punch_alternates_in_and_out_today_at_the_server_time(self) -> None:
		with patch.object(kiosk, "now_datetime", return_value=_today_at("12:00:00")):
			first = kiosk.punch(self.rfid)
		with patch.object(kiosk, "now_datetime", return_value=_today_at("12:05:00")):
			second = kiosk.punch(self.rfid)

		self.assertEqual((first["log_type"], second["log_type"]), ("IN", "OUT"))
		self.assertEqual(first["employee_name"], self.employee_name)
		checkins = self._checkins()
		self.assertEqual([c["time"] for c in checkins], [_today_at("12:00:00"), _today_at("12:05:00")])
		self.assertEqual({c["device_id"] for c in checkins}, {DEVICE_ID})

	def test_punch_ignores_an_open_punch_from_yesterday(self) -> None:
		"""A forgotten clock-out yesterday does not make today's first scan an OUT."""
		frappe.get_doc(
			{
				"doctype": "Employee Checkin",
				"employee": self.employee,
				"log_type": "IN",
				"time": get_datetime(f"{add_days(today(), -1)} 07:00:00"),
			}
		).insert(ignore_permissions=True)

		with patch.object(kiosk, "now_datetime", return_value=_today_at("07:00:00")):
			self.assertEqual(kiosk.punch(self.rfid)["log_type"], "IN")

	def test_a_second_scan_in_the_same_minute_keeps_the_first_punch(self) -> None:
		with patch.object(kiosk, "now_datetime", return_value=_today_at("12:00:05")):
			kiosk.punch(self.rfid)
		with patch.object(kiosk, "now_datetime", return_value=_today_at("12:00:40")):
			second = kiosk.punch(self.rfid)

		self.assertEqual(second["log_type"], "IN")
		self.assertEqual(len(self._checkins()), 1)

	def test_punch_answers_with_the_servers_clock(self) -> None:
		with patch.object(kiosk, "now_datetime", return_value=_today_at("12:00:00")):
			result = kiosk.punch(self.rfid)

		self.assertEqual(result["server_time"], f"{today()} 12:00:00")

	def test_a_punch_sent_again_under_its_id_is_recorded_once(self) -> None:
		"""A retry after a lost answer keeps the punch already recorded, even a minute later."""
		with patch.object(kiosk, "now_datetime", return_value=_today_at("12:00:00")):
			first = kiosk.punch(self.rfid, punch_id="tablet-1-0001")
		with patch.object(kiosk, "now_datetime", return_value=_today_at("12:02:00")):
			again = kiosk.punch(self.rfid, punch_id="tablet-1-0001")

		self.assertEqual((first["log_type"], again["log_type"]), ("IN", "IN"))
		self.assertEqual(len(self._checkins()), 1)
		self.assertEqual(
			frappe.db.get_value("Employee Checkin", {"employee": self.employee}, "kiosk_punch_id"),
			"tablet-1-0001",
		)

	def test_punch_refuses_a_user_without_the_kiosk_role(self) -> None:
		frappe.set_user("Guest")

		with self.assertRaises(frappe.PermissionError):
			kiosk.punch(self.rfid)

	def test_punch_refuses_an_unknown_badge(self) -> None:
		with self.assertRaises(KioskAuthenticationError):
			kiosk.punch("not-a-badge")
		self.assertEqual(self._checkins(), [])

	def test_a_manual_punch_records_the_entered_time_and_choice(self) -> None:
		with patch.object(kiosk, "now_datetime", return_value=_today_at("12:00:00")):
			result = kiosk.punch(self.rfid, f"{today()} 07:30:00", "IN")

		self.assertEqual(result["log_type"], "IN")
		checkin = frappe.get_all(
			"Employee Checkin",
			filters={"employee": self.employee},
			fields=["log_type", "time", "manual_override"],
		)
		self.assertEqual(checkin, [{"log_type": "IN", "time": _today_at("07:30:00"), "manual_override": 1}])

	def test_a_manual_punch_in_the_future_is_refused(self) -> None:
		with (
			patch.object(kiosk, "now_datetime", return_value=_today_at("12:00:00")),
			self.assertRaises(frappe.ValidationError),
		):
			kiosk.punch(self.rfid, f"{today()} 12:01:00", "OUT")
		self.assertEqual(self._checkins(), [])

	def test_a_manual_punch_needs_in_or_out(self) -> None:
		with (
			patch.object(kiosk, "now_datetime", return_value=_today_at("12:00:00")),
			self.assertRaises(frappe.ValidationError),
		):
			kiosk.punch(self.rfid, f"{today()} 07:30:00")
		self.assertEqual(self._checkins(), [])

	def test_a_manual_punch_with_a_malformed_time_is_refused(self) -> None:
		with self.assertRaises(frappe.ValidationError):
			kiosk.punch(self.rfid, "7:30 AM", "IN")
		self.assertEqual(self._checkins(), [])

	def test_authenticate_employee_issues_a_token(self) -> None:
		result = kiosk.authenticate_employee(self.rfid)

		self.assertEqual(result["status"], "success")
		self.assertIsNone(result["last_checkin"])
		payload = jwt.decode(result["token"], auth.get_token_secret(), algorithms=["HS256"])
		self.assertEqual(payload["employee_id"], self.employee)
		self.assertEqual(payload["employee_name"], self.employee_name)

	def _write_punch(self, time: datetime.datetime, log_type: str) -> None:
		"""Write a punch directly, without the Workday hooks, so its modified order is under test control."""
		frappe.get_doc(
			{"doctype": "Employee Checkin", "employee": self.employee, "time": time, "log_type": log_type}
		).db_insert()

	def test_authenticate_employee_ignores_an_in_older_than_the_maximum_shift(self) -> None:
		"""A forgotten clock-out more than the maximum shift length ago does not make the next scan an OUT."""
		self._write_punch(now_datetime() - datetime.timedelta(hours=17), "IN")

		self.assertIsNone(kiosk.authenticate_employee(self.rfid)["last_checkin"])

	def test_authenticate_employee_keeps_a_night_shift_open_across_midnight(self) -> None:
		"""Regression: only today's punches were read, so a night worker's scan after midnight was an IN."""
		self._write_punch(now_datetime() - datetime.timedelta(hours=8), "IN")

		self.assertEqual(kiosk.authenticate_employee(self.rfid)["last_checkin"], "IN")

	def test_authenticate_employee_reports_the_latest_punch_by_time(self) -> None:
		"""The last punch by time decides, not the punch saved last (a punch fixed later in the day)."""
		now = now_datetime().replace(second=0, microsecond=0)
		self._write_punch(now - datetime.timedelta(minutes=2), "OUT")
		self._write_punch(now - datetime.timedelta(minutes=3), "IN")

		self.assertEqual(kiosk.authenticate_employee(self.rfid)["last_checkin"], "OUT")

	def test_authenticate_employee_rejects_an_unknown_badge(self) -> None:
		result = kiosk.authenticate_employee("not-a-badge")

		self.assertEqual(result, {"status": "error", "message": "Badge not recognised."})

	def test_log_in_and_out_record_checkins(self) -> None:
		token = kiosk.refresh_token(self.employee)

		self.assertEqual(kiosk.log_in_employee(token, PUNCH_TIME)["status"], "success")
		self.assertEqual(kiosk.log_out_employee(token, "2021-03-01 16:15:00")["status"], "success")

		checkins = self._checkins()
		self.assertEqual([c["log_type"] for c in checkins], ["IN", "OUT"])
		self.assertEqual({c["device_id"] for c in checkins}, {"Timeclock Scanner"})
		self.assertEqual(checkins[0]["time"], datetime.datetime(2021, 3, 1, 7, 45))

	def test_a_rejected_punch_is_reported_unsuccessful(self) -> None:
		"""A punch the checkin validation rejects (here a duplicate) is not reported as saved."""
		token = kiosk.refresh_token(self.employee)
		kiosk.log_in_employee(token, PUNCH_TIME)

		self.assertEqual(kiosk.log_in_employee(token, PUNCH_TIME)["status"], "unsuccessful")
		self.assertEqual(len(self._checkins()), 1)

	def test_a_punch_whose_workday_sync_fails_leaves_nothing_behind(self) -> None:
		"""The checkin and its Workday sync are undone together when the on_update hook fails."""
		token = kiosk.refresh_token(self.employee)

		with patch.object(api, "update_workday_from_checkin", side_effect=RuntimeError("sync failed")):
			result = kiosk.log_out_employee(token, PUNCH_TIME)

		self.assertEqual(result["status"], "unsuccessful")
		self.assertEqual(self._checkins(), [])
		self.assertFalse(frappe.db.exists("Workday", {"employee": self.employee, "date": PUNCH_TIME[:10]}))

	def test_last_checkin_is_reported_after_a_punch(self) -> None:
		punch_time = now_datetime().replace(microsecond=0) - datetime.timedelta(minutes=1)
		kiosk.log_in_employee(kiosk.refresh_token(self.employee), str(punch_time))

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

	def test_an_expired_token_is_reported_as_expired(self) -> None:
		expired = jwt.encode(
			{"employee_id": self.employee, "exp": datetime.datetime(2020, 1, 1).timestamp()},
			auth.get_token_secret(),
			algorithm="HS256",
		)

		with self.assertRaisesRegex(KioskAuthenticationError, "Token has expired"):
			kiosk.extract_employee_from_token(expired)

	def test_a_garbled_token_is_reported_invalid(self) -> None:
		with self.assertRaisesRegex(KioskAuthenticationError, "Invalid token"):
			kiosk.extract_employee_from_token("not-a-token")

	def test_a_valid_token_names_its_employee_and_comes_back_refreshed(self) -> None:
		employee_id, refreshed = kiosk.extract_employee_from_token(kiosk.refresh_token(self.employee))

		self.assertEqual(employee_id, self.employee)
		self.assertEqual(
			jwt.decode(refreshed, auth.get_token_secret(), algorithms=["HS256"])["employee_id"], self.employee
		)

	def test_a_token_without_an_employee_is_rejected(self) -> None:
		token = jwt.encode({"exp": 4102444800}, auth.get_token_secret(), algorithm="HS256")

		with self.assertRaises(frappe.AuthenticationError):
			kiosk.extract_employee_from_token(token)

	def test_a_site_without_an_encryption_key_gets_one(self) -> None:
		"""A site with no encryption_key yet gets one generated and saved, so badge sign-in works."""
		conf = cast(frappe._dict, frappe.local.conf)
		key = conf.pop("encryption_key")
		try:
			with patch("frappe.installer.update_site_config") as save:
				secret = auth.get_token_secret()
			self.assertTrue(secret)
			save.assert_called_once_with("encryption_key", secret)
			result = kiosk.authenticate_employee(self.rfid)
			self.assertEqual(result["status"], "success")
			self.assertEqual(
				jwt.decode(result["token"], secret, algorithms=["HS256"])["employee_id"], self.employee
			)
		finally:
			conf["encryption_key"] = key

	def test_no_tokens_with_an_empty_encryption_key(self) -> None:
		"""The key fails closed: with an empty encryption_key the kiosk neither issues nor accepts tokens.

		The error is the kiosk's own subclass, never a plain AuthenticationError, which would make
		frappe sign the kiosk user out.
		"""
		conf = cast(frappe._dict, frappe.local.conf)
		key = conf["encryption_key"]
		conf["encryption_key"] = ""
		try:
			with self.assertRaises(KioskAuthenticationError) as caught:
				auth.get_token_secret()
			self.assertIsNot(type(caught.exception), frappe.AuthenticationError)
			with self.assertRaises(KioskAuthenticationError):
				kiosk.refresh_token(self.employee)
		finally:
			conf["encryption_key"] = key

	def test_page_context_carries_a_csrf_token(self) -> None:
		context = frappe._dict()

		kiosk_page.get_context(context)

		self.assertTrue(context.csrf_token)

	def test_page_context_makes_the_page_an_installable_app(self) -> None:
		context = frappe._dict()

		kiosk_page.get_context(context)

		self.assertEqual(context.title, "Timeclock")
		self.assertEqual(context.pwa["manifest_url"], "/timeclock/manifest.webmanifest")
		self.assertIn("session_expiry", context.boot)
