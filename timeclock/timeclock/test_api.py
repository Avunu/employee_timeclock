# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""
Tests for the Employee Clock-in/out web form API (``timeclock.timeclock.api``).

Covers the chain the ``/employee-timeclock`` web form runs on a badge scan
(``determine_next_log_type`` -> ``submit_checkin`` -> ``get_weekly_hours``) and the
Employee Checkin ``on_update`` hook that keeps the Workday in sync.

Regression: ``update_workday_from_checkin`` was whitelisted while annotated with the
typing-only ``EmployeeCheckin`` shell. Frappe type-checks whitelisted functions inside a
request (and inside tests), so once the shell stopped being the registered controller
every Employee Checkin save raised ``FrappeTypeError`` and the web form hung.

Nothing commits: every record is created by an ``_ensure_*``/``_make_*`` helper inside the
class's transaction, deleted in teardown, and rolled back when the class finishes.
"""

import datetime
import json
from typing import Any, cast

import frappe
from frappe.tests import IntegrationTestCase
from frappe.utils import get_first_day_of_week, now_datetime, random_string, today
from frappe.utils.password import get_encryption_key
from frappe.utils.typing_validations import transform_parameter_types

from timeclock import hooks
from timeclock.timeclock import api
from timeclock.timeclock.custom.employee_checkin import EmployeeCheckin
from timeclock.www.job_timeclock import job_timeclock

# A fixed Monday, so slot labels and day_of_week are exact rather than "whatever today is"
PUNCH_DATE = datetime.date(2021, 3, 1)
DEVICE_ID = "Employee Clock-in/out Device"


def _ensure_company() -> str:
	"""Return a Company to hire the test employee into, creating one on an empty site."""
	company = frappe.db.get_single_value("Global Defaults", "default_company") or frappe.db.get_value(
		"Company", {}, "name"
	)
	if company:
		return cast(str, company)
	return cast(
		str,
		frappe.get_doc(
			{
				"doctype": "Company",
				"company_name": "_Test Timeclock Company",
				"abbr": "_TTC",
				"default_currency": "USD",
				"country": "United States",
			}
		)
		.insert(ignore_permissions=True)
		.name,
	)


def _make_employee() -> tuple[str, str]:
	"""Create a uniquely named active employee. Returns (name, employee_name)."""
	unique_id = random_string(6)
	employee = frappe.get_doc(
		{
			"doctype": "Employee",
			"first_name": f"_Test Timeclock {unique_id}",
			"company": _ensure_company(),
			"gender": "Male",
			"date_of_birth": "1990-01-01",
			"date_of_joining": "2020-01-01",
			"status": "Active",
		}
	).insert(ignore_permissions=True)
	return cast(str, employee.name), cast(str, employee.get("employee_name"))


def _punch_time(hour: int, minute: int = 0, second: int = 0) -> datetime.datetime:
	return datetime.datetime.combine(PUNCH_DATE, datetime.time(hour, minute, second))


class TestTimeclockApi(IntegrationTestCase):
	employee: str
	employee_name: str

	@classmethod
	def setUpClass(cls) -> None:
		super().setUpClass()
		# the job timeclock signs its badge tokens with the site's encryption key; a fresh site has
		# none until something asks for it
		get_encryption_key()
		cls.employee, cls.employee_name = _make_employee()

	@classmethod
	def _delete_punches(cls) -> None:
		"""Remove this employee's checkins and workdays without firing their hooks."""
		frappe.db.delete("Employee Checkin", {"employee": cls.employee})
		frappe.db.delete("Workday", {"employee": cls.employee})

	@classmethod
	def tearDownClass(cls) -> None:
		cls._delete_punches()
		frappe.delete_doc("Employee", cls.employee, force=True, ignore_permissions=True)
		super().tearDownClass()

	def setUp(self) -> None:
		# the web form is a guest page, so run the API the way it is really called
		frappe.set_user("Guest")

	def tearDown(self) -> None:
		frappe.set_user("Administrator")
		self._delete_punches()

	def _form_data(self, time: datetime.datetime, log_type: str = "IN", **overrides: Any) -> str:
		"""The JSON payload the web form posts to submit_checkin."""
		data = {
			"doctype": "Employee Checkin",
			"web_form_name": "employee-timelog",
			"employee": self.employee,
			"time": time.strftime("%Y-%m-%d %H:%M:%S"),
			"log_type": log_type,
			"manual_override": 0,
			"device_id": DEVICE_ID,
		}
		data.update(overrides)
		return json.dumps(data)

	def _checkins(self) -> list[dict[str, Any]]:
		return frappe.get_all(
			"Employee Checkin",
			filters={"employee": self.employee},
			fields=["name", "time", "log_type", "workday", "device_id"],
			order_by="time asc",
		)

	def _workdays(self) -> list[dict[str, Any]]:
		return frappe.get_all(
			"Workday",
			filters={"employee": self.employee},
			fields=[
				"name",
				"date",
				"day_of_week",
				"employee_name",
				"check_in_1",
				"check_in_1_dt",
				"check_out_1",
				"check_out_1_dt",
				"check_in_2",
				"total_hours",
			],
		)

	def _age_workday(self, name: str) -> None:
		"""Move a Workday out of the 60 second "just modified" window that skips resyncs."""
		frappe.db.set_value(
			"Workday",
			name,
			"last_modified",
			now_datetime() - datetime.timedelta(minutes=5),
			update_modified=False,
		)

	# --- regression: the hook must accept the real Employee Checkin controller ---

	def test_doc_event_hooks_accept_their_doctype_controller(self) -> None:
		"""Whitelisted doc_events handlers are type-checked in requests; their annotation must match."""
		for doctype, events in hooks.doc_events.items():
			for event, handlers in events.items():
				for handler in [handlers] if isinstance(handlers, str) else handlers:
					fn = frappe.get_attr(handler)
					if fn not in frappe.whitelisted:
						continue
					with self.subTest(doctype=doctype, event=event, handler=handler):
						# raises FrappeTypeError when the annotation rejects the controller
						transform_parameter_types(fn.__wrapped__, (frappe.new_doc(doctype), event), {})

	def test_update_workday_from_checkin_is_not_an_http_endpoint(self) -> None:
		"""It takes a document, so it is only reachable as a hook, never as a guest API method."""
		self.assertNotIn(api.update_workday_from_checkin, frappe.whitelisted)
		self.assertNotIn(api.update_workday_from_checkin, frappe.guest_methods)

	def test_inserting_checkin_builds_workday(self) -> None:
		"""Saving an Employee Checkin runs the on_update hook and files the punch on a Workday."""
		checkin = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
		checkin.employee = self.employee
		checkin.time = _punch_time(8)
		checkin.log_type = "IN"
		checkin.insert(ignore_permissions=True)

		workdays = self._workdays()
		self.assertEqual(len(workdays), 1)
		self.assertEqual(workdays[0]["date"], PUNCH_DATE)
		self.assertEqual(workdays[0]["day_of_week"], "Monday")
		self.assertEqual(workdays[0]["employee_name"], self.employee_name)
		self.assertEqual(workdays[0]["check_in_1"], "8:00 AM")
		self.assertEqual(workdays[0]["check_in_1_dt"], _punch_time(8))
		self.assertEqual(
			frappe.db.get_value("Employee Checkin", checkin.name, "workday"), workdays[0]["name"]
		)

	# --- submit_checkin ---

	def test_submit_checkin_clocks_in(self) -> None:
		"""A badge scan creates the checkin, links a new Workday and reports the log type."""
		result = api.submit_checkin("employee-timelog", self._form_data(_punch_time(8, 15, 42)))

		self.assertEqual(result, "IN")
		checkins = self._checkins()
		self.assertEqual(len(checkins), 1)
		# seconds are dropped so a punch lands on the minute
		self.assertEqual(checkins[0]["time"], _punch_time(8, 15))
		self.assertEqual(checkins[0]["log_type"], "IN")
		self.assertEqual(checkins[0]["device_id"], DEVICE_ID)

		workdays = self._workdays()
		self.assertEqual(len(workdays), 1)
		self.assertEqual(checkins[0]["workday"], workdays[0]["name"])
		self.assertEqual(workdays[0]["check_in_1"], "8:15 AM")
		self.assertIsNone(workdays[0]["check_out_1"])
		self.assertEqual(workdays[0]["total_hours"], 0)

	def test_submit_checkin_in_then_out_totals_hours(self) -> None:
		"""Clocking out fills the matching check-out slot and totals the day on the same Workday."""
		api.submit_checkin("employee-timelog", self._form_data(_punch_time(8)))
		self._age_workday(self._workdays()[0]["name"])

		result = api.submit_checkin("employee-timelog", self._form_data(_punch_time(12, 30), "OUT"))

		self.assertEqual(result, "OUT")
		workdays = self._workdays()
		self.assertEqual(len(workdays), 1)
		self.assertEqual(workdays[0]["check_in_1"], "8:00 AM")
		self.assertEqual(workdays[0]["check_out_1"], "12:30 PM")
		self.assertEqual(workdays[0]["check_out_1_dt"], _punch_time(12, 30))
		self.assertIsNone(workdays[0]["check_in_2"])
		self.assertEqual(workdays[0]["total_hours"], 4.5)
		self.assertEqual({c["workday"] for c in self._checkins()}, {workdays[0]["name"]})

	# --- on_trash: clear_workday_punch_on_checkin_trash ---

	def _clock_in_and_out(self) -> tuple[str, str]:
		"""Punch 8:00 AM in and 12:30 PM out. Returns (workday, the OUT checkin's name)."""
		api.submit_checkin("employee-timelog", self._form_data(_punch_time(8)))
		workday = self._workdays()[0]["name"]
		self._age_workday(workday)
		api.submit_checkin("employee-timelog", self._form_data(_punch_time(12, 30), "OUT"))
		out = frappe.get_all(
			"Employee Checkin", filters={"employee": self.employee, "log_type": "OUT"}, pluck="name"
		)
		self.assertEqual(len(out), 1)
		return workday, out[0]

	def test_trashing_a_checkin_clears_its_workday_punch(self) -> None:
		"""Deleting a checkin from the desk empties its Workday slot and re-totals the day."""
		workday, out = self._clock_in_and_out()
		self._age_workday(workday)

		frappe.delete_doc("Employee Checkin", out, ignore_permissions=True)

		row = frappe.db.get_value(
			"Workday",
			workday,
			["check_in_1", "check_in_1_dt", "check_out_1", "check_out_1_dt", "total_hours"],
			as_dict=True,
		)
		self.assertEqual(row.check_in_1, "8:00 AM")
		self.assertEqual(row.check_in_1_dt, _punch_time(8))
		self.assertIsNone(row.check_out_1)
		self.assertIsNone(row.check_out_1_dt)
		self.assertEqual(row.total_hours, 0)

	def test_trashing_a_checkin_inside_the_resync_window_leaves_the_workday(self) -> None:
		"""Inside 60 s of a Workday edit the hook does nothing: the edit itself deletes the checkins."""
		workday, out = self._clock_in_and_out()
		# a desk save of the Workday stamps last_modified (before_save) and then deletes its checkins
		frappe.db.set_value("Workday", workday, "last_modified", now_datetime(), update_modified=False)
		before = frappe.db.get_value("Workday", workday, ["check_out_1", "total_hours"], as_dict=True)

		frappe.delete_doc("Employee Checkin", out, ignore_permissions=True)

		after = frappe.db.get_value("Workday", workday, ["check_out_1", "total_hours"], as_dict=True)
		self.assertEqual(after, before)
		self.assertEqual(after.check_out_1, "12:30 PM")
		self.assertEqual(after.total_hours, 4.5)

	def test_submit_checkin_same_minute_does_not_duplicate(self) -> None:
		"""A second scan inside the same minute reuses the existing checkin."""
		api.submit_checkin("employee-timelog", self._form_data(_punch_time(8, 0, 5)))

		result = api.submit_checkin("employee-timelog", self._form_data(_punch_time(8, 0, 40), "OUT"))

		# the existing punch is kept as-is, so the form reports its log type
		self.assertEqual(result, "IN")
		self.assertEqual(len(self._checkins()), 1)
		self.assertEqual(len(self._workdays()), 1)

	# --- the rest of the web form chain ---

	def test_determine_next_log_type_alternates(self) -> None:
		"""No punches today means IN; after an IN the next is OUT, and back again."""
		self.assertEqual(api.determine_next_log_type(self.employee), "IN")

		now = now_datetime().replace(second=0, microsecond=0)
		for minutes_ago, log_type, expected_next in ((2, "IN", "OUT"), (1, "OUT", "IN")):
			# written directly so the test never depends on what time of day it runs
			frappe.get_doc(
				{
					"doctype": "Employee Checkin",
					"employee": self.employee,
					"time": max(
						now - datetime.timedelta(minutes=minutes_ago),
						datetime.datetime.combine(now.date(), datetime.time(0, 0, 1)),
					),
					"log_type": log_type,
				}
			).db_insert()
			self.assertEqual(api.determine_next_log_type(self.employee), expected_next)

	def test_get_weekly_hours_sums_this_weeks_workdays(self) -> None:
		"""Returns the display name and this week's total, ignoring other weeks."""
		self.assertEqual(api.get_weekly_hours(self.employee), [self.employee_name, 0.0])

		week_start = get_first_day_of_week(today())
		for date, hours in (
			(week_start, 2.5),
			(week_start + datetime.timedelta(days=6), 3.254),
			(week_start - datetime.timedelta(days=1), 8),
		):
			frappe.get_doc(
				{"doctype": "Workday", "employee": self.employee, "date": date, "total_hours": hours}
			).db_insert()

		self.assertEqual(api.get_weekly_hours(self.employee), [self.employee_name, 5.75])

	# --- other entry points that save an Employee Checkin ---

	def test_job_timeclock_log_in_builds_workday(self) -> None:
		"""The job timeclock swallows insert errors, so assert the Workday really got built."""
		token = job_timeclock.refresh_token(self.employee)

		result = job_timeclock.log_in_employee(str(_punch_time(7, 45)), token=token)

		self.assertEqual(result["status"], "success")
		checkins = self._checkins()
		self.assertEqual(len(checkins), 1)
		workdays = self._workdays()
		self.assertEqual(len(workdays), 1)
		self.assertEqual(checkins[0]["workday"], workdays[0]["name"])
		self.assertEqual(workdays[0]["check_in_1"], "7:45 AM")

	def test_submit_checkin2_records_the_punch(self) -> None:
		"""The older payload variant (no web form name) records the punch and builds the Workday."""
		api.submit_checkin2(self._form_data(_punch_time(9, 5, 30)))

		checkins = self._checkins()
		self.assertEqual(len(checkins), 1)
		self.assertEqual(checkins[0]["time"], _punch_time(9, 5))
		self.assertEqual(self._workdays()[0]["check_in_1"], "9:05 AM")

	def test_submit_checkin2_same_minute_does_not_duplicate(self) -> None:
		api.submit_checkin2(self._form_data(_punch_time(9, 5, 10)))
		api.submit_checkin2(self._form_data(_punch_time(9, 5, 50)))

		self.assertEqual(len(self._checkins()), 1)

	def test_web_form_context(self) -> None:
		"""The form defaults the override date to today and loads its time picker bundles."""
		from timeclock.timeclock.web_form.employee_timelog import employee_timelog

		field = {"fieldname": "manual_override_date", "default": "Today"}
		context = frappe._dict(web_form_doc={"web_form_fields": [field]})

		employee_timelog.get_context(context)

		self.assertEqual(field["default"], today())
		head_include = cast(str, context.head_include)
		self.assertIn("timeclock.bundle", head_include)
		self.assertIn("employee_timelog.bundle", head_include)
