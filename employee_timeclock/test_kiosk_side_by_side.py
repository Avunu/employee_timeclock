# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""The new badge kiosk (``/timeclock``) and the Employee Clock-in/out web form (``/employee-timeclock``)
running side by side, as they do while the kiosk is tried out: both pages serve the same kiosk user,
and a shift can start on one and end on the other.
"""

import datetime
import re
from typing import Any
from unittest.mock import patch

import frappe
from frappe.tests import IntegrationTestCase
from frappe.utils import add_to_date, get_datetime, get_html_for_route, now_datetime, random_string, today

from employee_timeclock.kiosk import DEVICE_ID
from employee_timeclock.tests.utils import make_kiosk_user
from employee_timeclock.timeclock import api
from employee_timeclock.timeclock.test_api import _make_employee
from employee_timeclock.www import timeclock as kiosk


def _today_at(clock: str) -> datetime.datetime:
	return get_datetime(f"{today()} {clock}")


def _new_kiosk(badge: str, clock: str) -> str:
	"""A scan at the new kiosk at `clock` today; the punch's log type."""
	with patch.object(kiosk, "now_datetime", return_value=_today_at(clock)):
		return kiosk.punch(badge)["log_type"]


def _web_form(badge: str, clock: str) -> str:
	"""A scan at the web form at `clock` today, as its script sends it; the punch's log type."""
	return api.submit_checkin(badge, f"{today()} {clock}")["log_type"]


def _loaded(html: str) -> set[str]:
	"""What a page loads: each script src and link href, reduced to the bundle's name (frappe adds a
	content hash), plus the manifest. The page's text is left out, since a web form's boot data
	lists every bundle the site has."""
	urls = re.findall(r'<(?:script|link)\b[^>]*?\b(?:src|href)="([^"]+)"', html)
	return {re.sub(r"^.*/([\w.-]+?\.bundle)\.[\w-]+\.(?:js|css)$", r"\1", url) for url in urls}


class TestKioskSideBySide(IntegrationTestCase):
	employee: str
	rfid: str

	@classmethod
	def setUpClass(cls) -> None:
		super().setUpClass()
		cls.employee, _name = _make_employee()
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

	def tearDown(self) -> None:
		# get_html_for_route leaves its fake request behind, which the rate limiter would then read
		frappe.local.request = None
		frappe.set_user("Administrator")
		frappe.db.delete("Employee Checkin", {"employee": self.employee})
		frappe.db.delete("Workday", {"employee": self.employee})

	def _checkins(self) -> list[dict[str, Any]]:
		return frappe.get_all(
			"Employee Checkin",
			filters={"employee": self.employee},
			fields=["log_type", "time", "device_id", "manual_override"],
			order_by="time asc",
		)

	def _let_the_workday_settle(self) -> None:
		"""Age today's Workday past the minute in which a punch leaves a just-saved Workday alone, as
		the hours between a real shift's IN and OUT do."""
		frappe.db.set_value(
			"Workday",
			{"employee": self.employee, "date": today()},
			"last_modified",
			add_to_date(now_datetime(), minutes=-2),
			update_modified=False,
		)

	def _workday(self) -> dict[str, Any]:
		return frappe.db.get_value(
			"Workday",
			{"employee": self.employee, "date": today()},
			["check_in_1", "check_out_1", "total_hours"],
			as_dict=True,
		)

	def test_both_pages_serve_the_kiosk_user(self) -> None:
		new_kiosk = _loaded(get_html_for_route("timeclock"))
		web_form = _loaded(get_html_for_route("employee-timeclock/new"))

		self.assertIn("/timeclock/manifest.webmanifest", new_kiosk)
		self.assertIn("timeclock.bundle", new_kiosk)
		self.assertIn("kiosk.bundle", new_kiosk)
		self.assertIn("employee_timelog.bundle", web_form)
		# Each page loads only its own files: neither the kiosk's PWA and bundles on the web form,
		# nor the web form's on the kiosk.
		self.assertFalse({"timeclock.bundle", "kiosk.bundle", "/timeclock/manifest.webmanifest"} & web_form)
		self.assertNotIn("employee_timelog.bundle", new_kiosk)

	def test_a_shift_started_on_the_web_form_ends_on_the_new_kiosk(self) -> None:
		self.assertEqual(_web_form(self.rfid, "07:00:00"), "IN")
		self._let_the_workday_settle()
		self.assertEqual(_new_kiosk(self.rfid, "15:30"), "OUT")

		self.assertEqual([c["log_type"] for c in self._checkins()], ["IN", "OUT"])
		self.assertEqual(
			self._workday(), {"check_in_1": "7:00 AM", "check_out_1": "3:30 PM", "total_hours": 8.5}
		)

	def test_a_shift_started_on_the_new_kiosk_ends_on_the_web_form(self) -> None:
		self.assertEqual(_new_kiosk(self.rfid, "07:00"), "IN")
		self._let_the_workday_settle()
		self.assertEqual(_web_form(self.rfid, "15:30:00"), "OUT")

		self.assertEqual([c["log_type"] for c in self._checkins()], ["IN", "OUT"])
		self.assertEqual(
			self._workday(), {"check_in_1": "7:00 AM", "check_out_1": "3:30 PM", "total_hours": 8.5}
		)

	def test_a_scan_on_each_page_in_the_same_minute_is_one_punch(self) -> None:
		"""Someone who scans the new kiosk, then the old form to be sure, is punched once."""
		self.assertEqual(_new_kiosk(self.rfid, "07:00:10"), "IN")
		self.assertEqual(_web_form(self.rfid, "07:00:50"), "IN")

		self.assertEqual(len(self._checkins()), 1)

	def test_a_forgotten_punch_is_recorded_alike_from_either_page(self) -> None:
		with patch.object(kiosk, "now_datetime", return_value=_today_at("12:00")):
			kiosk.punch(self.rfid, f"{today()} 07:00:00", "IN")
		api.submit_checkin(self.rfid, f"{today()} 11:00:00", log_type="OUT", manual_override=1)

		self.assertEqual(
			[(c["log_type"], c["manual_override"]) for c in self._checkins()], [("IN", 1), ("OUT", 1)]
		)

	def test_punches_from_both_pages_carry_the_same_device(self) -> None:
		"""Both pages record the web form's device ID, so a report can't tell them apart."""
		_web_form(self.rfid, "07:00:00")
		_new_kiosk(self.rfid, "15:30")

		self.assertEqual({c["device_id"] for c in self._checkins()}, {DEVICE_ID})
