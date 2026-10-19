# Copyright (c) 2024, and Contributors
# See license.txt

"""
Comprehensive tests for the Job Timeclock page functions.

This module contains integration tests for all job timeclock functionality including:
- Employee authentication via RFID
- Employee check-in/check-out logging
- Work order and job card retrieval
- Job card time logging (start/end times)
- Job card submission and completion
- Token-based authentication and refresh

Tests use fixtures for Employee, Attendance Device ID, Work Order, Job Card,
and related manufacturing documents (Item, BOM, Workstation, Operation).
"""

import contextlib
import datetime
from typing import Any, ClassVar, cast

import frappe
import jwt
from erpnext.manufacturing.doctype.bom.bom import BOM
from erpnext.manufacturing.doctype.operation.operation import Operation
from erpnext.manufacturing.doctype.work_order.work_order import WorkOrder
from erpnext.manufacturing.doctype.workstation.workstation import Workstation
from erpnext.setup.doctype.employee.employee import Employee
from erpnext.stock.doctype.item.item import Item
from frappe.tests import IntegrationTestCase
from frappe.utils import add_to_date, now_datetime, random_string
from frappe.utils.password import get_encryption_key
from frappe.utils.redis_wrapper import RedisWrapper

from employee_timeclock.tests.utils import KIOSK_USER, make_kiosk_user
from employee_timeclock.timeclock.custom.job_card import TimeclockJobCard
from employee_timeclock.timeclock.test_api import _ensure_company


