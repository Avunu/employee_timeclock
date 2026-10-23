# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""
Tests for the patch that rebuilds Workdays built before night shifts were paired across midnight
(``employee_timeclock.patches.rebuild_workdays_for_night_shifts``).

The Workdays here are written the way the old calendar-date sync left them: a night shift's IN
alone on the first day and its OUT alone on the next, neither counting the shift's hours.
"""

import datetime
from collections import Counter
from typing import Any, cast
from unittest.mock import patch

import frappe
from frappe.tests import IntegrationTestCase
from frappe.utils import random_string

from employee_timeclock.patches import rebuild_workdays_for_night_shifts as rebuild
from employee_timeclock.timeclock.custom.employee_checkin import EmployeeCheckin
from employee_timeclock.timeclock.doctype.workday.workday import Workday
from employee_timeclock.timeclock.test_api import _ensure_company, _make_employee

DAY = datetime.date(2021, 3, 1)
NEXT_DAY = datetime.date(2021, 3, 2)


def _at(day: datetime.date, hour: int, minute: int = 0) -> datetime.datetime:
	return datetime.datetime.combine(day, datetime.time(hour, minute))


class TestRebuildWorkdaysForNightShifts(IntegrationTestCase):
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

	def setUp(self) -> None:
		frappe.set_user("Administrator")

	def tearDown(self) -> None:
		names = frappe.get_all("Workday", {"employee": self.employee}, pluck="name")
		if names:
			frappe.db.delete("Comment", {"reference_doctype": "Workday", "reference_name": ["in", names]})
		frappe.db.delete("Employee Checkin", {"employee": self.employee})
		frappe.db.delete("Workday", {"employee": self.employee})
		frappe.db.delete("Salary Slip", {"employee": self.employee})

	# --- fixtures, written without hooks ---

	def _punch(self, time: datetime.datetime, log_type: str, workday: str | None = None) -> str:
		checkin = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
		checkin.employee = self.employee
		checkin.employee_name = self.employee_name
		checkin.time = time
		checkin.log_type = cast(Any, log_type)
		checkin.workday = workday
		checkin.db_insert()
		return cast(str, checkin.name)

	def _old_workday(self, date: datetime.date, *times: datetime.datetime) -> str:
		"""A Workday as the calendar-date sync built it: the date's punches paired by position."""
		workday = cast(Workday, frappe.new_doc("Workday"))
		workday.name = f"{self.employee_name}-{date}-{random_string(5)}"
		workday.employee = self.employee
		workday.employee_name = self.employee_name
		workday.date = date
		workday.day_of_week = date.strftime("%A")
		total = 0.0
		for i, time in enumerate(times):
			kind = "in" if i % 2 == 0 else "out"
			workday.set(f"check_{kind}_{i // 2 + 1}", time.strftime("%-I:%M %p"))
			workday.set(f"check_{kind}_{i // 2 + 1}_dt", time)
			if kind == "out":
				total += (time - times[i - 1]).total_seconds() / 3600
		workday.total_hours = total
		workday.db_insert()
		return workday.name

	def _stale_night_shift(self) -> tuple[str, str]:
		"""A 10 PM to 6 AM shift split over two old Workdays. Returns (first day's, next day's)."""
		first = self._old_workday(DAY, _at(DAY, 22))
		second = self._old_workday(NEXT_DAY, _at(NEXT_DAY, 6))
		self._punch(_at(DAY, 22), "IN", first)
		self._punch(_at(NEXT_DAY, 6), "OUT", second)
		return first, second

	def _repaired_by_log_type(self, date: datetime.date) -> str:
		"""A day of IN, IN, OUT that the old sync paired by position; the rebuild pairs it alone."""
		times = (_at(date, 8), _at(date, 12), _at(date, 17))
		name = self._old_workday(date, *times)
		for time, log_type in zip(times, ("IN", "IN", "OUT"), strict=True):
			self._punch(time, log_type, name)
		return name

	def _shown(self) -> Counter[datetime.datetime]:
		"""How many of the employee's Workdays show each punch time."""
		fields = list(rebuild.TIME_FIELDS)
		return Counter(
			row[f]
			for row in frappe.get_all("Workday", {"employee": self.employee}, fields)
			for f in fields
			if row[f]
		)

	def _salary_slip(self, start: datetime.date, end: datetime.date, docstatus: int = 1) -> None:
		slip = frappe.new_doc("Salary Slip")
		slip.update(
			{
				"name": f"_Test Timeclock Slip {random_string(8)}",
				"employee": self.employee,
				"employee_name": self.employee_name,
				"company": _ensure_company(),
				"posting_date": end,
				"start_date": start,
				"end_date": end,
				"docstatus": docstatus,
			}
		)
		slip.db_insert()

	def _state(self) -> dict[str, tuple[Any, ...]]:
		"""Each Workday's first slot, hours and modified time, and each punch's Workday and log type."""
		state: dict[str, tuple[Any, ...]] = {}
		for row in frappe.get_all(
			"Workday",
			{"employee": self.employee},
			["name", "check_in_1_dt", "check_out_1_dt", "check_in_2_dt", "total_hours", "modified"],
		):
			state[row.name] = (
				row.check_in_1_dt,
				row.check_out_1_dt,
				row.check_in_2_dt,
				row.total_hours,
				row.modified,
			)
		for row in frappe.get_all(
			"Employee Checkin", {"employee": self.employee}, ["name", "workday", "log_type"]
		):
			state[row.name] = (row.workday, row.log_type)
		return state

	def _comments(self, workday: str) -> list[str]:
		return frappe.get_all(
			"Comment",
			{"reference_doctype": "Workday", "reference_name": workday, "comment_type": "Info"},
			pluck="content",
		)

	def _run(self, **kwargs: Any) -> rebuild.Summary:
		return rebuild.rebuild_stale_workdays(employee=self.employee, **kwargs)

	# --- tests ---

	def test_a_stale_night_shift_moves_onto_the_day_it_started(self) -> None:
		first, second = self._stale_night_shift()

		summary = self._run()

		self.assertEqual((summary.checked, summary.rebuilt, summary.unchanged), (2, 2, 0))
		day = frappe.db.get_value(
			"Workday", first, ["check_in_1", "check_out_1", "check_out_1_dt", "total_hours"], as_dict=True
		)
		self.assertEqual(
			(day.check_in_1, day.check_out_1, day.check_out_1_dt, day.total_hours),
			("10:00 PM", "6:00 AM", _at(NEXT_DAY, 6), 8.0),
		)
		next_day = frappe.db.get_value(
			"Workday", second, ["check_in_1", "check_in_1_dt", "total_hours"], as_dict=True
		)
		self.assertEqual((next_day.check_in_1, next_day.check_in_1_dt, next_day.total_hours), (None, None, 0))
		self.assertEqual(
			set(frappe.get_all("Employee Checkin", {"employee": self.employee}, pluck="workday")), {first}
		)
		self.assertEqual((summary.hours_before, summary.hours_after), (0.0, 8.0))
		self.assertEqual(
			self._comments(first),
			[
				"Rebuilt from its punches after night shifts began pairing across midnight: 0.0 hours before, 8.0 after."
			],
		)
		self.assertEqual(len(self._comments(second)), 1)

	def test_a_day_paired_by_position_is_repaired_by_log_type(self) -> None:
		"""Two INs and an OUT: the old sync paired the two INs; the second IN pairs with the OUT."""
		times = (_at(DAY, 8), _at(DAY, 12), _at(DAY, 17))
		name = self._old_workday(DAY, *times)
		for time, log_type in zip(times, ("IN", "IN", "OUT"), strict=True):
			self._punch(time, log_type, name)

		self._run()

		row = frappe.db.get_value(
			"Workday", name, ["check_in_1_dt", "check_out_1_dt", "check_in_2_dt", "total_hours"], as_dict=True
		)
		self.assertEqual(
			(row.check_in_1_dt, row.check_out_1_dt, row.check_in_2_dt, row.total_hours),
			(_at(DAY, 8), None, _at(DAY, 12), 5.0),
		)

	def test_a_punch_with_no_log_type_gets_the_one_it_paired_as(self) -> None:
		name = self._old_workday(DAY, _at(DAY, 8), _at(DAY, 16))
		self._punch(_at(DAY, 8), "", name)
		self._punch(_at(DAY, 16), "", name)

		summary = self._run()

		self.assertEqual(summary.rebuilt, 1)
		self.assertEqual(
			frappe.get_all(
				"Employee Checkin", {"employee": self.employee}, pluck="log_type", order_by="time asc"
			),
			["IN", "OUT"],
		)

	def test_running_it_again_changes_nothing(self) -> None:
		first, second = self._stale_night_shift()
		self._run()
		state = self._state()

		summary = self._run()

		self.assertEqual((summary.checked, summary.rebuilt, summary.unchanged), (2, 0, 2))
		self.assertEqual(self._state(), state)
		self.assertEqual((len(self._comments(first)), len(self._comments(second))), (1, 1))

	def test_an_up_to_date_workday_is_not_written(self) -> None:
		name = self._old_workday(DAY, _at(DAY, 8), _at(DAY, 16))
		self._punch(_at(DAY, 8), "IN", name)
		self._punch(_at(DAY, 16), "OUT", name)
		state = self._state()

		summary = self._run()

		self.assertEqual((summary.rebuilt, summary.unchanged), (0, 1))
		self.assertEqual(self._state(), state)
		self.assertEqual(self._comments(name), [])

	def test_workdays_in_a_salary_slip_period_are_left_alone(self) -> None:
		for docstatus in (1, 0):
			with self.subTest(docstatus=docstatus):
				self.tearDown()
				self._stale_night_shift()
				self._salary_slip(DAY, NEXT_DAY, docstatus=docstatus)
				state = self._state()

				summary = self._run()

				self.assertEqual(self._state(), state)
				self.assertEqual((summary.rebuilt, summary.locked, summary.locked_stale), (0, 2, 2))
				self.assertEqual(len(summary.left_alone), 2)

	def test_a_cancelled_salary_slip_does_not_lock_its_period(self) -> None:
		self._stale_night_shift()
		self._salary_slip(DAY, NEXT_DAY, docstatus=2)

		summary = self._run()

		self.assertEqual((summary.rebuilt, summary.locked), (2, 0))

	def test_a_stale_workday_next_to_a_salary_slip_period_is_left_alone(self) -> None:
		"""Rebuilding the next day would take the OUT off it for a shift whose day is already paid."""
		_first, second = self._stale_night_shift()
		self._salary_slip(DAY - datetime.timedelta(days=13), DAY)
		state = self._state()

		summary = self._run()

		self.assertEqual(self._state(), state)
		self.assertEqual((summary.locked, summary.held_back, summary.rebuilt), (1, 1, 0))
		self.assertIn(second, summary.left_alone)

	def test_an_up_to_date_workday_next_to_a_salary_slip_period_counts_as_unchanged(self) -> None:
		name = self._old_workday(NEXT_DAY, _at(NEXT_DAY, 8), _at(NEXT_DAY, 16))
		self._punch(_at(NEXT_DAY, 8), "IN", name)
		self._punch(_at(NEXT_DAY, 16), "OUT", name)
		self._salary_slip(DAY - datetime.timedelta(days=13), DAY)

		summary = self._run()

		self.assertEqual((summary.unchanged, summary.held_back), (1, 0))

	def test_the_site_config_date_limits_the_rebuild(self) -> None:
		later = NEXT_DAY + datetime.timedelta(days=3)
		first, _second = self._stale_night_shift()
		repaired = self._repaired_by_log_type(later)

		with patch.dict(frappe.conf, {rebuild.REBUILD_FROM_KEY: str(NEXT_DAY)}):
			summary = self._run()

		self.assertEqual(summary.before_floor, 1)
		self.assertEqual((summary.checked, summary.rebuilt, summary.held_back), (2, 1, 1))
		self.assertEqual(self._comments(first), [])
		self.assertEqual(len(self._comments(repaired)), 1)

	def test_the_day_after_the_site_config_date_keeps_a_night_shift_out_from_before_it(self) -> None:
		"""Rebuilding the next day alone would take its OUT off it, and the day before is not rebuilt."""
		_first, second = self._stale_night_shift()
		state = self._state()

		with patch.dict(frappe.conf, {rebuild.REBUILD_FROM_KEY: str(NEXT_DAY)}):
			summary = self._run()

		self.assertEqual(self._state(), state)
		self.assertEqual((summary.rebuilt, summary.held_back), (0, 1))
		self.assertIn(second, summary.left_alone)

	def test_duplicate_workdays_rebuild_only_the_oldest(self) -> None:
		first, _second = self._stale_night_shift()
		duplicate = self._old_workday(DAY, _at(DAY, 22))
		frappe.db.set_value(
			"Workday",
			duplicate,
			"creation",
			frappe.db.get_value("Workday", first, "creation") + datetime.timedelta(seconds=1),
			update_modified=False,
		)

		summary = self._run(batch_size=1)

		self.assertEqual((summary.checked, summary.rebuilt), (2, 2))
		self.assertEqual(frappe.db.get_value("Workday", first, "total_hours"), 8.0)
		self.assertEqual(frappe.db.get_value("Workday", duplicate, "total_hours"), 0.0)
		self.assertEqual(self._comments(duplicate), [])

	def test_small_batches_cover_every_workday(self) -> None:
		self._stale_night_shift()

		summary = self._run(batch_size=1)

		self.assertEqual((summary.checked, summary.rebuilt), (2, 2))

	def test_a_failed_rebuild_rolls_back_its_night_shift_partner_and_the_rest_go_on(self) -> None:
		"""The next day must not lose its OUT when the day the shift started could not take it."""
		first, second = self._stale_night_shift()
		repaired = self._repaired_by_log_type(NEXT_DAY + datetime.timedelta(days=3))
		state = {name: value for name, value in self._state().items() if name != repaired}
		real_sync = rebuild.shifts.sync_workday

		def sync(employee: str, date: datetime.date, **kwargs: Any) -> Workday | None:
			if date == NEXT_DAY:
				raise frappe.ValidationError("boom")
			return real_sync(employee, date, **kwargs)

		with patch.object(rebuild.shifts, "sync_workday", side_effect=sync):
			summary = self._run()

		self.assertEqual((summary.failed, summary.rebuilt), (2, 1))
		self.assertEqual({name: value for name, value in self._state().items() if name in state}, state)
		self.assertEqual((self._comments(first), self._comments(second)), ([], []))
		self.assertEqual(len(self._comments(repaired)), 1)
		self.assertEqual(set(summary.left_alone), {first, second})

	def test_a_stale_workday_next_to_one_held_back_is_held_back_too(self) -> None:
		"""Two nights in a row, the second ending in a paid period: the first night's days can't be
		rebuilt alone, or the 6 AM OUT between the two nights would show on two Workdays."""
		third_day = NEXT_DAY + datetime.timedelta(days=1)
		first = self._old_workday(DAY, _at(DAY, 22))
		second = self._old_workday(NEXT_DAY, _at(NEXT_DAY, 6), _at(NEXT_DAY, 22))
		third = self._old_workday(third_day, _at(third_day, 6))
		self._punch(_at(DAY, 22), "IN", first)
		self._punch(_at(NEXT_DAY, 6), "OUT", second)
		self._punch(_at(NEXT_DAY, 22), "IN", second)
		self._punch(_at(third_day, 6), "OUT", third)
		self._salary_slip(third_day, third_day + datetime.timedelta(days=13))
		state = self._state()

		summary = self._run()

		self.assertEqual(self._state(), state)
		self.assertEqual((summary.rebuilt, summary.locked_stale, summary.held_back), (0, 1, 2))
		self.assertEqual(set(summary.left_alone), {first, second, third})

	def test_a_workday_showing_a_time_no_punch_backs_is_left_alone(self) -> None:
		"""Hours typed into a Workday with no Employee Checkin behind them are not wiped."""
		name = self._old_workday(DAY, _at(DAY, 8), _at(DAY, 12), _at(DAY, 13), _at(DAY, 17))
		self._punch(_at(DAY, 8), "IN", name)
		self._punch(_at(DAY, 17), "OUT", name)
		state = self._state()

		summary = self._run()

		self.assertEqual(self._state(), state)
		self.assertEqual((summary.rebuilt, summary.unbacked), (0, 1))
		self.assertEqual(summary.left_alone, [name])

	def test_a_night_shift_whose_first_day_has_no_workday_is_left_alone(self) -> None:
		"""Rebuilding the next day would drop the OUT, and there is no Workday to move it onto."""
		second = self._old_workday(NEXT_DAY, _at(NEXT_DAY, 6))
		self._punch(_at(DAY, 22), "IN")
		self._punch(_at(NEXT_DAY, 6), "OUT", second)
		state = self._state()

		summary = self._run()

		self.assertEqual(self._state(), state)
		self.assertEqual((summary.rebuilt, summary.held_back), (0, 1))

	def test_rebuilding_never_counts_a_punch_twice_or_drops_one(self) -> None:
		"""Over a mix of rebuilt and held-back days, each punch shows on at most one Workday, and
		every punch a Workday showed before still shows on one."""
		days = [DAY + datetime.timedelta(days=n) for n in range(6)]
		names = {
			day: self._old_workday(day, *((_at(day, 6),) if n else ()), _at(day, 22))
			for n, day in enumerate(days)
		}
		for n, day in enumerate(days):
			if n:
				self._punch(_at(day, 6), "OUT", names[day])
			self._punch(_at(day, 22), "IN", names[day])
		self._salary_slip(days[3], days[3])
		self._repaired_by_log_type(days[-1] + datetime.timedelta(days=3))
		before = self._shown()

		summary = self._run()

		after = self._shown()
		self.assertLessEqual(max(after.values()), 1)
		self.assertLessEqual(set(before), set(after))
		self.assertEqual((summary.rebuilt, summary.held_back, summary.locked_stale), (1, 5, 1))

	def test_execute_logs_the_summary(self) -> None:
		first, _second = self._stale_night_shift()

		with patch("builtins.print") as printed:
			rebuild.execute()

		self.assertRegex(printed.call_args.args[0], r"^Rebuilt \d+ of \d+ Workdays")
		self.assertEqual(len(self._comments(first)), 1)

	def test_the_summary_names_the_workdays_left_alone(self) -> None:
		summary = rebuild.Summary(locked=60, locked_stale=60, left_alone=[f"WD-{i}" for i in range(60)])

		message = summary.message()

		self.assertIn("WD-49", message)
		self.assertNotIn("WD-50", message)
		self.assertIn("and 10 more", message)

	def test_the_patch_runs_after_the_model_sync(self) -> None:
		with open(frappe.get_app_path("employee_timeclock", "patches.txt")) as patches:
			text = patches.read()
		post = text.split("[post_model_sync]", 1)[1]
		self.assertIn("employee_timeclock.patches.rebuild_workdays_for_night_shifts", post)
