# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""
Tests for the timeclock kiosks' access control (``timeclock.kiosk``) and the endpoints it guards.

A kiosk runs signed in as a Timeclock Kiosk user and an employee proves who they are with a badge
(an issued token, stored hashed, or a registered RFID tag), never with their guessable Employee ID.
"""

import contextlib
import datetime
import json
import time
from collections.abc import Generator
from types import SimpleNamespace
from typing import cast

import frappe
import jwt
from frappe.tests import IntegrationTestCase
from frappe.utils import now_datetime, random_string
from frappe.utils.password import get_encryption_key
from frappe.utils.redis_wrapper import RedisWrapper

from timeclock import kiosk
from timeclock.auth import get_token_secret
from timeclock.tests.utils import KIOSK_USER, ensure_user, make_kiosk_user
from timeclock.timeclock import api
from timeclock.timeclock.test_api import _make_employee
from timeclock.www import job_timeclock_legacy as legacy
from timeclock.www import timeclock as rfid_kiosk
from timeclock.www.job_timeclock import index as job_timeclock_page
from timeclock.www.job_timeclock import job_timeclock
from timeclock.www.job_timeclock_legacy import index as legacy_page
from timeclock.www.timeclock import index as rfid_kiosk_page

HR_USER = "timeclock-hr@example.com"
PLAIN_USER = "timeclock-plain@example.com"

PUNCH = "2021-03-01 08:15:42"


@contextlib.contextmanager
def _http_request(cmd: str, ip: str = "10.20.30.40") -> Generator[None]:
	"""Run as if inside an HTTP request for ``cmd``, which is what frappe's rate limiter keys on."""
	saved = {name: getattr(frappe.local, name, None) for name in ("request", "request_ip")}
	saved_cmd = frappe.local.form_dict.get("cmd")
	frappe.local.request = SimpleNamespace(method="POST")
	frappe.local.request_ip = ip
	frappe.local.form_dict.cmd = cmd
	try:
		yield
	finally:
		for name, value in saved.items():
			setattr(frappe.local, name, value)
		frappe.local.form_dict.cmd = saved_cmd