class JobTimeclockTestCase(IntegrationTestCase):
	"""
	Test cases for the Project Tracker page functions.

	This test class provides comprehensive coverage for all project tracker-related
	functionality including authentication, logging, and job card management.

	Attributes:
			_test_employee: The test Employee document used across tests.
			_test_device_id: The test Attendance Device ID for RFID authentication.
			_test_work_order: The test Work Order document.
			_test_job_cards: List of test Job Card documents.
			_test_item: The test Item document for manufacturing.
			_test_bom: The test BOM document.
			_test_workstation: The test Workstation document.
			_test_operation: The test Operation document.
	"""

	_test_employee: Employee | None = None
	_test_device_id: Any = None
	_test_work_order: WorkOrder | None = None
	_test_job_cards: ClassVar[list[TimeclockJobCard]] = []
	_test_item: Item | None = None
	_test_bom: BOM | None = None
	_test_workstation: Workstation | None = None
	_test_operation: Operation | None = None

	@classmethod
	def _create_test_employee(cls) -> None:
		"""
		Create a test employee with an attendance device ID.

		Creates an Employee document with a unique name and an associated
		Attendance Device ID for RFID-based authentication testing.
		"""
		unique_id: str = random_string(6)

		# Create test employee
		cls._test_employee = cast(
			Employee,
			frappe.get_doc(
				{
					"doctype": "Employee",
					"first_name": f"Test{unique_id}",
					"last_name": "Employee",
					"employee_name": f"Test{unique_id} Employee",
					"gender": "Male",
					"date_of_birth": "1990-01-01",
					"date_of_joining": "2020-01-01",
					"status": "Active",
					"company": _ensure_company(),
				}
			).insert(ignore_permissions=True),
		)

		# Create attendance device ID for RFID authentication
		cls._test_device_id = frappe.get_doc(
			{
				"doctype": "Attendance Device ID",
				"id": f"RFID{unique_id}",
				"parent": cls._test_employee.name,
				"parenttype": "Employee",
				"parentfield": "attendance_device_id",
			}
		).insert(ignore_permissions=True)

	@classmethod
	def _create_test_job_cards(cls) -> None:
		"""
		Create test job cards for the work order.

		Creates Job Card documents linked to the test Work Order for
		time logging and submission tests.
		"""
		cls._test_job_cards = []

		assert cls._test_work_order is not None
		assert cls._test_operation is not None
		assert cls._test_workstation is not None
		assert cls._test_bom is not None

		# Create a job card
		job_card: TimeclockJobCard = cast(
			TimeclockJobCard,
			frappe.get_doc(
				{
					"doctype": "Job Card",
					"company": cls._test_work_order.company,
					"work_order": cls._test_work_order.name,
					"operation": cls._test_operation.name,
					"workstation": cls._test_workstation.name,
					"for_quantity": 1,
					"wip_warehouse": cls._test_work_order.wip_warehouse,
					"bom_no": cls._test_bom.name,
					"status": "Open",
					"sequence_id": 1,
				}
			).insert(ignore_permissions=True),
		)
		cls._test_job_cards.append(job_card)

	@classmethod
	def _create_test_manufacturing_fixtures(cls) -> None:
		"""
		Create test manufacturing fixtures: Item, BOM, Work Order, Job Cards.

		Sets up the complete manufacturing hierarchy needed for job card
		time logging tests, including Item, Workstation, Operation, BOM,
		Work Order, and Job Cards.
		"""
		unique_id: str = random_string(6)

		# Create test item
		if not frappe.db.exists("Item", f"Test Item {unique_id}"):
			cls._test_item = cast(
				Item,
				frappe.get_doc(
					{
						"doctype": "Item",
						"item_code": f"Test Item {unique_id}",
						"item_name": f"Test Item {unique_id}",
						"item_group": "Products",
						"stock_uom": "Nos",
						"is_stock_item": 1,
					}
				).insert(ignore_permissions=True),
			)
		else:
			cls._test_item = cast(Item, frappe.get_doc("Item", f"Test Item {unique_id}"))

		# Create test workstation if it doesn't exist
		if not frappe.db.exists("Workstation", "Test Workstation"):
			cls._test_workstation = cast(
				Workstation,
				frappe.get_doc(
					{
						"doctype": "Workstation",
						"workstation_name": "Test Workstation",
					}
				).insert(ignore_permissions=True),
			)
		else:
			cls._test_workstation = cast(Workstation, frappe.get_doc("Workstation", "Test Workstation"))

		# Create test operation if it doesn't exist (requires workstation)
		if not frappe.db.exists("Operation", "Test Operation"):
			cls._test_operation = cast(
				Operation,
				frappe.get_doc(
					{
						"doctype": "Operation",
						"name": "Test Operation",
						"workstation": cls._test_workstation.name,
					}
				).insert(ignore_permissions=True),
			)
		else:
			cls._test_operation = cast(Operation, frappe.get_doc("Operation", "Test Operation"))

		# Create test BOM
		assert cls._test_item is not None
		assert cls._test_operation is not None
		assert cls._test_workstation is not None

		# Create a raw material item for the BOM
		rm_item_code = f"Test RM Item {unique_id}"
		if not frappe.db.exists("Item", rm_item_code):
			frappe.get_doc(
				{
					"doctype": "Item",
					"item_code": rm_item_code,
					"item_name": rm_item_code,
					"item_group": "Products",
					"stock_uom": "Nos",
					"is_stock_item": 1,
				}
			).insert(ignore_permissions=True)

		cls._test_bom = cast(
			BOM,
			frappe.get_doc(
				{
					"doctype": "BOM",
					"company": _ensure_company(),
					"item": cls._test_item.name,
					"quantity": 1,
					"is_active": 1,
					"is_default": 1,
					"with_operations": 1,
					"operations": [
						{
							"operation": cls._test_operation.name,
							"workstation": cls._test_workstation.name,
							"time_in_mins": 10,
						}
					],
					"items": [
						{
							"item_code": rm_item_code,
							"qty": 1,
						}
					],
				}
			).insert(ignore_permissions=True),
		)
		cls._test_bom.submit()

		# Create test work order
		company = _ensure_company()
		# Get warehouse that belongs to the company
		warehouse = frappe.get_value("Warehouse", {"is_group": 0, "company": company}, "name")
		if not warehouse:
			# Fallback to any warehouse
			warehouse = frappe.get_value("Warehouse", {"is_group": 0}, "name")

		cls._test_work_order = cast(
			WorkOrder,
			frappe.get_doc(
				{
					"doctype": "Work Order",
					"production_item": cls._test_item.name,
					"qty": 1,
					"bom_no": cls._test_bom.name,
					"status": "Not Started",
					"company": company,
					"wip_warehouse": warehouse,
					"fg_warehouse": warehouse,
				}
			).insert(ignore_permissions=True),
		)
		# Populate operations and required items from BOM (mirrors UI behaviour)
		cls._test_work_order.get_items_and_operations_from_bom()
		cls._test_work_order.save(ignore_permissions=True)
		cls._test_work_order.submit()

		# Create job cards for the work order
		cls._create_test_job_cards()

	@classmethod
	def _create_test_fixtures(cls) -> None:
		"""
		Create all required test fixtures.

		Orchestrates the creation of employee and manufacturing fixtures
		needed for the timeclock tests.
		"""
		cls._create_test_employee()
		cls._create_test_manufacturing_fixtures()

	@classmethod
	def setUpClass(cls) -> None:
		"""
		Set up test fixtures before running any tests in this class.

		Creates all required test documents including Employee, Attendance Device ID,
		Item, BOM, Workstation, Operation, Work Order, and Job Cards.
		"""
		super().setUpClass()
		# the badge tokens are signed with the site's encryption key; a fresh site has none until
		# something asks for it
		get_encryption_key()
		frappe.set_user("Administrator")
		make_kiosk_user()
		cls._create_test_fixtures()

	@classmethod
	def tearDownClass(cls) -> None:
		"""
		Clean up after all tests in this class have run.

		Deletes test fixtures and rolls back any database changes.
		"""
		frappe.set_user("Administrator")
		# Delete test fixtures in reverse order of dependencies
		try:
			for job_card in cls._test_job_cards:
				if job_card and frappe.db.exists("Job Card", job_card.name):
					frappe.delete_doc("Job Card", job_card.name, ignore_permissions=True, force=True)
			if cls._test_work_order and frappe.db.exists("Work Order", cls._test_work_order.name):
				if cls._test_work_order.docstatus == 1:
					cls._test_work_order.reload()
					cls._test_work_order.cancel()
				frappe.delete_doc(
					"Work Order", cls._test_work_order.name, ignore_permissions=True, force=True
				)
			if cls._test_bom and frappe.db.exists("BOM", cls._test_bom.name):
				if cls._test_bom.docstatus == 1:
					cls._test_bom.reload()
					cls._test_bom.cancel()
				frappe.delete_doc("BOM", cls._test_bom.name, ignore_permissions=True, force=True)
			if cls._test_device_id and frappe.db.exists("Attendance Device ID", cls._test_device_id.name):
				frappe.delete_doc(
					"Attendance Device ID", cls._test_device_id.name, ignore_permissions=True, force=True
				)
			if cls._test_employee and frappe.db.exists("Employee", cls._test_employee.name):
				frappe.delete_doc("Employee", cls._test_employee.name, ignore_permissions=True, force=True)
		except Exception:
			frappe.db.rollback()
		super().tearDownClass()

	def setUp(self) -> None:
		"""Set up before each test - clear rate limiter cache and time logs."""
		super().setUp()
		# Clear rate limiter cache to avoid rate limiting between tests
		cast(RedisWrapper, frappe.cache).delete_keys("rl:*")
		# Clear any existing time logs from job cards to start fresh
		for job_card in self._test_job_cards:
			if job_card and frappe.db.exists("Job Card", job_card.name):
				# Delete time logs directly from database to avoid validation issues
				frappe.db.delete("Job Card Time Log", {"parent": job_card.name})
				job_card.reload()

	def tearDown(self) -> None:
		"""
		Clean up test data after each test.

		Removes Employee Checkin records and resets job card time logs, so each test
		starts from the class fixtures (the class's transaction is rolled back at the end).
		"""
		frappe.set_user("Administrator")

		# Clean up employee checkins created during tests
		if self._test_employee:
			checkins: list[str] = frappe.get_all(
				"Employee Checkin", filters={"employee": self._test_employee.name}, pluck="name"
			)
			for checkin in checkins:
				with contextlib.suppress(Exception):
					frappe.delete_doc("Employee Checkin", checkin, ignore_permissions=True, force=True)

			# Delete ALL time logs for this employee across all job cards
			frappe.db.delete("Job Card Time Log", {"employee": self._test_employee.name})

		# Reset test job card time logs and status
		for job_card in self._test_job_cards:
			# Delete time logs directly from database
			frappe.db.delete("Job Card Time Log", {"parent": job_card.name})
			# Reset job card status
			frappe.db.set_value("Job Card", job_card.name, "status", "Open")
			# Clear document cache for this job card
			frappe.clear_document_cache("Job Card", job_card.name)

		# Clear value cache
		frappe.db.value_cache.clear()


