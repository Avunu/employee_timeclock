# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""
Tests for the Job Card extension (``TimeclockJobCard``, registered through ``extend_doctype_class``).

Each test works on a Job Card of its own, built on the job timeclock's manufacturing fixtures
(Item, BOM, submitted Work Order), and deletes it afterwards.
"""

import datetime
from typing import cast

import frappe
from erpnext.manufacturing.doctype.job_card.job_card import JobCard
from frappe.utils import get_datetime

from timeclock.timeclock.custom.job_card import TimeclockJobCard
from timeclock.www.job_timeclock.test_job_timeclock import JobTimeclockTestCase

DAY = "2021-03-01"


def _at(time: str) -> datetime.datetime:
	return cast(datetime.datetime, get_datetime(f"{DAY} {time}"))


class TestTimeclockJobCard(JobTimeclockTestCase):
	card: TimeclockJobCard

	def setUp(self) -> None:
		super().setUp()
		# a flag the job timeclock sets for its own saves; desk saves run without it
		frappe.flags.in_timeclock = False
		assert self._test_work_order is not None
		assert self._test_operation is not None
		assert self._test_workstation is not None
		assert self._test_bom is not None
		self.card = cast(
			TimeclockJobCard,
			frappe.get_doc(
				{
					"doctype": "Job Card",
					"company": self._test_work_order.company,
					"work_order": self._test_work_order.name,
					"operation": self._test_operation.name,
					"workstation": self._test_workstation.name,
					"for_quantity": 1,
					"wip_warehouse": self._test_work_order.wip_warehouse,
					"bom_no": self._test_bom.name,
					"sequence_id": 1,
				}
			).insert(ignore_permissions=True),
		)

	def tearDown(self) -> None:
		frappe.flags.in_timeclock = False
		frappe.set_user("Administrator")
		self.card.reload()
		if self.card.docstatus == 1:
			self.card.cancel()
		frappe.delete_doc("Job Card", self.card.name, ignore_permissions=True, force=True)
		super().tearDown()

	def _log(self, from_time: str, to_time: str | None = None, **values: object) -> None:
		assert self._test_employee is not None
		self.card.append(
			"time_logs",
			{
				"employee": self._test_employee.name,
				"from_time": _at(from_time),
				"to_time": _at(to_time) if to_time else None,
				**values,
			},
		)

	def test_get_doc_returns_the_extended_controller(self) -> None:
		card = frappe.get_doc("Job Card", cast(str, self.card.name))

		self.assertIsInstance(card, TimeclockJobCard)
		self.assertIsInstance(card, JobCard)

	# Machine time (employee -> machine_operator) is covered by the job timeclock's
	# test_machine_time_log_employee_moved_to_machine_operator: is_machine_time is fetched from the Operation.

	def test_labor_time_keeps_the_employee(self) -> None:
		"""before_validate only moves the employee to machine_operator on machine-time cards."""
		self._log("08:00", "09:00")

		self.card.save(ignore_permissions=True)

		log = self.card.time_logs[0]
		self.assertEqual(log.employee, self._test_employee.name if self._test_employee else None)
		self.assertFalse(log.machine_operator)

	def test_overlap_check_is_skipped_for_logs_without_an_employee(self) -> None:
		self.assertEqual(self.card.get_overlap_for(frappe._dict(employee="")), [])

	def test_overlap_check_is_skipped_for_timeclock_saves(self) -> None:
		frappe.flags.in_timeclock = True

		self.assertEqual(
			self.card.get_overlap_for(
				frappe._dict(employee="any", from_time=_at("08:00"), to_time=_at("09:00"))
			),
			[],
		)

	def test_overlap_check_runs_for_desk_edits(self) -> None:
		"""A desk save with an employee runs upstream's check, which finds the overlapping log."""
		self._log("08:00", "09:00")
		self.card.save(ignore_permissions=True)
		assert self._test_employee is not None

		overlap = self.card.get_overlap_for(
			frappe._dict(
				name="new-log",
				employee=self._test_employee.name,
				from_time=_at("08:30"),
				to_time=_at("09:30"),
			)
		)

		self.assertTrue(overlap)

	def test_sequence_is_not_enforced_before_any_qty_is_completed(self) -> None:
		self.card.validate_sequence_id()

	def test_complete_clamps_the_end_time_to_the_open_log_start(self) -> None:
		"""The End Time field drops seconds, so an end in the same minute would precede the start."""
		self._log("10:30:45")
		self.card.save(ignore_permissions=True)

		self.card.complete_job_card(end_time=str(_at("10:30")), qty=1)

		self.card.reload()
		log = self.card.time_logs[0]
		self.assertEqual(get_datetime(log.to_time), _at("10:30:45"))
		self.assertEqual(log.completed_qty, 1)

	def test_complete_without_an_open_log_records_qty_on_the_last_log(self) -> None:
		"""Clocking out stops timers without pausing, so the qty goes on the last (closed) log."""
		self._log("08:00", "09:00")
		self.card.save(ignore_permissions=True)

		self.card.complete_job_card(end_time=str(_at("09:05")), qty=1)

		self.card.reload()
		self.assertEqual(self.card.time_logs[-1].completed_qty, 1)

	def test_submitting_a_paused_card_with_closed_logs_unpauses_it(self) -> None:
		self._log("08:00", "09:00", completed_qty=1)
		self.card.is_paused = 1
		self.card.save(ignore_permissions=True)

		self.card.submit()

		self.assertEqual(self.card.docstatus, 1)
		self.assertFalse(self.card.is_paused)
