# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""Tests for the tracker's offline side: ``sync_timer_events`` and ``get_offline_snapshot``."""

import datetime
from typing import Any

import frappe
from frappe.utils import add_to_date, get_datetime, now_datetime, random_string

from employee_timeclock.tests.utils import KIOSK_USER
from employee_timeclock.www.job_timeclock import job_timeclock
from employee_timeclock.www.job_timeclock.test_job_timeclock import JobTimeclockTestCase
from employee_timeclock.www.timeclock import OFFLINE_PUNCH_MAX_AGE, TIME_FORMAT


def _clock(at: datetime.datetime) -> str:
	return at.strftime(TIME_FORMAT)


class TestSyncTimerEvents(JobTimeclockTestCase):
	base: datetime.datetime

	def setUp(self) -> None:
		super().setUp()
		# Three hours ago, to a second: every test's events are in the recent past.
		self.base = add_to_date(now_datetime(), hours=-3).replace(microsecond=0)

	def _event(self, action: str, at: datetime.datetime, **extra: Any) -> dict[str, Any]:
		return {
			"id": f"e-{random_string(10)}",
			"action": action,
			"badge": self._test_device_id.id,
			"work_order": str(self._test_work_order.name),
			"operation": str(self._test_operation.name),
			"time": _clock(at),
			**extra,
		}

	def _sync(self, *events: dict[str, Any]) -> list[str]:
		frappe.set_user(KIOSK_USER)
		try:
			answer = job_timeclock.sync_timer_events(list(events))
		finally:
			frappe.set_user("Administrator")
		self.assertTrue(answer["server_time"])
		by_id = {result["id"]: result["status"] for result in answer["results"]}
		return [by_id[event["id"]] for event in events]

	def _logs(self) -> list[frappe._dict]:
		return frappe.get_all(
			"Job Card Time Log",
			filters={"parent": self._test_job_cards[0].name, "parentfield": "time_logs"},
			fields=["from_time", "to_time", "employee", "kiosk_start_id", "kiosk_stop_id"],
			order_by="from_time",
		)

	def test_a_start_and_stop_make_one_closed_log(self) -> None:
		start = self._event("start", self.base)
		stop = self._event("stop", add_to_date(self.base, minutes=30))

		self.assertEqual(self._sync(start, stop), ["recorded", "recorded"])

		logs = self._logs()
		self.assertEqual(len(logs), 1)
		self.assertEqual(logs[0].employee, self._test_employee.name)
		self.assertEqual(get_datetime(logs[0].from_time), self.base)
		self.assertEqual(get_datetime(logs[0].to_time), add_to_date(self.base, minutes=30))
		self.assertEqual(logs[0].kiosk_start_id, start["id"])
		self.assertEqual(logs[0].kiosk_stop_id, stop["id"])

	def test_events_are_applied_oldest_first_whatever_order_they_came_in(self) -> None:
		start = self._event("start", self.base)
		stop = self._event("stop", add_to_date(self.base, minutes=5))

		self.assertEqual(self._sync(stop, start), ["recorded", "recorded"])

		self.assertIsNotNone(self._logs()[0].to_time)

	def test_an_event_sent_twice_is_recorded_once(self) -> None:
		start = self._event("start", self.base)
		stop = self._event("stop", add_to_date(self.base, minutes=5))
		self._sync(start, stop)

		self.assertEqual(self._sync(start, stop), ["duplicate", "duplicate"])

		self.assertEqual(len(self._logs()), 1)

	def test_a_queued_copy_of_an_online_call_is_a_duplicate(self) -> None:
		"""The answer to an online call was lost, so the tablet queued the same event."""
		start = self._event("start", self.base)
		frappe.set_user(KIOSK_USER)
		token = job_timeclock.authenticate_employee(self._test_device_id.id)["token"]
		answer = job_timeclock.start_timer(
			start["work_order"],
			start["operation"],
			start["time"],
			token=token,
			event_id=start["id"],
		)
		frappe.set_user("Administrator")
		self.assertTrue(answer["server_time"])

		self.assertEqual(self._sync(start), ["duplicate"])

		self.assertEqual(len(self._logs()), 1)

	def test_an_online_retry_is_recorded_once(self) -> None:
		event_id = f"e-{random_string(10)}"
		args = {
			"work_order": str(self._test_work_order.name),
			"operation": str(self._test_operation.name),
			"start_time": _clock(self.base),
			"event_id": event_id,
		}
		frappe.set_user(KIOSK_USER)
		token = job_timeclock.authenticate_employee(self._test_device_id.id)["token"]
		job_timeclock.start_timer(**args, token=token)
		job_timeclock.start_timer(**args, token=token)
		stop = {"end_time": _clock(add_to_date(self.base, minutes=5)), "event_id": f"s-{event_id}"}
		self.assertEqual(job_timeclock.stop_timer(**stop, token=token)["status"], "success")
		self.assertEqual(job_timeclock.stop_timer(**stop, token=token)["status"], "success")
		frappe.set_user("Administrator")

		self.assertEqual(len(self._logs()), 1)

	def test_an_unknown_badge_is_rejected_and_logged_without_the_badge(self) -> None:
		event = self._event("start", self.base, badge="NOT-A-BADGE")

		self.assertEqual(self._sync(event), ["rejected"])

		self.assertEqual(self._logs(), [])
		logged = frappe.get_all(
			"Error Log",
			filters={"method": "Timeclock: an offline timer event was not recorded"},
			fields=["error"],
			order_by="creation desc",
			limit=1,
		)
		self.assertIn(event["id"], logged[0].error)
		self.assertNotIn("NOT-A-BADGE", logged[0].error)

	def test_times_out_of_range_are_rejected(self) -> None:
		now = now_datetime()
		for at in (add_to_date(now, hours=1), now - OFFLINE_PUNCH_MAX_AGE - datetime.timedelta(minutes=1)):
			with self.subTest(at=at):
				self.assertEqual(self._sync(self._event("start", at)), ["rejected"])
		self.assertEqual(self._sync(self._event("start", self.base, time="not a time")), ["rejected"])
		self.assertEqual(self._logs(), [])

	def test_a_stop_with_nothing_open_is_rejected(self) -> None:
		self.assertEqual(self._sync(self._event("stop", self.base)), ["rejected"])

	def test_an_unknown_action_is_rejected(self) -> None:
		self.assertEqual(self._sync(self._event("pause", self.base)), ["rejected"])

	def test_a_failure_leaves_the_rest_of_the_batch_alone(self) -> None:
		bad = self._event("start", self.base, operation="Not An Operation")
		good = self._event("start", add_to_date(self.base, minutes=1))

		self.assertEqual(self._sync(bad, good), ["rejected", "recorded"])

		self.assertEqual(len(self._logs()), 1)

	def test_a_late_stop_leaves_a_newer_timer_running(self) -> None:
		"""Started here at 0:00, stopped at 0:10; meanwhile another tablet started at 0:20."""
		newer = self._event("start", add_to_date(self.base, minutes=20))
		self._sync(newer)
		start = self._event("start", self.base)
		stop = self._event("stop", add_to_date(self.base, minutes=10))

		self.assertEqual(self._sync(start, stop), ["recorded", "recorded"])

		logs = self._logs()
		self.assertEqual(len(logs), 2)
		self.assertEqual(get_datetime(logs[0].to_time), add_to_date(self.base, minutes=10))
		self.assertIsNone(logs[1].to_time)

	def test_a_late_start_nothing_stopped_ends_where_the_next_log_begins(self) -> None:
		newer = self._event("start", add_to_date(self.base, minutes=20))
		self._sync(newer)

		self.assertEqual(self._sync(self._event("start", self.base)), ["recorded"])

		logs = self._logs()
		self.assertEqual(get_datetime(logs[0].to_time), add_to_date(self.base, minutes=20))
		self.assertIsNone(logs[1].to_time)

	def test_no_log_ever_stops_before_it_starts(self) -> None:
		events = [
			self._event("start", add_to_date(self.base, minutes=20)),
			self._event("start", self.base),
			self._event("stop", add_to_date(self.base, minutes=10)),
			self._event("stop", add_to_date(self.base, minutes=30)),
		]
		for event in events:
			self._sync(event)

		for log in self._logs():
			if log.to_time:
				self.assertGreater(get_datetime(log.to_time), get_datetime(log.from_time))

	def test_badges_need_the_kiosk_role_before_anything_is_recorded(self) -> None:
		"""Refused outright, so the tablet keeps its queue rather than dropping every event."""
		frappe.set_user("Guest")
		with self.assertRaises(frappe.PermissionError):
			job_timeclock.sync_timer_events([self._event("start", self.base)])
		frappe.set_user("Administrator")

	def test_an_event_with_no_badge_needs_a_signed_in_employee(self) -> None:
		self.assertEqual(self._sync(self._event("start", self.base, badge=None)), ["rejected"])

	def test_batch_limits(self) -> None:
		frappe.set_user(KIOSK_USER)
		self.addCleanup(frappe.set_user, "Administrator")
		too_many = [self._event("stop", self.base) for _ in range(job_timeclock.SYNC_BATCH_LIMIT + 1)]
		with self.assertRaises(frappe.ValidationError):
			job_timeclock.sync_timer_events(too_many)
		with self.assertRaises(frappe.ValidationError):
			job_timeclock.sync_timer_events([{"action": "stop"}])


class TestOfflineSnapshot(JobTimeclockTestCase):
	def test_a_kiosk_gets_the_open_work_orders_and_their_operations(self) -> None:
		frappe.set_user(KIOSK_USER)
		snapshot = job_timeclock.get_offline_snapshot()
		frappe.set_user("Administrator")

		work_order = str(self._test_work_order.name)
		self.assertIn(work_order, [wo["name"] for wo in snapshot["work_orders"]])
		operations = snapshot["operations"][work_order]
		self.assertIn(str(self._test_operation.name), [op["operation"] for op in operations])
		self.assertTrue(all(op["employee_time_mins"] == 0 for op in operations))
		self.assertIn(str(self._test_workstation.name), snapshot["workstations"])
		self.assertTrue(snapshot["server_time"])

	def test_a_user_who_is_neither_a_kiosk_nor_an_employee_is_refused(self) -> None:
		frappe.set_user("Guest")
		with self.assertRaises(frappe.PermissionError):
			job_timeclock.get_offline_snapshot()
		frappe.set_user("Administrator")