class TestProjectTracker(JobTimeclockTestCase):
	"""The Project Tracker (``/job_timeclock``) page functions."""

	def test_authenticate_employee_valid_rfid(self) -> None:
		"""
		Test that authenticate_employee returns success for valid RFID.

		Verifies that a valid RFID returns a success status and a JWT token
		for subsequent authenticated requests.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee

		result: dict[str, Any] = authenticate_employee(self._test_device_id.id)

		self.assertEqual(result["status"], "success")
		self.assertIn("token", result)
		self.assertIsNotNone(result["token"])

	def test_authenticate_employee_invalid_rfid(self) -> None:
		"""
		Test that authenticate_employee returns error for invalid RFID.

		Verifies that an unrecognized RFID returns an error status with
		an appropriate error message.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee

		result: dict[str, Any] = authenticate_employee("INVALID_RFID_12345")

		self.assertEqual(result["status"], "error")
		self.assertIn("message", result)

	def test_authenticate_employee_returns_last_checkin(self) -> None:
		"""
		Test that authenticate_employee returns the last checkin status.

		Verifies that after logging in, subsequent authentication calls
		return the correct last_checkin status ("IN" or "OUT").
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee, log_in_employee

		# First authenticate to get a token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Log in the employee (as the kiosk user, so token auth is used)
		frappe.set_user(KIOSK_USER)
		log_in_employee(str(now_datetime()), token=token)
		frappe.set_user("Administrator")

		# Authenticate again and check last_checkin
		result: dict[str, Any] = authenticate_employee(self._test_device_id.id)

		self.assertEqual(result["status"], "success")
		self.assertEqual(result["last_checkin"], "IN")

	def test_log_in_employee(self) -> None:
		"""
		Test logging in an employee.

		Verifies that log_in_employee creates an Employee Checkin record
		with log_type "IN" for the authenticated employee.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee, log_in_employee

		assert self._test_employee is not None

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Log in (as the kiosk user, so token auth is used)
		frappe.set_user(KIOSK_USER)
		current_time = now_datetime()
		result: dict[str, Any] = log_in_employee(str(current_time), token=token)
		frappe.set_user("Administrator")

		self.assertEqual(result["status"], "success")
		self.assertIsNotNone(result["log"])
		self.assertEqual(result["log"].log_type, "IN")
		self.assertEqual(result["log"].employee, self._test_employee.name)

	def test_a_rejected_punch_is_reported_unsuccessful(self) -> None:
		"""A punch the checkin validation rejects (a duplicate) is reported, not swallowed."""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee, log_out_employee

		assert self._test_employee is not None
		token: str = authenticate_employee(self._test_device_id.id)["token"]
		punch = str(now_datetime())
		outs = {"employee": self._test_employee.name, "log_type": "OUT"}
		before = frappe.db.count("Employee Checkin", outs)

		frappe.set_user(KIOSK_USER)
		first: dict[str, Any] = log_out_employee(punch, token=token)
		second: dict[str, Any] = log_out_employee(punch, token=token)
		frappe.set_user("Administrator")

		self.assertEqual(first["status"], "success")
		self.assertEqual(second["status"], "unsuccessful")
		self.assertEqual(frappe.db.count("Employee Checkin", outs), before + 1)

	def test_log_out_employee(self) -> None:
		"""
		Test logging out an employee.

		Verifies that log_out_employee creates an Employee Checkin record
		with log_type "OUT" for the authenticated employee.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import (
			authenticate_employee,
			log_in_employee,
			log_out_employee,
		)

		assert self._test_employee is not None

		# Get a valid token and log in first
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]
		frappe.set_user(KIOSK_USER)
		log_in_employee(str(now_datetime()), token=token)

		# Get fresh token and log out
		frappe.set_user("Administrator")
		auth_result = authenticate_employee(self._test_device_id.id)
		token = auth_result["token"]
		frappe.set_user(KIOSK_USER)
		current_time = now_datetime()
		result: dict[str, Any] = log_out_employee(str(current_time), token=token)
		frappe.set_user("Administrator")

		self.assertEqual(result["status"], "success")
		self.assertIsNotNone(result["log"])
		self.assertEqual(result["log"].log_type, "OUT")
		self.assertEqual(result["log"].employee, self._test_employee.name)

	def test_get_work_orders(self) -> None:
		"""
		Test getting work orders.

		Verifies that get_work_orders returns a list of work orders
		with status "Submitted", "Not Started", or "In Process".
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee, get_work_orders

		assert self._test_work_order is not None

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Get work orders
		result: dict[str, Any] = get_work_orders(token=token)

		self.assertEqual(result["status"], "success")
		self.assertIn("work_orders", result)
		self.assertIn("token", result)
		self.assertIsInstance(result["work_orders"], list)

		# Verify our test work order is in the list
		work_order_names: list[str] = [wo["name"] for wo in result["work_orders"]]
		self.assertIn(self._test_work_order.name, work_order_names)

	def test_get_operations(self) -> None:
		"""
		Test getting operations for a work order.

		Verifies that get_operations returns operations associated with
		the specified work order, including time totals.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee, get_operations

		assert self._test_work_order is not None

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Get operations
		result: dict[str, Any] = get_operations(work_order=str(self._test_work_order.name), token=token)

		self.assertEqual(result["status"], "success")
		self.assertIn("operations", result)
		self.assertIn("token", result)
		self.assertIsInstance(result["operations"], list)
		self.assertGreater(len(result["operations"]), 0)

	def test_get_operations_empty_work_order(self) -> None:
		"""
		Test getting operations for a work order with no operations.

		Verifies that get_operations returns an empty list when the
		specified work order has no associated operations.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee, get_operations

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Get operations for non-existent work order
		result: dict[str, Any] = get_operations(work_order="NON_EXISTENT_WO", token=token)

		self.assertEqual(result["status"], "success")
		self.assertEqual(result["operations"], [])

	def test_start_timer(self) -> None:
		"""
		Test starting a timer on a job card.

		Verifies that start_timer creates a new Job Card Time Log entry
		with from_time set and to_time as None.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee, start_timer

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_operation is not None

		job_card: TimeclockJobCard = self._test_job_cards[0]
		start_time = now_datetime()

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		frappe.set_user(KIOSK_USER)
		result: dict[str, Any] = start_timer(
			work_order=str(self._test_work_order.name),
			operation=str(self._test_operation.name),
			start_time=str(start_time),
			token=token,
		)
		frappe.set_user("Administrator")

		self.assertEqual(result["status"], "success")

		# Verify time log was added
		job_card.reload()
		self.assertGreater(len(job_card.time_logs), 0)
		last_log = job_card.time_logs[-1]
		self.assertEqual(last_log.employee, self._test_employee.name)
		self.assertIsNone(last_log.to_time)

	def test_stop_timer(self) -> None:
		"""
		Test stopping a timer on a job card.

		Verifies that stop_timer closes the open time log entry
		by setting to_time.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import (
			authenticate_employee,
			start_timer,
			stop_timer,
		)

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_operation is not None

		job_card: TimeclockJobCard = self._test_job_cards[0]
		start_time = now_datetime()

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Start the timer (as the kiosk user, so token auth is used)
		frappe.set_user(KIOSK_USER)
		start_timer(
			work_order=str(self._test_work_order.name),
			operation=str(self._test_operation.name),
			start_time=str(start_time),
			token=token,
		)
		frappe.set_user("Administrator")

		# Stop the timer
		end_time = add_to_date(start_time, minutes=30)
		# Re-authenticate for fresh token
		auth_result = authenticate_employee(self._test_device_id.id)
		token = auth_result["token"]
		frappe.set_user(KIOSK_USER)
		result: dict[str, Any] = stop_timer(end_time=str(end_time), token=token)
		frappe.set_user("Administrator")

		self.assertEqual(result["status"], "success")

		# Verify time log was closed
		job_card.reload()
		employee_logs = [log for log in job_card.time_logs if log.employee == self._test_employee.name]
		last_log = employee_logs[-1]
		self.assertIsNotNone(last_log.to_time)

	def test_start_timer_closes_previous(self) -> None:
		"""
		Test that starting a new timer closes the previous one.

		Verifies that when an employee starts a timer on a new operation,
		any open time logs are automatically closed.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee, start_timer

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_operation is not None
		assert self._test_workstation is not None
		assert self._test_bom is not None

		# Create a second job card for testing
		job_card2: TimeclockJobCard = cast(
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
					"status": "Open",
					"sequence_id": 2,
				}
			).insert(ignore_permissions=True),
		)

		try:
			# Get a valid token
			auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
			token: str = auth_result["token"]

			# Start time on first job card (as the kiosk user, so token auth is used)
			start_time1 = now_datetime()
			frappe.set_user(KIOSK_USER)
			start_timer(
				work_order=str(self._test_work_order.name),
				operation=str(self._test_operation.name),
				start_time=str(start_time1),
				token=token,
			)
			frappe.set_user("Administrator")

			# Start time on second job card - should close first
			start_time2 = add_to_date(start_time1, minutes=15)
			auth_result = authenticate_employee(self._test_device_id.id)
			token = auth_result["token"]
			frappe.set_user(KIOSK_USER)
			start_timer(
				work_order=str(self._test_work_order.name),
				operation=str(self._test_operation.name),
				start_time=str(start_time2),
				token=token,
			)
			frappe.set_user("Administrator")

			# Verify first time log was closed
			self._test_job_cards[0].reload()
			employee_logs = [
				log for log in self._test_job_cards[0].time_logs if log.employee == self._test_employee.name
			]
			if len(employee_logs) > 1:
				# The first log should have been closed
				self.assertIsNotNone(employee_logs[0].to_time)

		finally:
			# Clean up second job card
			frappe.delete_doc("Job Card", job_card2.name, ignore_permissions=True, force=True)

	def test_get_operations_with_workstation_priority(self) -> None:
		"""
		Test that get_operations prioritizes operations matching workstations.

		Verifies that operations whose workstation matches the provided
		workstation list are sorted to the top.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee, get_operations

		assert self._test_work_order is not None
		assert self._test_workstation is not None

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Get operations with workstation priority
		import json

		result: dict[str, Any] = get_operations(
			work_order=str(self._test_work_order.name),
			workstations=json.dumps([self._test_workstation.name]),
			token=token,
		)

		self.assertEqual(result["status"], "success")
		self.assertIsInstance(result["operations"], list)
		self.assertGreater(len(result["operations"]), 0)

	def test_refresh_token(self) -> None:
		"""
		Test that token refresh works correctly.

		Verifies that refresh_token generates a valid JWT token and that
		extract_employee_from_token can decode it and return a new token.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import (
			extract_employee_from_token,
			refresh_token,
		)

		assert self._test_employee is not None

		# Generate initial token
		token1: str = refresh_token(str(self._test_employee.name))
		self.assertIsNotNone(token1)

		# Extract employee and get refreshed token
		employee_id: str
		token2: str
		employee_id, token2 = extract_employee_from_token(token1)

		self.assertEqual(employee_id, self._test_employee.name)
		self.assertIsNotNone(token2)

	def test_extract_employee_from_expired_token(self) -> None:
		"""
		Test that expired tokens raise appropriate error.

		Verifies that extract_employee_from_token raises an
		AuthenticationError when presented with an expired JWT token.
		"""
		from employee_timeclock.auth import get_token_secret
		from employee_timeclock.www.job_timeclock.job_timeclock import extract_employee_from_token

		assert self._test_employee is not None

		# Create an expired token
		expired_time: float = (datetime.datetime.now() - datetime.timedelta(hours=1)).timestamp()
		expired_token: str = jwt.encode(
			payload={
				"employee_id": self._test_employee.name,
				"employee_name": "Test Employee",
				"exp": expired_time,
			},
			key=get_token_secret(),
			algorithm="HS256",
		)

		# Should raise authentication error
		with self.assertRaises(frappe.AuthenticationError):
			extract_employee_from_token(expired_token)

	def test_extract_employee_from_invalid_token(self) -> None:
		"""
		Test that invalid tokens raise appropriate error.

		Verifies that extract_employee_from_token raises an
		AuthenticationError when presented with a malformed token.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import extract_employee_from_token

		# Should raise authentication error for invalid token
		with self.assertRaises(frappe.AuthenticationError):
			extract_employee_from_token("invalid_token_string")

	def test_get_user_session_employee_guest(self) -> None:
		"""
		Test checking ERP login status for guest user.

		Verifies that get_user_session_employee returns "Guest" as the
		user_id when no user is logged into the ERP system.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import get_user_session_employee

		frappe.set_user("Guest")
		result: dict[str, str] = get_user_session_employee()

		self.assertEqual(result["user_id"], "Guest")

	def test_get_user_session_employee_authenticated(self) -> None:
		"""
		Test checking ERP login status for authenticated user.

		Verifies that get_user_session_employee returns the correct
		user_id when a user is logged into the ERP system.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import get_user_session_employee

		frappe.set_user("Administrator")
		result: dict[str, str] = get_user_session_employee()

		self.assertEqual(result["user_id"], "Administrator")

	def test_submit_jobcard(self) -> None:
		"""
		Test submitting a job card.

		Verifies that submit_jobcard marks a job card as "Completed"
		after all time logs have been properly closed.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import (
			authenticate_employee,
			start_timer,
			stop_timer,
			submit_jobcard,
		)

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_operation is not None
		assert self._test_workstation is not None
		assert self._test_bom is not None

		# Use the existing fixture job card
		job_card: TimeclockJobCard = self._test_job_cards[0]

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Start timer (resolves to the fixture job card)
		start_time = now_datetime()
		start_timer(
			work_order=str(self._test_work_order.name),
			operation=str(self._test_operation.name),
			start_time=str(start_time),
			token=token,
		)

		# Stop timer
		end_time = add_to_date(start_time, minutes=30)
		auth_result = authenticate_employee(self._test_device_id.id)
		token = auth_result["token"]
		stop_timer(end_time=str(end_time), token=token)

		# Submit the job card
		job_card.reload()
		job_card_dict: dict[str, Any] = {
			"name": job_card.name,
			"operation": job_card.operation,
		}
		complete_time = add_to_date(end_time, minutes=5)
		auth_result = authenticate_employee(self._test_device_id.id)
		token = auth_result["token"]
		result: dict[str, Any] = submit_jobcard(job_card_dict, str(complete_time), token=token)

		self.assertEqual(result["status"], "success")
		self.assertIn("job_card", result)

		# Verify job card status
		job_card.reload()
		self.assertEqual(job_card.status, "Completed")

		# Restore the job card for other tests: cancel and recreate
		job_card.reload()
		if job_card.docstatus == 1:
			job_card.cancel()
		frappe.delete_doc("Job Card", job_card.name, ignore_permissions=True, force=True)
		new_job_card: TimeclockJobCard = cast(
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
					"status": "Open",
					"sequence_id": 1,
				}
			).insert(ignore_permissions=True),
		)
		self._test_job_cards[0] = new_job_card

	def test_submit_jobcard_with_unfinished_times(self) -> None:
		"""
		Test that submitting a job card with unfinished times completes them.

		Verifies that submit_jobcard automatically fills in missing to_time
		values when a job card is submitted with open time logs.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import (
			authenticate_employee,
			start_timer,
			submit_jobcard,
		)

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_operation is not None
		assert self._test_workstation is not None
		assert self._test_bom is not None

		# Use the existing fixture job card
		job_card: TimeclockJobCard = self._test_job_cards[0]

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Start timer but don't stop it
		start_time = now_datetime()
		start_timer(
			work_order=str(self._test_work_order.name),
			operation=str(self._test_operation.name),
			start_time=str(start_time),
			token=token,
		)

		# Try to submit - should handle the unfinished time
		job_card.reload()
		job_card_dict: dict[str, Any] = {
			"name": job_card.name,
			"operation": job_card.operation,
		}
		complete_time = add_to_date(start_time, minutes=30)
		auth_result = authenticate_employee(self._test_device_id.id)
		token = auth_result["token"]
		result: dict[str, Any] = submit_jobcard(job_card_dict, str(complete_time), token=token)

		# The function should complete and fill in the to_time
		self.assertEqual(result["status"], "success")

		# Restore the job card for other tests: cancel and recreate
		job_card.reload()
		if job_card.docstatus == 1:
			job_card.cancel()
		frappe.delete_doc("Job Card", job_card.name, ignore_permissions=True, force=True)
		new_job_card: TimeclockJobCard = cast(
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
					"status": "Open",
					"sequence_id": 1,
				}
			).insert(ignore_permissions=True),
		)
		self._test_job_cards[0] = new_job_card

	def test_machine_operations_use_machine_employee(self) -> None:
		"""
		Test that machine operations use machine employee IDs.

		Verifies that when starting a timer on machine operations,
		the time log uses the machine's employee ID instead of the human operator.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee, start_timer

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_workstation is not None
		assert self._test_bom is not None

		unique_id: str = random_string(6)

		# Create a machine employee
		machine_employee: Employee = cast(
			Employee,
			frappe.get_doc(
				{
					"doctype": "Employee",
					"first_name": f"Machine {unique_id}",
					"company": _ensure_company(),
					"status": "Active",
					"gender": "Other",
					"date_of_birth": "2000-01-01",
					"date_of_joining": "2020-01-01",
				}
			).insert(ignore_permissions=True),
		)

		# Create an Employee Group with the machine employee
		employee_group = frappe.get_doc(
			{
				"doctype": "Employee Group",
				"employee_group_name": f"Test Machine Group {unique_id}",
				"employee_list": [{"employee": machine_employee.name}],
			}
		).insert(ignore_permissions=True)

		# Create a machine operation
		machine_op_name = f"Test Machine Op {unique_id}"
		machine_op = frappe.get_doc(
			{
				"doctype": "Operation",
				"name": machine_op_name,
				"workstation": self._test_workstation.name,
				"is_machine_time": 1,
				"employee_group": employee_group.name,
			}
		).insert(ignore_permissions=True)

		# Create a job card with the machine operation
		job_card: TimeclockJobCard = cast(
			TimeclockJobCard,
			frappe.get_doc(
				{
					"doctype": "Job Card",
					"company": self._test_work_order.company,
					"work_order": self._test_work_order.name,
					"operation": machine_op.name,
					"workstation": self._test_workstation.name,
					"for_quantity": 1,
					"wip_warehouse": self._test_work_order.wip_warehouse,
					"bom_no": self._test_bom.name,
					"is_machine_time": 1,
					"status": "Open",
					"sequence_id": 1,
				}
			).insert(ignore_permissions=True),
		)

		try:
			# Get a valid token
			auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
			token: str = auth_result["token"]

			start_time = now_datetime()
			frappe.set_user(KIOSK_USER)
			result: dict[str, Any] = start_timer(
				work_order=str(self._test_work_order.name),
				operation=machine_op.name,
				start_time=str(start_time),
				token=token,
			)
			frappe.set_user("Administrator")

			self.assertEqual(result["status"], "success")

			# Verify the time log records the human operator as machine_operator
			# and employee is cleared (before_save moves employee -> machine_operator)
			job_card.reload()
			self.assertGreater(len(job_card.time_logs), 0)
			last_log = job_card.time_logs[-1]
			self.assertFalse(last_log.employee, "employee should be empty on a machine time log")
			self.assertEqual(last_log.machine_operator, self._test_employee.name)

		finally:
			frappe.delete_doc("Job Card", job_card.name, ignore_permissions=True, force=True)
			frappe.delete_doc("Operation", machine_op.name, ignore_permissions=True, force=True)
			frappe.delete_doc("Employee Group", employee_group.name, ignore_permissions=True, force=True)
			frappe.delete_doc("Employee", machine_employee.name, ignore_permissions=True, force=True)

	def test_machine_time_log_employee_moved_to_machine_operator(self) -> None:
		"""
		Test that saving a machine Job Card moves employee -> machine_operator.

		Ensures the JobCard.before_save override clears the employee field on
		time logs for machine operations, recording the operator in
		machine_operator instead.  This prevents false overlap errors and keeps
		the employee field consistent (always empty for machine time logs).
		"""
		assert self._test_workstation is not None
		assert self._test_bom is not None
		assert self._test_work_order is not None
		assert self._test_employee is not None

		unique_id: str = random_string(6)

		# Create a machine operation
		machine_op = frappe.get_doc(
			{
				"doctype": "Operation",
				"name": f"Test Machine Op {unique_id}",
				"workstation": self._test_workstation.name,
				"is_machine_time": 1,
			}
		).insert(ignore_permissions=True)

		job_card: TimeclockJobCard = cast(
			TimeclockJobCard,
			frappe.get_doc(
				{
					"doctype": "Job Card",
					"company": self._test_work_order.company,
					"work_order": self._test_work_order.name,
					"operation": machine_op.name,
					"workstation": self._test_workstation.name,
					"for_quantity": 1,
					"wip_warehouse": self._test_work_order.wip_warehouse,
					"bom_no": self._test_bom.name,
					"is_machine_time": 1,
					"status": "Open",
					"sequence_id": 1,
				}
			).insert(ignore_permissions=True),
		)

		try:
			# Directly append a time log with employee set — simulating any path
			# that bypasses start_timer (e.g. direct form save or API call)
			job_card.reload()
			job_card.append(
				"time_logs",
				{"from_time": now_datetime(), "employee": self._test_employee.name},
			)
			job_card.save(ignore_permissions=True)
			job_card.reload()

			self.assertGreater(len(job_card.time_logs), 0)
			log = job_card.time_logs[-1]
			# employee must be cleared
			self.assertFalse(log.employee, "employee should be empty on a machine time log")
			# operator must be preserved under machine_operator
			self.assertEqual(
				log.machine_operator,
				self._test_employee.name,
				"machine_operator should hold the operator's employee ID",
			)
		finally:
			frappe.delete_doc("Job Card", job_card.name, ignore_permissions=True, force=True)
			frappe.delete_doc("Operation", machine_op.name, ignore_permissions=True, force=True)

	def test_get_machine_timers_scoped_to_employee_groups(self) -> None:
		"""Machine timers are only visible to members of the operation's group.

		A running machine timer must be returned to an employee who belongs to
		the operation's Employee Group, but hidden from an unrelated employee who
		belongs to a *different* group (e.g. a general worker who is not a CNC
		operator).  Regression test for machine timers leaking to every employee.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import (
			authenticate_employee,
			get_machine_timers,
			start_timer,
			stop_machine_timer,
		)

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_workstation is not None
		assert self._test_bom is not None

		unique_id: str = random_string(6)

		# CNC group containing the operator who runs the machine
		cnc_group = frappe.get_doc(
			{
				"doctype": "Employee Group",
				"employee_group_name": f"Test CNC Group {unique_id}",
				"employee_list": [{"employee": self._test_employee.name}],
			}
		).insert(ignore_permissions=True)

		# A general worker in an unrelated group — should NOT see CNC machine time
		general_employee: Employee = cast(
			Employee,
			frappe.get_doc(
				{
					"doctype": "Employee",
					"first_name": f"General {unique_id}",
					"company": _ensure_company(),
					"status": "Active",
					"gender": "Other",
					"date_of_birth": "1995-01-01",
					"date_of_joining": "2020-01-01",
				}
			).insert(ignore_permissions=True),
		)
		general_device = frappe.get_doc(
			{
				"doctype": "Attendance Device ID",
				"id": f"RFIDGEN{unique_id}",
				"parent": general_employee.name,
				"parenttype": "Employee",
				"parentfield": "attendance_device_id",
			}
		).insert(ignore_permissions=True)
		general_group = frappe.get_doc(
			{
				"doctype": "Employee Group",
				"employee_group_name": f"Test General Group {unique_id}",
				"employee_list": [{"employee": general_employee.name}],
			}
		).insert(ignore_permissions=True)

		machine_op = frappe.get_doc(
			{
				"doctype": "Operation",
				"name": f"Test CNC Machine Op {unique_id}",
				"workstation": self._test_workstation.name,
				"is_machine_time": 1,
				"employee_group": cnc_group.name,
			}
		).insert(ignore_permissions=True)

		job_card: TimeclockJobCard = cast(
			TimeclockJobCard,
			frappe.get_doc(
				{
					"doctype": "Job Card",
					"company": self._test_work_order.company,
					"work_order": self._test_work_order.name,
					"operation": machine_op.name,
					"workstation": self._test_workstation.name,
					"for_quantity": 1,
					"wip_warehouse": self._test_work_order.wip_warehouse,
					"bom_no": self._test_bom.name,
					"is_machine_time": 1,
					"status": "Open",
					"sequence_id": 1,
				}
			).insert(ignore_permissions=True),
		)

		try:
			# Operator starts the machine timer
			operator_token: str = authenticate_employee(self._test_device_id.id)["token"]
			frappe.set_user(KIOSK_USER)
			start_result: dict[str, Any] = start_timer(
				work_order=str(self._test_work_order.name),
				operation=machine_op.name,
				start_time=str(now_datetime()),
				token=operator_token,
			)
			frappe.set_user("Administrator")
			self.assertEqual(start_result["status"], "success")

			# Operator (CNC group member) sees the timer
			operator_token = authenticate_employee(self._test_device_id.id)["token"]
			frappe.set_user(KIOSK_USER)
			operator_view: dict[str, Any] = get_machine_timers(token=operator_token)
			frappe.set_user("Administrator")
			self.assertEqual(operator_view["status"], "success")
			self.assertIn(cnc_group.name, operator_view["employee_groups"])
			operator_ops = {t["operation"] for t in operator_view["machine_timers"]}
			self.assertIn(machine_op.name, operator_ops)

			# General worker (different group) does NOT see the CNC timer
			general_token: str = authenticate_employee(general_device.get("id"))["token"]
			frappe.set_user(KIOSK_USER)
			general_view: dict[str, Any] = get_machine_timers(token=general_token)
			frappe.set_user("Administrator")
			self.assertEqual(general_view["status"], "success")
			self.assertEqual(general_view["employee_groups"], [general_group.name])
			general_ops = {t["operation"] for t in general_view["machine_timers"]}
			self.assertNotIn(machine_op.name, general_ops)

			# The operator stops the machine timer; it no longer shows
			operator_token = authenticate_employee(self._test_device_id.id)["token"]
			frappe.set_user(KIOSK_USER)
			stop_result: dict[str, Any] = stop_machine_timer(
				work_order=str(self._test_work_order.name),
				operation=machine_op.name,
				end_time=cast(Any, add_to_date(now_datetime(), minutes=5).isoformat()),
				token=operator_token,
			)
			frappe.set_user("Administrator")
			self.assertEqual(stop_result["status"], "success")
			job_card.reload()
			self.assertTrue(all(log.to_time for log in job_card.time_logs))
			operator_token = authenticate_employee(self._test_device_id.id)["token"]
			operator_view = get_machine_timers(token=operator_token)
			self.assertNotIn(machine_op.name, {t["operation"] for t in operator_view["machine_timers"]})

			# ...and stopping it again finds nothing to stop
			operator_token = authenticate_employee(self._test_device_id.id)["token"]
			again: dict[str, Any] = stop_machine_timer(
				work_order=str(self._test_work_order.name),
				operation=machine_op.name,
				end_time=now_datetime(),
				token=operator_token,
			)
			self.assertEqual(again, {"status": "failed", "error": "No active machine timer found"})

		finally:
			frappe.set_user("Administrator")
			frappe.delete_doc("Job Card", job_card.name, ignore_permissions=True, force=True)
			frappe.delete_doc("Operation", machine_op.name, ignore_permissions=True, force=True)
			frappe.delete_doc("Employee Group", cnc_group.name, ignore_permissions=True, force=True)
			frappe.delete_doc("Employee Group", general_group.name, ignore_permissions=True, force=True)
			frappe.delete_doc(
				"Attendance Device ID", general_device.name, ignore_permissions=True, force=True
			)
			frappe.delete_doc("Employee", general_employee.name, ignore_permissions=True, force=True)

	def test_get_operations_hides_machine_ops_from_other_groups(self) -> None:
		"""Machine operations are filtered out for employees in other groups.

		A machine operation belonging to the CNC Employee Group must appear in
		``get_operations`` for a CNC operator, but be hidden from a general
		worker who is not in that group — while regular (labor) operations stay
		visible to both.  Regression test for machine job cards leaking to every
		employee.
		"""
		from employee_timeclock.www.job_timeclock.job_timeclock import authenticate_employee, get_operations

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_workstation is not None

		unique_id: str = random_string(6)

		# CNC group containing the operator who runs the machine
		cnc_group = frappe.get_doc(
			{
				"doctype": "Employee Group",
				"employee_group_name": f"Test CNC Group {unique_id}",
				"employee_list": [{"employee": self._test_employee.name}],
			}
		).insert(ignore_permissions=True)

		# A general worker in an unrelated group — should NOT see machine ops
		general_employee: Employee = cast(
			Employee,
			frappe.get_doc(
				{
					"doctype": "Employee",
					"first_name": f"General {unique_id}",
					"company": _ensure_company(),
					"status": "Active",
					"gender": "Other",
					"date_of_birth": "1995-01-01",
					"date_of_joining": "2020-01-01",
				}
			).insert(ignore_permissions=True),
		)
		general_device = frappe.get_doc(
			{
				"doctype": "Attendance Device ID",
				"id": f"RFIDGEN{unique_id}",
				"parent": general_employee.name,
				"parenttype": "Employee",
				"parentfield": "attendance_device_id",
			}
		).insert(ignore_permissions=True)
		general_group = frappe.get_doc(
			{
				"doctype": "Employee Group",
				"employee_group_name": f"Test General Group {unique_id}",
				"employee_list": [{"employee": general_employee.name}],
			}
		).insert(ignore_permissions=True)

		machine_op = frappe.get_doc(
			{
				"doctype": "Operation",
				"name": f"Test CNC Machine Op {unique_id}",
				"workstation": self._test_workstation.name,
				"is_machine_time": 1,
				"employee_group": cnc_group.name,
			}
		).insert(ignore_permissions=True)

		# Attach the machine operation to the existing test work order
		wo_operation = frappe.get_doc(
			{
				"doctype": "Work Order Operation",
				"parent": self._test_work_order.name,
				"parenttype": "Work Order",
				"parentfield": "operations",
				"operation": machine_op.name,
				"workstation": self._test_workstation.name,
				"time_in_mins": 10,
				"status": "Pending",
			}
		).insert(ignore_permissions=True)

		try:
			# CNC operator (group member) sees the machine operation
			operator_token: str = authenticate_employee(self._test_device_id.id)["token"]
			operator_ops: dict[str, Any] = get_operations(
				work_order=str(self._test_work_order.name), token=operator_token
			)
			self.assertEqual(operator_ops["status"], "success")
			operator_op_names = {o["operation"] for o in operator_ops["operations"]}
			self.assertIn(machine_op.name, operator_op_names)
			# Regular (labor) operations remain visible
			self.assertTrue(any(not o["is_machine_time"] for o in operator_ops["operations"]))

			# General worker (different group) does NOT see the machine operation
			general_token: str = authenticate_employee(general_device.get("id"))["token"]
			general_ops: dict[str, Any] = get_operations(
				work_order=str(self._test_work_order.name), token=general_token
			)
			self.assertEqual(general_ops["status"], "success")
			general_op_names = {o["operation"] for o in general_ops["operations"]}
			self.assertNotIn(machine_op.name, general_op_names)
			# Regular operations are still returned to the general worker
			self.assertTrue(any(not o["is_machine_time"] for o in general_ops["operations"]))

		finally:
			frappe.set_user("Administrator")
			frappe.db.delete("Work Order Operation", {"name": wo_operation.name})
			frappe.delete_doc("Operation", machine_op.name, ignore_permissions=True, force=True)
			frappe.delete_doc("Employee Group", cnc_group.name, ignore_permissions=True, force=True)
			frappe.delete_doc("Employee Group", general_group.name, ignore_permissions=True, force=True)
			frappe.delete_doc(
				"Attendance Device ID", general_device.name, ignore_permissions=True, force=True
			)
			frappe.delete_doc("Employee", general_employee.name, ignore_permissions=True, force=True)

	def test_get_active_timer(self) -> None:
		"""The running labor timer is reported until it is stopped."""
		from employee_timeclock.www.job_timeclock.job_timeclock import (
			authenticate_employee,
			get_active_timer,
			start_timer,
			stop_timer,
		)

		assert self._test_work_order is not None
		assert self._test_operation is not None

		token: str = authenticate_employee(self._test_device_id.id)["token"]
		self.assertIsNone(get_active_timer(token=token)["active_timer"])

		start_time = now_datetime().replace(microsecond=0)
		start_timer(
			work_order=str(self._test_work_order.name),
			operation=str(self._test_operation.name),
			start_time=str(start_time),
			token=token,
		)
		result: dict[str, Any] = get_active_timer(token=token)

		self.assertEqual(result["status"], "success")
		self.assertTrue(result["token"])
		self.assertEqual(result["active_timer"]["work_order"], self._test_work_order.name)
		self.assertEqual(result["active_timer"]["operation"], self._test_operation.name)
		self.assertFalse(result["active_timer"]["is_corrective"])

		stop_timer(end_time=str(add_to_date(start_time, minutes=10)), token=token)
		self.assertIsNone(get_active_timer(token=token)["active_timer"])

	def test_get_active_timer_requires_authentication(self) -> None:
		from employee_timeclock.www.job_timeclock.job_timeclock import get_active_timer

		frappe.set_user(KIOSK_USER)
		result: dict[str, Any] = get_active_timer(token="not-a-token")

		self.assertEqual(result["status"], "error")
		self.assertIsNone(result["active_timer"])

	def test_get_workstations(self) -> None:
		from employee_timeclock.www.job_timeclock.job_timeclock import get_workstations

		assert self._test_workstation is not None
		result: dict[str, Any] = get_workstations()

		self.assertEqual(result["status"], "success")
		self.assertIn(self._test_workstation.name, result["workstations"])

	def test_get_device_info(self) -> None:
		from employee_timeclock.www.job_timeclock.job_timeclock import get_device_info

		frappe.local.request_ip = "127.0.0.1"
		try:
			result: dict[str, Any] = get_device_info()
		finally:
			frappe.local.request_ip = None

		self.assertEqual(result["status"], "success")
		self.assertEqual(result["ip"], "127.0.0.1")
		self.assertIsInstance(result["mac"], str)

	def test_stop_machine_timer_rejects_bad_requests(self) -> None:
		from employee_timeclock.www.job_timeclock.job_timeclock import (
			authenticate_employee,
			stop_machine_timer,
		)

		assert self._test_work_order is not None
		assert self._test_operation is not None
		work_order = str(self._test_work_order.name)
		operation = str(self._test_operation.name)

		frappe.set_user(KIOSK_USER)
		unauthenticated = stop_machine_timer(work_order, operation, now_datetime(), token="not-a-token")
		self.assertEqual(unauthenticated["status"], "failed")

		token: str = authenticate_employee(self._test_device_id.id)["token"]
		bad_time = stop_machine_timer(work_order, operation, cast(Any, "yesterday"), token=token)
		self.assertEqual(bad_time, {"status": "failed", "error": "Invalid end_time format"})

		token = authenticate_employee(self._test_device_id.id)["token"]
		labor = stop_machine_timer(work_order, operation, now_datetime(), token=token)
		self.assertEqual(labor, {"status": "failed", "error": "Not a machine operation"})

	def test_page_context(self) -> None:
		from employee_timeclock.www.job_timeclock import index

		context = frappe._dict()
		index.get_context(context)

		self.assertTrue(context.csrf_token)
		self.assertEqual(context.sitename, frappe.local.site)
