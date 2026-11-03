# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""
Tests for the shift pairing rule (``employee_timeclock.timeclock.shifts``) and the places it feeds:
the Workday sync, the Workday form, the kiosks' next direction and Timeclock Settings.

The rule: an IN pairs with the next OUT for the same employee, by log type and time, when the OUT
comes within the maximum shift length; the shift's hours belong to the IN's date; anything left
unpaired is a missed punch.

Regressions:

* a night shift's OUT after midnight landed on the next day's Workday, so neither day counted the
  shift and both showed a missing punch;
* the kiosks picked IN or OUT from today's punches, so a night worker's scan after midnight was
  recorded as an IN.
"""

import datetime
from typing import Any, cast

import frappe
from frappe.tests import IntegrationTestCase
from frappe.utils import now_datetime

from employee_timeclock.timeclock import api, shifts
from employee_timeclock.timeclock.custom.employee_checkin import EmployeeCheckin
from employee_timeclock.timeclock.doctype.workday.workday import Workday
from employee_timeclock.timeclock.test_api import _make_employee

DAY = datetime.date(2021, 3, 1)
NEXT_DAY = datetime.date(2021, 3, 2)
MAX_SHIFT = datetime.timedelta(hours=16)


def _at(day: datetime.date, hour: int, minute: int = 0) -> datetime.datetime:
	return datetime.datetime.combine(day, datetime.time(hour, minute))


def _punch(time: datetime.datetime, log_type: str, name: str = "") -> frappe._dict:
	return frappe._dict(name=name or f"{log_type}@{time}", time=time, log_type=log_type)


class TestPairPunches(IntegrationTestCase):
	"""The pairing rule itself, on punches that never touch the database."""

	def _pairs(self, *punches: frappe._dict) -> list[tuple[Any, Any, float, datetime.date]]:
		return [
			(
				shift.check_in.time if shift.check_in else None,
				shift.check_out.time if shift.check_out else None,
				shift.hours,
				shift.date,
			)
			for shift in shifts.pair_punches(punches, MAX_SHIFT)
		]

	def test_a_night_shift_belongs_to_the_date_of_its_in(self) -> None:
		self.assertEqual(
			self._pairs(_punch(_at(DAY, 22), "IN"), _punch(_at(NEXT_DAY, 6), "OUT")),
			[(_at(DAY, 22), _at(NEXT_DAY, 6), 8.0, DAY)],
		)

	def test_a_missed_out_does_not_shift_the_later_pairs(self) -> None:
		"""Pairing by position would pair Monday's IN with Tuesday's IN and every pair after it."""
		self.assertEqual(
			self._pairs(
				_punch(_at(DAY, 8), "IN"),
				_punch(_at(NEXT_DAY, 8), "IN"),
				_punch(_at(NEXT_DAY, 16), "OUT"),
			),
			[(_at(DAY, 8), None, 0.0, DAY), (_at(NEXT_DAY, 8), _at(NEXT_DAY, 16), 8.0, NEXT_DAY)],
		)

	def test_a_second_in_leaves_the_first_one_missed(self) -> None:
		"""The OUT pairs with the latest IN: only time between a verified IN and OUT is counted."""
		self.assertEqual(
			self._pairs(_punch(_at(DAY, 8), "IN"), _punch(_at(DAY, 12), "IN"), _punch(_at(DAY, 17), "OUT")),
			[(_at(DAY, 8), None, 0.0, DAY), (_at(DAY, 12), _at(DAY, 17), 5.0, DAY)],
		)

	def test_an_out_with_no_open_in_is_missed_on_its_own_date(self) -> None:
		self.assertEqual(
			self._pairs(_punch(_at(DAY, 8), "OUT"), _punch(_at(DAY, 9), "OUT")),
			[(None, _at(DAY, 8), 0.0, DAY), (None, _at(DAY, 9), 0.0, DAY)],
		)

	def test_an_out_past_the_maximum_shift_length_does_not_pair(self) -> None:
		self.assertEqual(
			self._pairs(_punch(_at(DAY, 6), "IN"), _punch(_at(NEXT_DAY, 6), "OUT")),
			[(_at(DAY, 6), None, 0.0, DAY), (None, _at(NEXT_DAY, 6), 0.0, NEXT_DAY)],
		)

	def test_the_maximum_shift_length_itself_still_pairs(self) -> None:
		self.assertEqual(
			self._pairs(_punch(_at(DAY, 8), "IN"), _punch(_at(NEXT_DAY, 0), "OUT")),
			[(_at(DAY, 8), _at(NEXT_DAY, 0), 16.0, DAY)],
		)

	def test_a_punch_with_no_log_type_is_read_from_where_it_falls(self) -> None:
		punches = [_punch(_at(DAY, 8), ""), _punch(_at(DAY, 12), ""), _punch(_at(DAY, 13), "")]

		paired = shifts.pair_punches(punches, MAX_SHIFT)

		self.assertEqual([p.inferred_log_type for p in punches], ["IN", "OUT", "IN"])
		self.assertEqual([shift.hours for shift in paired], [4.0, 0.0])
		self.assertEqual([shift.missed for shift in paired], [False, True])


class TestShiftsOnTheSite(IntegrationTestCase):
	"""The rule applied to Employee Checkins: Workdays, the kiosks and the setting."""

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
		frappe.set_user("Administrator")
		frappe.db.delete("Employee Checkin", {"employee": self.employee})
		frappe.db.delete("Workday", {"employee": self.employee})
		frappe.db.set_single_value("Timeclock Settings", "max_shift_hours", None)

	def _write(self, time: datetime.datetime, log_type: str) -> str:
		"""A punch written without its hooks, as a device sync would leave it."""
		checkin = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
		checkin.employee = self.employee
		checkin.employee_name = self.employee_name
		checkin.time = time
		checkin.log_type = cast(Any, log_type)
		checkin.db_insert()
		return cast(str, checkin.name)

	def _insert(self, time: datetime.datetime, log_type: str) -> str:
		"""A punch saved with its hooks, as a kiosk saves it."""
		checkin = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
		checkin.employee = self.employee
		checkin.time = time
		checkin.log_type = cast(Any, log_type)
		checkin.insert(ignore_permissions=True)
		return cast(str, checkin.name)

	def _age_workdays(self) -> None:
		"""Move the Workdays out of the one-minute window that skips resyncs."""
		frappe.db.set_value(
			"Workday",
			{"employee": self.employee},
			"last_modified",
			now_datetime() - datetime.timedelta(minutes=5),
			update_modified=False,
		)

	def _workdays(self) -> dict[datetime.date, frappe._dict]:
		rows = frappe.get_all(
			"Workday",
			filters={"employee": self.employee},
			fields=[
				"name",
				"date",
				"total_hours",
				"check_in_1",
				"check_in_1_dt",
				"check_out_1",
				"check_out_1_dt",
			],
		)
		return {row.date: row for row in rows}

	# --- the setting ---

	def test_the_maximum_shift_length_defaults_to_16_hours(self) -> None:
		self.assertEqual(shifts.get_max_shift_hours(), 16.0)

	def test_the_maximum_shift_length_is_configurable(self) -> None:
		self._write(_at(DAY, 20), "IN")
		self._write(_at(NEXT_DAY, 8), "OUT")
		self.assertEqual(
			[s.hours for s in shifts.get_shifts(DAY, NEXT_DAY, self.employee)[self.employee]], [12.0]
		)

		settings = frappe.get_single("Timeclock Settings")
		settings.max_shift_hours = 10
		settings.save()

		self.assertEqual(shifts.get_max_shift_hours(), 10.0)
		paired = shifts.get_shifts(DAY, NEXT_DAY, self.employee)[self.employee]
		self.assertEqual([(s.date, s.missed) for s in paired], [(DAY, True), (NEXT_DAY, True)])

	def test_the_maximum_shift_length_must_be_sensible(self) -> None:
		settings = frappe.get_single("Timeclock Settings")
		for hours in (0, -1, 49):
			settings.max_shift_hours = hours
			with self.subTest(hours=hours), self.assertRaises(frappe.ValidationError):
				settings.save()

	def test_only_hr_and_system_managers_change_the_setting(self) -> None:
		meta = frappe.get_meta("Timeclock Settings")
		writers = {perm.role for perm in meta.permissions if perm.write}
		self.assertEqual(writers, {"System Manager", "HR Manager"})

	# --- reading a range ---

	def test_get_shifts_reads_past_the_range_for_a_night_shifts_out(self) -> None:
		"""The range's last night shift keeps its OUT, and the night before the range is left out."""
		self._write(_at(DAY, 22), "IN")
		self._write(_at(NEXT_DAY, 6), "OUT")
		self._write(_at(NEXT_DAY, 22), "IN")
		self._write(_at(NEXT_DAY + datetime.timedelta(1), 6), "OUT")

		paired = shifts.get_shifts(NEXT_DAY, NEXT_DAY, self.employee)[self.employee]

		self.assertEqual([(s.date, s.hours, s.missed) for s in paired], [(NEXT_DAY, 8.0, False)])

	# --- Workdays ---

	def test_a_night_shift_lands_on_one_workday(self) -> None:
		self._insert(_at(DAY, 22), "IN")
		self._age_workdays()
		self._insert(_at(NEXT_DAY, 6), "OUT")

		workdays = self._workdays()
		self.assertEqual(list(workdays), [DAY])
		workday = workdays[DAY]
		self.assertEqual((workday.check_in_1, workday.check_out_1), ("10:00 PM", "6:00 AM"))
		self.assertEqual(workday.check_out_1_dt, _at(NEXT_DAY, 6))
		self.assertEqual(workday.total_hours, 8.0)
		self.assertEqual(
			set(frappe.get_all("Employee Checkin", {"employee": self.employee}, pluck="workday")),
			{workday.name},
		)

	def test_deleting_a_night_shifts_out_clears_it_from_the_first_day(self) -> None:
		self._insert(_at(DAY, 22), "IN")
		self._age_workdays()
		out = self._insert(_at(NEXT_DAY, 6), "OUT")
		self._age_workdays()

		frappe.delete_doc("Employee Checkin", out, ignore_permissions=True)

		workday = self._workdays()[DAY]
		self.assertEqual(
			(workday.check_in_1, workday.check_out_1, workday.total_hours), ("10:00 PM", None, 0)
		)

	def test_adding_a_night_shifts_in_moves_its_out_off_the_next_day(self) -> None:
		"""An IN added late (the OUT was punched first) pairs with that OUT, so the next day's
		Workday, which held the OUT as a missed punch, is rebuilt without it."""
		self._insert(_at(NEXT_DAY, 6), "OUT")
		self.assertEqual(self._workdays()[NEXT_DAY].check_out_1, "6:00 AM")
		self._age_workdays()

		self._insert(_at(DAY, 22), "IN")

		workdays = self._workdays()
		self.assertEqual(
			(workdays[DAY].check_in_1, workdays[DAY].check_out_1, workdays[DAY].total_hours),
			("10:00 PM", "6:00 AM", 8.0),
		)
		self.assertEqual((workdays[NEXT_DAY].check_out_1, workdays[NEXT_DAY].total_hours), (None, 0))

	def test_deleting_a_night_shifts_in_leaves_its_out_missed_on_the_next_day(self) -> None:
		"""Deleting the IN un-pairs its OUT, which then belongs to its own date as a missed punch."""
		check_in = self._insert(_at(DAY, 22), "IN")
		self._age_workdays()
		self._insert(_at(NEXT_DAY, 6), "OUT")
		self._age_workdays()

		frappe.delete_doc("Employee Checkin", check_in, ignore_permissions=True)

		workdays = self._workdays()
		self.assertEqual((workdays[DAY].check_out_1, workdays[DAY].total_hours), (None, 0))
		self.assertEqual(workdays[NEXT_DAY].check_out_1, "6:00 AM")

	def test_sync_workday_rebuilds_an_old_calendar_day_split(self) -> None:
		"""A night shift once split over two Workdays is moved onto the first by a rebuild."""
		self._write(_at(DAY, 22), "IN")
		self._write(_at(NEXT_DAY, 6), "OUT")
		frappe.get_doc(
			{"doctype": "Workday", "employee": self.employee, "date": NEXT_DAY, "check_in_1": "6:00 AM"}
		).db_insert()

		shifts.sync_workday(self.employee, DAY)
		shifts.sync_workday(self.employee, NEXT_DAY)

		workdays = self._workdays()
		self.assertEqual(workdays[DAY].total_hours, 8.0)
		self.assertEqual((workdays[NEXT_DAY].check_in_1, workdays[NEXT_DAY].total_hours), (None, 0))

	def test_sync_workday_stores_the_log_type_a_blank_punch_was_paired_as(self) -> None:
		self._write(_at(DAY, 8), "")
		self._write(_at(DAY, 12), "")

		shifts.sync_workday(self.employee, DAY)

		self.assertEqual(
			frappe.get_all(
				"Employee Checkin", {"employee": self.employee}, pluck="log_type", order_by="time"
			),
			["IN", "OUT"],
		)
		self.assertIsNone(shifts.sync_workday(self.employee, NEXT_DAY, create=False))

	def _new_workday(self, **slots: str) -> Workday:
		workday = cast(Workday, frappe.new_doc("Workday"))
		workday.employee = self.employee
		workday.employee_name = self.employee_name
		workday.date = DAY
		workday.update(slots)
		workday.insert(ignore_permissions=True)
		return workday

	def test_a_workday_entered_as_a_night_shift_counts_its_hours(self) -> None:
		workday = self._new_workday(check_in_1="10:00 PM", check_out_1="6:00 AM")

		self.assertEqual(workday.total_hours, 8.0)
		self.assertEqual(workday.check_out_1_dt, _at(NEXT_DAY, 6))
		self.assertEqual(
			frappe.get_all("Employee Checkin", {"employee": self.employee}, pluck="time", order_by="time"),
			[_at(DAY, 22), _at(NEXT_DAY, 6)],
		)

	def test_editing_a_night_shifts_out_on_the_workday_moves_the_next_mornings_punch(self) -> None:
		workday = self._new_workday(check_in_1="10:00 PM", check_out_1="6:00 AM")

		workday.check_out_1 = "7:00 AM"
		workday.save(ignore_permissions=True)

		self.assertEqual(
			frappe.get_all("Employee Checkin", {"employee": self.employee}, pluck="time", order_by="time"),
			[_at(DAY, 22), _at(NEXT_DAY, 7)],
		)
		self.assertEqual(workday.total_hours, 9.0)

	def test_a_workday_shift_longer_than_the_maximum_is_refused(self) -> None:
		with self.assertRaisesRegex(frappe.ValidationError, "longer than the maximum shift of 16 hours"):
			self._new_workday(check_in_1="8:00 AM", check_out_1="7:00 AM")

	# --- the kiosks' next direction ---

	def test_a_night_shifts_scan_after_midnight_is_its_out(self) -> None:
		self._write(_at(DAY, 22), "IN")

		self.assertEqual(shifts.next_log_type(self.employee, _at(NEXT_DAY, 6)), "OUT")
		self.assertEqual(api.determine_next_log_type(self.employee, _at(NEXT_DAY, 6)), "OUT")
		self.assertEqual(shifts.last_log_type(self.employee, _at(NEXT_DAY, 6)), "IN")

	def test_an_in_older_than_the_maximum_shift_length_is_forgotten(self) -> None:
		self._write(_at(DAY, 6), "IN")

		self.assertEqual(shifts.next_log_type(self.employee, _at(NEXT_DAY, 6)), "IN")
		self.assertIsNone(shifts.last_log_type(self.employee, _at(NEXT_DAY, 6)))

	def test_after_an_out_the_next_scan_is_an_in(self) -> None:
		self._write(_at(DAY, 22), "IN")
		self._write(_at(NEXT_DAY, 6), "OUT")

		self.assertEqual(shifts.next_log_type(self.employee, _at(NEXT_DAY, 7)), "IN")
		self.assertEqual(shifts.last_log_type(self.employee, _at(NEXT_DAY, 7)), "OUT")

	def test_punches_after_the_scan_time_are_not_counted(self) -> None:
		self._write(_at(DAY, 8), "IN")
		self._write(_at(DAY, 12), "OUT")

		self.assertEqual(shifts.next_log_type(self.employee, _at(DAY, 10)), "OUT")

	def test_get_shift_of_finds_a_night_shifts_out(self) -> None:
		self._write(_at(DAY, 22), "IN")
		out = self._write(_at(NEXT_DAY, 6), "OUT")

		shift = shifts.get_shift_of(out, self.employee, _at(NEXT_DAY, 6))

		self.assertIsNotNone(shift)
		self.assertEqual(cast(shifts.Shift, shift).date, DAY)
		self.assertIsNone(shifts.get_shift_of("not-a-checkin", self.employee, _at(NEXT_DAY, 6)))