class TestKiosk(IntegrationTestCase):
	employee: str
	employee_name: str
	rfid: str

	@classmethod
	def setUpClass(cls) -> None:
		super().setUpClass()
		get_encryption_key()
		make_kiosk_user()
		ensure_user(HR_USER, ("HR Manager",), user_type="System User")
		ensure_user(PLAIN_USER)
		cls.employee, cls.employee_name = _make_employee()
		cls.rfid = f"RFID{random_string(10)}"
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
		cast(RedisWrapper, frappe.cache).delete_keys("rl:*")

	def tearDown(self) -> None:
		frappe.set_user("Administrator")
		frappe.db.delete("Employee Checkin", {"employee": self.employee})
		frappe.db.delete("Workday", {"employee": self.employee})
		frappe.db.set_value(
			"Employee",
			self.employee,
			{"status": "Active", kiosk.BADGE_HASH_FIELD: None, kiosk.BADGE_ISSUED_FIELD: None},
		)

	def _issue(self) -> str:
		frappe.set_user(HR_USER)
		token = kiosk.issue_badge(self.employee)["token"]
		frappe.set_user(KIOSK_USER)
		return token

	def _checkins(self) -> list[dict]:
		return frappe.get_all(
			"Employee Checkin",
			filters={"employee": self.employee},
			fields=["log_type", "time", "device_id", "manual_override"],
			order_by="time asc",
		)

	# --- issuing and revoking badges ---

	def test_issue_badge_stores_only_the_hash(self) -> None:
		frappe.set_user(HR_USER)
		issued = kiosk.issue_badge(self.employee)

		token = issued["token"]
		self.assertGreaterEqual(len(token), 24)
		stored = frappe.db.get_value(
			"Employee", self.employee, [kiosk.BADGE_HASH_FIELD, kiosk.BADGE_ISSUED_FIELD], as_dict=True
		)
		self.assertEqual(stored[kiosk.BADGE_HASH_FIELD], kiosk.hash_badge_token(token))
		self.assertNotEqual(stored[kiosk.BADGE_HASH_FIELD], token)
		self.assertIsNotNone(stored[kiosk.BADGE_ISSUED_FIELD])

	def test_reissuing_revokes_the_old_badge(self) -> None:
		old = self._issue()
		new = self._issue()

		self.assertNotEqual(old, new)
		self.assertIsNone(kiosk.resolve_badge(old))
		self.assertEqual(kiosk.resolve_badge(new), self.employee)

	def test_revoke_badge(self) -> None:
		token = self._issue()
		frappe.set_user(HR_USER)

		kiosk.revoke_badge(self.employee)

		self.assertIsNone(kiosk.resolve_badge(token))
		self.assertIsNone(frappe.db.get_value("Employee", self.employee, kiosk.BADGE_ISSUED_FIELD))

	def test_only_hr_may_issue_or_revoke(self) -> None:
		for user in ("Guest", PLAIN_USER, KIOSK_USER):
			frappe.set_user(user)
			with self.subTest(user=user):
				with self.assertRaises(frappe.PermissionError):
					kiosk.issue_badge(self.employee)
				with self.assertRaises(frappe.PermissionError):
					kiosk.revoke_badge(self.employee)
		self.assertIsNone(frappe.db.get_value("Employee", self.employee, kiosk.BADGE_HASH_FIELD))

	def test_issue_for_an_unknown_employee(self) -> None:
		frappe.set_user(HR_USER)
		with self.assertRaises(frappe.DoesNotExistError):
			kiosk.issue_badge("HR-EMP-DOES-NOT-EXIST")
		with self.assertRaises(frappe.DoesNotExistError):
			kiosk.revoke_badge("HR-EMP-DOES-NOT-EXIST")

	# --- resolving a badge ---

	def test_resolve_badge(self) -> None:
		token = self._issue()

		self.assertEqual(kiosk.resolve_badge(token), self.employee)
		self.assertEqual(kiosk.resolve_badge(f"  {token}\n"), self.employee)
		self.assertEqual(kiosk.resolve_badge(self.rfid), self.employee)
		for scan in (self.employee, "", None, token[:-1], "not-a-badge"):
			with self.subTest(scan=scan):
				self.assertIsNone(kiosk.resolve_badge(scan))

	def test_an_inactive_employee_has_no_badge(self) -> None:
		token = self._issue()
		frappe.db.set_value("Employee", self.employee, "status", "Left")

		self.assertIsNone(kiosk.resolve_badge(token))
		self.assertIsNone(kiosk.resolve_badge(self.rfid))

	def test_every_failure_reads_the_same(self) -> None:
		"""An unknown badge, an Employee ID and a leaver's badge all fail with one message."""
		token = self._issue()
		messages = set()
		for scan in ("not-a-badge", self.employee):
			with self.assertRaises(frappe.AuthenticationError) as caught:
				kiosk.verify_badge(scan)
			messages.add(str(caught.exception))
		frappe.db.set_value("Employee", self.employee, "status", "Left")
		with self.assertRaises(frappe.AuthenticationError) as caught:
			kiosk.verify_badge(token)
		messages.add(str(caught.exception))

		self.assertEqual(len(messages), 1)

	def test_a_refused_badge_does_not_sign_the_kiosk_out(self) -> None:
		"""frappe deletes the ``sid`` cookie when a request ends in exactly ``AuthenticationError``
		(frappe.app.handle_exception); a misread badge or an expired badge JWT must not do that."""
		expired = jwt.encode(
			{"employee_id": self.employee, "exp": time.time() - 60},
			get_token_secret(),
			algorithm="HS256",
		)
		frappe.set_user(KIOSK_USER)
		refusals = {
			"verify_badge": lambda: kiosk.verify_badge("not-a-badge"),
			"submit_checkin": lambda: api.submit_checkin("not-a-badge", PUNCH),
			"timeclock expired token": lambda: rfid_kiosk.extract_employee_from_token(expired),
			"timeclock invalid token": lambda: rfid_kiosk.extract_employee_from_token("not-a-token"),
			"job timeclock expired token": lambda: job_timeclock._resolve_employee(expired),
			"job timeclock invalid token": lambda: job_timeclock._resolve_employee("not-a-token"),
			"job timeclock no token": lambda: job_timeclock._resolve_employee(None),
		}
		for name, refuse in refusals.items():
			with self.subTest(name):
				with self.assertRaises(kiosk.KioskAuthenticationError) as caught:
					refuse()
				self.assertIsNot(type(caught.exception), frappe.AuthenticationError)

	# --- the Employee Clock-in/out web form: submit_checkin ---

	def test_submit_checkin_refuses_guest_and_non_kiosk_users(self) -> None:
		token = self._issue()
		for user in ("Guest", PLAIN_USER, HR_USER):
			frappe.set_user(user)
			with self.subTest(user=user), self.assertRaises(frappe.PermissionError):
				api.submit_checkin(token, PUNCH)
		frappe.set_user("Administrator")
		self.assertEqual(self._checkins(), [])

	def test_submit_checkin_is_not_a_guest_method(self) -> None:
		for method in (
			api.submit_checkin,
			rfid_kiosk.authenticate_employee,
			rfid_kiosk.log_in_employee,
			rfid_kiosk.log_out_employee,
			job_timeclock.authenticate_employee,
			job_timeclock.log_in_employee,
		):
			with self.subTest(method=method.__name__):
				self.assertIn(method, frappe.whitelisted)
				self.assertNotIn(method, frappe.guest_methods)
		for helper in (api.get_weekly_hours, api.determine_next_log_type):
			self.assertNotIn(helper, frappe.whitelisted)

	def test_submit_checkin_refuses_a_wrong_badge(self) -> None:
		frappe.set_user(KIOSK_USER)
		for scan in ("not-a-badge", self.employee):
			with self.subTest(scan=scan), self.assertRaises(frappe.AuthenticationError):
				api.submit_checkin(scan, PUNCH)
		frappe.set_user("Administrator")
		self.assertEqual(self._checkins(), [])

	def test_submit_checkin_with_a_badge(self) -> None:
		token = self._issue()

		result = api.submit_checkin(token, PUNCH)

		self.assertEqual(result, {"log_type": "IN", "employee_name": self.employee_name, "weekly_hours": 0.0})
		checkins = self._checkins()
		self.assertEqual(len(checkins), 1)
		self.assertEqual(checkins[0]["time"], datetime.datetime(2021, 3, 1, 8, 15))
		self.assertEqual(checkins[0]["device_id"], kiosk.DEVICE_ID)

	def test_submit_checkin_alternates_today(self) -> None:
		"""Without a manual time the server picks IN or OUT from today's punches."""
		frappe.set_user(KIOSK_USER)
		now = now_datetime().replace(second=0, microsecond=0)
		first = max(now - datetime.timedelta(minutes=1), now.replace(hour=0, minute=0))

		self.assertEqual(api.submit_checkin(self.rfid, str(first))["log_type"], "IN")
		if first != now:
			# the client's log_type is ignored unless the time was entered by hand
			self.assertEqual(api.submit_checkin(self.rfid, str(now), log_type="IN")["log_type"], "OUT")

	def test_submit_checkin_same_minute_keeps_the_first_punch(self) -> None:
		token = self._issue()
		api.submit_checkin(token, "2021-03-01 08:00:05", log_type="IN", manual_override=1)

		result = api.submit_checkin(token, "2021-03-01 08:00:40", log_type="OUT", manual_override=1)

		self.assertEqual(result["log_type"], "IN")
		self.assertEqual(len(self._checkins()), 1)

	def test_submit_checkin_manual_override(self) -> None:
		token = self._issue()

		result = api.submit_checkin(token, "2021-03-01 16:30:00", log_type="OUT", manual_override=1)

		self.assertEqual(result["log_type"], "OUT")
		self.assertEqual(self._checkins()[0]["manual_override"], 1)
		with self.assertRaises(frappe.ValidationError):
			api.submit_checkin(token, "2021-03-01 17:30:00", log_type="LUNCH", manual_override=1)

	def test_submit_checkin_is_rate_limited(self) -> None:
		frappe.set_user(KIOSK_USER)
		with _http_request("timeclock.timeclock.api.submit_checkin"):
			for _attempt in range(kiosk.KIOSK_SCAN_LIMIT):
				with self.assertRaises(frappe.AuthenticationError):
					api.submit_checkin("guess", PUNCH)
			with self.assertRaises(frappe.RateLimitExceededError):
				api.submit_checkin(self.rfid, PUNCH)
		frappe.set_user("Administrator")
		self.assertEqual(self._checkins(), [])

	def test_generic_web_form_submit_cannot_punch(self) -> None:
		"""frappe's own web_form.accept would take a bare Employee ID; the hook refuses it."""
		from frappe.website.doctype.web_form.web_form import accept

		frappe.set_user(KIOSK_USER)
		data = {"doctype": "Employee Checkin", "employee": self.employee, "time": PUNCH, "log_type": "IN"}
		try:
			with self.assertRaises(frappe.PermissionError):
				accept("employee-timelog", json.dumps(data))
		finally:
			frappe.flags.in_web_form = False
		frappe.set_user("Administrator")
		self.assertEqual(self._checkins(), [])

	# --- the RFID kiosk at /timeclock ---

	def test_rfid_kiosk_refuses_guest_and_non_kiosk_users(self) -> None:
		token = rfid_kiosk.refresh_token(self.employee)
		for user in ("Guest", PLAIN_USER):
			frappe.set_user(user)
			with self.subTest(user=user):
				with self.assertRaises(frappe.PermissionError):
					rfid_kiosk.authenticate_employee(self.rfid)
				with self.assertRaises(frappe.PermissionError):
					rfid_kiosk.log_in_employee(token, PUNCH)
				with self.assertRaises(frappe.PermissionError):
					rfid_kiosk.log_out_employee(token, PUNCH)
		frappe.set_user("Administrator")
		self.assertEqual(self._checkins(), [])

	def test_rfid_kiosk_accepts_an_issued_badge(self) -> None:
		token = self._issue()

		result = rfid_kiosk.authenticate_employee(token)

		self.assertEqual(result["status"], "success")
		self.assertEqual(rfid_kiosk.log_in_employee(result["token"], PUNCH)["status"], "success")

	def test_rfid_kiosk_refuses_an_employee_id(self) -> None:
		frappe.set_user(KIOSK_USER)

		result = rfid_kiosk.authenticate_employee(self.employee)

		self.assertEqual(result["status"], "error")
		self.assertNotIn("token", result)

	def test_rfid_kiosk_is_rate_limited(self) -> None:
		frappe.set_user(KIOSK_USER)
		with _http_request("timeclock.www.timeclock.authenticate_employee"):
			for _attempt in range(kiosk.KIOSK_SCAN_LIMIT):
				self.assertEqual(rfid_kiosk.authenticate_employee("guess")["status"], "error")
			with self.assertRaises(frappe.RateLimitExceededError):
				rfid_kiosk.authenticate_employee(self.rfid)

	# --- the job timeclock ---

	def test_job_timeclock_refuses_a_badge_token_outside_a_kiosk(self) -> None:
		frappe.set_user(KIOSK_USER)
		token = job_timeclock.authenticate_employee(self.rfid)["token"]

		frappe.set_user(PLAIN_USER)
		with self.assertRaises(frappe.PermissionError):
			job_timeclock.authenticate_employee(self.rfid)
		with self.assertRaises(frappe.PermissionError):
			job_timeclock._resolve_employee(token)

		frappe.set_user(KIOSK_USER)
		self.assertEqual(job_timeclock._resolve_employee(token)[0], self.employee)

	def test_job_timeclock_is_rate_limited(self) -> None:
		frappe.set_user(KIOSK_USER)
		with _http_request("timeclock.www.job_timeclock.job_timeclock.authenticate_employee"):
			for _attempt in range(kiosk.KIOSK_SCAN_LIMIT):
				self.assertEqual(job_timeclock.authenticate_employee("guess")["status"], "error")
			with self.assertRaises(frappe.RateLimitExceededError):
				job_timeclock.authenticate_employee(self.rfid)

	# --- the pages ---

	def test_kiosk_pages_send_guest_to_login(self) -> None:
		from timeclock.timeclock.web_form.employee_timelog import employee_timelog

		frappe.set_user("Guest")
		for page in (rfid_kiosk_page, job_timeclock_page, employee_timelog):
			with self.subTest(page=page.__name__), self.assertRaises(frappe.Redirect):
				page.get_context(frappe._dict())
		self.assertTrue(frappe.local.flags.redirect_location.startswith("/login?redirect-to="))

	def test_kiosk_pages_refuse_a_user_without_the_role(self) -> None:
		from timeclock.timeclock.web_form.employee_timelog import employee_timelog

		frappe.set_user(PLAIN_USER)
		for page in (rfid_kiosk_page, employee_timelog):
			with self.subTest(page=page.__name__), self.assertRaises(frappe.PermissionError):
				page.get_context(frappe._dict())

	def test_kiosk_page_renders_for_the_kiosk(self) -> None:
		frappe.set_user(KIOSK_USER)
		context = frappe._dict()

		rfid_kiosk_page.get_context(context)

		self.assertTrue(context.csrf_token)

	# --- the legacy job timeclock ---

	def test_legacy_job_timeclock_refuses_non_kiosk_users(self) -> None:
		"""Its endpoints take a bare Employee ID, so only a kiosk may call them."""
		token = legacy.refresh_token(self.employee)
		calls = {
			"authenticate_employee": lambda: legacy.authenticate_employee(self.rfid),
			"log_in_employee": lambda: legacy.log_in_employee(token, PUNCH),
			"log_out_employee": lambda: legacy.log_out_employee(token, PUNCH),
			"get_work_orders": lambda: legacy.get_work_orders(token),
			"get_job_cards": lambda: legacy.get_job_cards(token, "WO-DOES-NOT-EXIST"),
			"sort_jobcard_by_workstation": lambda: legacy.sort_jobcard_by_workstation([], ""),
			"log_end_time_of_jobcard": lambda: legacy.log_end_time_of_jobcard(self.employee, PUNCH, "JC-X"),
			"check_all_job_cards": lambda: legacy.check_all_job_cards(self.employee, PUNCH),
			"log_start_time_of_jobcard": lambda: legacy.log_start_time_of_jobcard(
				self.employee, PUNCH, "JC-X"
			),
			"check_for_erp_log_in": legacy.check_for_erp_log_in,
			"submit_jobcard": lambda: legacy.submit_jobcard({"name": "JC-X"}, PUNCH, self.employee),
		}
		whitelisted = {
			getattr(fn, "__name__", "")
			for fn in frappe.whitelisted
			if getattr(fn, "__module__", "") == legacy.__name__
		}
		self.assertEqual(set(calls), whitelisted)
		for user in ("Guest", PLAIN_USER, HR_USER):
			frappe.set_user(user)
			for name, call in calls.items():
				with self.subTest(user=user, method=name), self.assertRaises(frappe.PermissionError):
					call()
		frappe.set_user("Administrator")
		self.assertEqual(self._checkins(), [])

	def test_legacy_job_timeclock_page_is_a_kiosk_page(self) -> None:
		frappe.set_user("Guest")
		with self.assertRaises(frappe.Redirect):
			legacy_page.get_context(frappe._dict())
		frappe.set_user(PLAIN_USER)
		with self.assertRaises(frappe.PermissionError):
			legacy_page.get_context(frappe._dict())
		frappe.set_user(KIOSK_USER)
		context = frappe._dict()
		legacy_page.get_context(context)
		self.assertTrue(context.csrf_token)

	def test_legacy_job_timeclock_badge_scan(self) -> None:
		frappe.set_user(KIOSK_USER)
		self.assertEqual(legacy.authenticate_employee(self.rfid)["status"], "success")
		self.assertEqual(legacy.authenticate_employee(self.employee)["status"], "error")
