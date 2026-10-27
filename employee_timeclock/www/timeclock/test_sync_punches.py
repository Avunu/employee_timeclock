# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""Tests for ``sync_punches``: the punches the badge kiosk queued while it was offline."""

import datetime
from typing import Any, cast
from unittest.mock import patch

import frappe
from frappe.tests import IntegrationTestCase
from frappe.utils import add_to_date, get_datetime, random_string, today
from frappe.utils.redis_wrapper import RedisWrapper

from employee_timeclock.tests.utils import make_kiosk_user
from employee_timeclock.timeclock import api
from employee_timeclock.timeclock.test_api import _make_employee
from employee_timeclock.www import timeclock as kiosk

NOON = get_datetime(f"{today()} 12:00:00")


def _queued(clock: str, badge: str, **extra: Any) -> dict[str, Any]:
	"""A punch as the kiosk queues it, at `clock` today."""
	return {"id": f"q-{random_string(10)}", "badge": badge, "time": f"{today()} {clock}", **extra}


def _sync(punches: list[dict[str, Any]]) -> kiosk.SyncAnswer:
	"""sync_punches, at noon today on the server's clock."""
	with patch.object(kiosk, "now_datetime", return_value=NOON):
		return kiosk.sync_punches(punches)


class TestSyncPunches(IntegrationTestCase):
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
		cast(RedisWrapper, frappe.cache).delete_keys("rl:*")

	def tearDown(self) -> None:
		frappe.set_user("Administrator")
		frappe.db.delete("Employee Checkin", {"employee": self.employee})
		frappe.db.delete("Workday", {"employee": self.employee})
		frappe.db.delete("Error Log", {"method": ["like", "Timeclock: an offline punch%"]})

	def _checkins(self) -> list[dict[str, Any]]:
		return frappe.get_all(
			"Employee Checkin",
			filters={"employee": self.employee},
			fields=["log_type", "time", "manual_override", "kiosk_punch_id"],
			order_by="time asc",
		)

	def _statuses(self, answer: kiosk.SyncAnswer) -> dict[str, str]:
		return {result["id"]: result["status"] for result in answer["results"]}

	def _rejection_logs(self) -> list[str]:
		return frappe.get_all(
			"Error Log", filters={"method": ["like", "Timeclock: an offline punch%"]}, pluck="error"
		)

	def test_records_a_shift_at_the_times_it_was_scanned(self) -> None:
		punch_in = _queued("07:00:00", self.rfid)
		punch_out = _queued("11:30:00", self.rfid)

		answer = _sync([punch_out, punch_in])  # sent newest first; recorded oldest first

		self.assertEqual(self._statuses(answer), {punch_in["id"]: "recorded", punch_out["id"]: "recorded"})
		self.assertEqual(
			[(c["log_type"], c["time"], c["kiosk_punch_id"]) for c in self._checkins()],
			[
				("IN", get_datetime(f"{today()} 07:00:00"), punch_in["id"]),
				("OUT", get_datetime(f"{today()} 11:30:00"), punch_out["id"]),
			],
		)
		self.assertEqual(answer["server_time"], f"{today()} 12:00:00")

	def test_the_workday_holds_the_whole_shift_synced_in_one_batch(self) -> None:
		_sync([_queued("07:00:00", self.rfid), _queued("11:30:00", self.rfid)])

		workday = frappe.db.get_value(
			"Workday",
			{"employee": self.employee, "date": today()},
			["check_in_1", "check_out_1", "total_hours"],
			as_dict=True,
		)
		self.assertEqual(workday, {"check_in_1": "7:00 AM", "check_out_1": "11:30 AM", "total_hours": 4.5})

	def test_a_punch_synced_twice_is_a_duplicate(self) -> None:
		punch_in = _queued("07:00:00", self.rfid)
		_sync([punch_in])

		answer = _sync([punch_in])

		self.assertEqual(self._statuses(answer), {punch_in["id"]: "duplicate"})
		self.assertEqual(len(self._checkins()), 1)

	def test_a_punch_already_sent_live_is_a_duplicate(self) -> None:
		"""A live punch whose answer was lost, then queued and synced, is not recorded again."""
		with patch.object(kiosk, "now_datetime", return_value=get_datetime(f"{today()} 07:00:00")):
			kiosk.punch(self.rfid, punch_id="lost-answer")

		answer = _sync([{"id": "lost-answer", "badge": self.rfid, "time": f"{today()} 07:00:20"}])

		self.assertEqual(self._statuses(answer), {"lost-answer": "duplicate"})
		self.assertEqual(len(self._checkins()), 1)

	def test_a_forgotten_punch_entered_offline_keeps_its_choice(self) -> None:
		punch_out = _queued("09:00:00", self.rfid, log_type="OUT", manual=1)

		_sync([punch_out])

		self.assertEqual([(c["log_type"], c["manual_override"]) for c in self._checkins()], [("OUT", 1)])

	def test_one_refused_punch_leaves_the_rest_of_the_batch_alone(self) -> None:
		unknown = _queued("07:00:00", "NOT-A-BADGE")
		malformed = {"id": "malformed", "badge": self.rfid, "time": "7:30 AM"}
		ahead = _queued("12:06:00", self.rfid)
		old = {"id": "old", "badge": self.rfid, "time": str(add_to_date(NOON, days=-8))}
		no_choice = _queued("08:00:00", self.rfid, manual=1)
		good = _queued("09:00:00", self.rfid)
		within_drift = _queued("12:04:00", self.rfid)

		answer = _sync([unknown, malformed, ahead, old, no_choice, good, within_drift])

		self.assertEqual(
			self._statuses(answer),
			{
				unknown["id"]: "rejected",
				"malformed": "rejected",
				ahead["id"]: "rejected",
				"old": "rejected",
				no_choice["id"]: "rejected",
				good["id"]: "recorded",
				within_drift["id"]: "recorded",
			},
		)
		self.assertEqual([c["kiosk_punch_id"] for c in self._checkins()], [good["id"], within_drift["id"]])

	def test_each_refusal_is_logged_for_hr_without_the_badge(self) -> None:
		_sync(
			[
				_queued("07:00:00", "NOT-A-BADGE"),
				{"id": "malformed", "badge": self.rfid, "time": "7:30 AM"},
				_queued("12:06:00", self.rfid),
				{"id": "old", "badge": self.rfid, "time": str(add_to_date(NOON, days=-8))},
				_queued("08:00:00", self.rfid, manual=1),
			]
		)

		logs = " | ".join(self._rejection_logs())
		for reason in (
			"its badge is not recognised",
			"its time is not a date and time",
			"its time is ahead of the server's clock",
			"it is more than a week old",
			"Choose Clock In or Clock Out.",
		):
			self.assertIn(reason, logs)
		self.assertNotIn("NOT-A-BADGE", logs)
		self.assertNotIn(self.rfid, logs)

	def test_a_failure_with_no_message_is_logged_by_its_kind(self) -> None:
		with patch.object(kiosk, "record_punch", side_effect=RuntimeError()):
			answer = _sync([_queued("07:00:00", self.rfid)])

		self.assertEqual([r["status"] for r in answer["results"]], ["rejected"])
		self.assertIn("RuntimeError", " ".join(self._rejection_logs()))
		self.assertEqual(self._checkins(), [])

	def test_a_failed_punch_leaves_nothing_half_written(self) -> None:
		"""The Workday sync failing after the insert undoes that punch's insert too."""
		with patch.object(api, "update_workday_from_checkin", side_effect=RuntimeError("sync failed")):
			answer = _sync([_queued("07:00:00", self.rfid)])

		self.assertEqual([r["status"] for r in answer["results"]], ["rejected"])
		self.assertEqual(self._checkins(), [])

	def test_a_batch_with_nothing_recorded_rebuilds_no_workdays(self) -> None:
		"""Regression: an empty id list reached frappe.get_all, which dropped the filter and rebuilt
		every employee's Workdays."""
		with patch.object(kiosk, "resync_around") as resync:
			_sync([_queued("07:00:00", "NOT-A-BADGE")])

		resync.assert_not_called()

	def test_nothing_to_sync_is_fine(self) -> None:
		self.assertEqual(_sync([]), {"results": [], "server_time": f"{today()} 12:00:00"})

	def test_refuses_more_than_a_batch(self) -> None:
		too_many = [_queued("07:00:00", self.rfid) for _ in range(kiosk.SYNC_BATCH_LIMIT + 1)]

		with self.assertRaises(frappe.ValidationError):
			_sync(too_many)
		self.assertEqual(self._checkins(), [])

	def test_refuses_a_punch_without_an_id(self) -> None:
		with self.assertRaises(frappe.ValidationError):
			_sync([{"badge": self.rfid, "time": f"{today()} 07:00:00"}])
		self.assertEqual(self._checkins(), [])

	def test_refuses_a_user_without_the_kiosk_role(self) -> None:
		frappe.set_user("Guest")

		with self.assertRaises(frappe.PermissionError):
			_sync([_queued("07:00:00", self.rfid)])

	def test_the_oldest_allowed_and_furthest_ahead_allowed_are_recorded(self) -> None:
		oldest = {
			"id": "oldest",
			"badge": self.rfid,
			"time": str(NOON - kiosk.OFFLINE_PUNCH_MAX_AGE),
		}
		furthest = {
			"id": "furthest",
			"badge": self.rfid,
			"time": str(NOON + kiosk.OFFLINE_PUNCH_MAX_AHEAD),
		}

		answer = _sync([oldest, furthest])

		self.assertEqual(self._statuses(answer), {"oldest": "recorded", "furthest": "recorded"})
		self.assertEqual(
			[c["time"] for c in self._checkins()],
			[NOON - datetime.timedelta(days=7), NOON + datetime.timedelta(minutes=5)],
		)
