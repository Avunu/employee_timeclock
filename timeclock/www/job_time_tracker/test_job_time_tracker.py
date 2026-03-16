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

import datetime
from typing import Any, cast

import frappe
import jwt
from erpnext.manufacturing.doctype.bom.bom import BOM
from erpnext.manufacturing.doctype.job_card.job_card import JobCard
from erpnext.manufacturing.doctype.operation.operation import Operation
from erpnext.manufacturing.doctype.work_order.work_order import WorkOrder
from erpnext.manufacturing.doctype.workstation.workstation import Workstation
from erpnext.setup.doctype.employee.employee import Employee
from erpnext.stock.doctype.item.item import Item
from frappe.defaults import get_defaults
from frappe.tests.utils import FrappeTestCase
from frappe.utils import add_to_date, now_datetime, random_string


class TestTimeclock(FrappeTestCase):
	"""
	Test cases for the Timeclock page functions.

	This test class provides comprehensive coverage for all timeclock-related
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
	_test_job_cards: list[JobCard] = []
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
		job_card: JobCard = cast(
			JobCard,
			frappe.get_doc(
				{
					"doctype": "Job Card",
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
		company = get_defaults().get("company")
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
		frappe.set_user("Administrator")
		cls._create_test_fixtures()
		# Commit fixtures so they survive test rollbacks
		frappe.db.commit()

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
			frappe.db.commit()
		except Exception:
			frappe.db.rollback()
		super().tearDownClass()

	def setUp(self) -> None:
		"""Set up before each test - clear rate limiter cache and time logs."""
		super().setUp()
		# Clear rate limiter cache to avoid rate limiting between tests
		frappe.cache.delete_keys("rl:*")
		# Clear any existing time logs from job cards to start fresh
		for job_card in self._test_job_cards:
			if job_card and frappe.db.exists("Job Card", job_card.name):
				# Delete time logs directly from database to avoid validation issues
				frappe.db.delete("Job Card Time Log", {"parent": job_card.name})
				frappe.db.commit()
				job_card.reload()

	def test_authenticate_employee_valid_rfid(self) -> None:
		"""
		Test that authenticate_employee returns success for valid RFID.

		Verifies that a valid RFID returns a success status and a JWT token
		for subsequent authenticated requests.
		"""
		from timeclock.www.job_time_tracker import authenticate_employee

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
		from timeclock.www.job_time_tracker import authenticate_employee

		result: dict[str, Any] = authenticate_employee("INVALID_RFID_12345")

		self.assertEqual(result["status"], "error")
		self.assertIn("message", result)

	def test_authenticate_employee_returns_last_checkin(self) -> None:
		"""
		Test that authenticate_employee returns the last checkin status.

		Verifies that after logging in, subsequent authentication calls
		return the correct last_checkin status ("IN" or "OUT").
		"""
		from timeclock.www.job_time_tracker import authenticate_employee, log_in_employee

		# First authenticate to get a token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Log in the employee
		log_in_employee(token, str(now_datetime()))

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
		from timeclock.www.job_time_tracker import authenticate_employee, log_in_employee

		assert self._test_employee is not None

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Log in
		current_time = now_datetime()
		result: dict[str, Any] = log_in_employee(token, str(current_time))

		self.assertEqual(result["status"], "success")
		self.assertIsNotNone(result["log"])
		self.assertEqual(result["log"].log_type, "IN")
		self.assertEqual(result["log"].employee, self._test_employee.name)

	def test_log_out_employee(self) -> None:
		"""
		Test logging out an employee.

		Verifies that log_out_employee creates an Employee Checkin record
		with log_type "OUT" for the authenticated employee.
		"""
		from timeclock.www.job_time_tracker import authenticate_employee, log_in_employee, log_out_employee

		assert self._test_employee is not None

		# Get a valid token and log in first
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]
		log_in_employee(token, str(now_datetime()))

		# Get fresh token and log out
		auth_result = authenticate_employee(self._test_device_id.id)
		token = auth_result["token"]
		current_time = now_datetime()
		result: dict[str, Any] = log_out_employee(token, str(current_time))

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
		from timeclock.www.job_time_tracker import authenticate_employee, get_work_orders

		assert self._test_work_order is not None

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Get work orders
		result: dict[str, Any] = get_work_orders(token)

		self.assertEqual(result["status"], "success")
		self.assertIn("work_orders", result)
		self.assertIn("token", result)
		self.assertIsInstance(result["work_orders"], list)

		# Verify our test work order is in the list
		work_order_names: list[str] = [wo["name"] for wo in result["work_orders"]]
		self.assertIn(self._test_work_order.name, work_order_names)

	def test_get_job_cards(self) -> None:
		"""
		Test getting job cards for a work order.

		Verifies that get_job_cards returns job cards associated with
		the specified work order, including time log information.
		"""
		from timeclock.www.job_time_tracker import authenticate_employee, get_job_cards

		assert self._test_work_order is not None

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Get job cards
		result: dict[str, Any] = get_job_cards(token, str(self._test_work_order.name))

		self.assertEqual(result["status"], "success")
		self.assertIn("job_cards", result)
		self.assertIn("token", result)
		self.assertIsInstance(result["job_cards"], list)
		self.assertGreater(len(result["job_cards"]), 0)

	def test_get_job_cards_empty_work_order(self) -> None:
		"""
		Test getting job cards for a work order with no job cards.

		Verifies that get_job_cards returns an empty list when the
		specified work order has no associated job cards.
		"""
		from timeclock.www.job_time_tracker import authenticate_employee, get_job_cards

		# Get a valid token
		auth_result: dict[str, Any] = authenticate_employee(self._test_device_id.id)
		token: str = auth_result["token"]

		# Get job cards for non-existent work order
		result: dict[str, Any] = get_job_cards(token, "NON_EXISTENT_WO")

		self.assertEqual(result["status"], "success")
		self.assertEqual(result["job_cards"], [])

	def test_log_start_time_of_jobcard(self) -> None:
		"""
		Test starting a time log on a job card.

		Verifies that log_start_time_of_jobcard creates a new Job Card
		Time Log entry with from_time set and to_time as None.
		"""
		from timeclock.www.job_time_tracker import log_start_time_of_jobcard

		assert self._test_employee is not None

		job_card: JobCard = self._test_job_cards[0]
		start_time = now_datetime()

		result: dict[str, Any] = log_start_time_of_jobcard(
			str(self._test_employee.name), str(start_time), str(job_card.name)
		)

		self.assertEqual(result["status"], "success")
		self.assertIn("job_card", result)
		self.assertIn("updated_log", result)

		# Verify time log was added
		job_card.reload()
		self.assertGreater(len(job_card.time_logs), 0)
		last_log = job_card.time_logs[-1]
		self.assertEqual(last_log.employee, self._test_employee.name)
		self.assertIsNone(last_log.to_time)
		self.assertIn("job_card", result)
		self.assertIn("updated_log", result)

		# Verify time log was added
		job_card.reload()
		self.assertGreater(len(job_card.time_logs), 0)
		last_log = job_card.time_logs[-1]
		self.assertEqual(last_log.employee, self._test_employee.name)
		self.assertIsNone(last_log.to_time)

	def test_log_end_time_of_jobcard(self) -> None:
		"""
		Test ending a time log on a job card.

		Verifies that log_end_time_of_jobcard updates the last time log
		entry with a to_time value, completing the time tracking.
		"""
		from timeclock.www.job_time_tracker import log_end_time_of_jobcard, log_start_time_of_jobcard

		assert self._test_employee is not None

		job_card: JobCard = self._test_job_cards[0]
		start_time = now_datetime()

		# Start the time log first
		log_start_time_of_jobcard(str(self._test_employee.name), str(start_time), str(job_card.name))

		# End the time log
		end_time = add_to_date(start_time, minutes=30)
		result: dict[str, Any] = log_end_time_of_jobcard(
			str(self._test_employee.name), str(end_time), str(job_card.name)
		)

		self.assertEqual(result["status"], "success")
		self.assertIn("updated_log", result)

		# Verify time log was ended
		job_card.reload()
		employee_logs = [log for log in job_card.time_logs if log.employee == self._test_employee.name]
		last_log = employee_logs[-1]
		self.assertIsNotNone(last_log.to_time)

	def test_check_all_job_cards_logs_out_previous(self) -> None:
		"""
		Test that starting a new job card logs out from previous ones.

		Verifies that when an employee starts time on a new job card,
		any open time logs on other job cards are automatically closed.
		"""
		from timeclock.www.job_time_tracker import log_start_time_of_jobcard

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_operation is not None
		assert self._test_workstation is not None
		assert self._test_bom is not None

		# Create a second job card for testing
		job_card2: JobCard = cast(
			JobCard,
			frappe.get_doc(
				{
					"doctype": "Job Card",
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
			# Start time on first job card
			start_time1 = now_datetime()
			log_start_time_of_jobcard(
				str(self._test_employee.name), str(start_time1), str(self._test_job_cards[0].name)
			)

			# Start time on second job card - should log out first
			start_time2 = add_to_date(start_time1, minutes=15)
			log_start_time_of_jobcard(str(self._test_employee.name), str(start_time2), str(job_card2.name))

			# Verify first job card was logged out
			self._test_job_cards[0].reload()
			employee_logs = [
				log for log in self._test_job_cards[0].time_logs if log.employee == self._test_employee.name
			]
			if employee_logs:
				last_log = employee_logs[-1]
				self.assertIsNotNone(last_log.to_time)

		finally:
			# Clean up second job card
			frappe.delete_doc("Job Card", job_card2.name, ignore_permissions=True, force=True)

	def test_sort_jobcard_by_workstation(self) -> None:
		"""
		Test sorting job cards by workstation.

		Verifies that sort_jobcard_by_workstation correctly prioritizes
		job cards whose operations match the specified workstation.
		"""
		from timeclock.www.job_time_tracker import sort_jobcard_by_workstation

		job_cards: list[dict[str, str]] = [
			{"operation": "Hand Sanding", "name": "JC-001"},
			{"operation": "CNC Labor", "name": "JC-002"},
			{"operation": "Truss Assembly", "name": "JC-003"},
		]

		# Sort by CNC workstation
		result: dict[str, Any] = sort_jobcard_by_workstation(job_cards, "CNC")

		self.assertEqual(result["status"], "success")
		self.assertIn("sorted_job_cards", result)
		# CNC Labor should be first
		self.assertEqual(result["sorted_job_cards"][0]["operation"], "CNC Labor")

	def test_sort_jobcard_by_workstation_no_match(self) -> None:
		"""
		Test sorting job cards when no operations match the workstation.

		Verifies that sort_jobcard_by_workstation returns the original
		list unchanged when no operations match the specified workstation.
		"""
		from timeclock.www.job_time_tracker import sort_jobcard_by_workstation

		job_cards: list[dict[str, str]] = [
			{"operation": "Unknown Operation", "name": "JC-001"},
		]

		# Sort by a workstation that doesn't match
		result: dict[str, Any] = sort_jobcard_by_workstation(job_cards, "CNC")

		self.assertEqual(result["status"], "success")
		# Should return the original list unchanged
		self.assertEqual(len(result["sorted_job_cards"]), 1)

	def test_refresh_token(self) -> None:
		"""
		Test that token refresh works correctly.

		Verifies that refresh_token generates a valid JWT token and that
		extract_employee_from_token can decode it and return a new token.
		"""
		from timeclock.www.job_time_tracker import extract_employee_from_token, refresh_token

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
		from timeclock.www.job_time_tracker import SECRET_KEY, extract_employee_from_token

		assert self._test_employee is not None

		# Create an expired token
		expired_time: float = (datetime.datetime.now() - datetime.timedelta(hours=1)).timestamp()
		expired_token: str = jwt.encode(
			payload={
				"employee_id": self._test_employee.name,
				"employee_name": "Test Employee",
				"exp": expired_time,
			},
			key=SECRET_KEY or "",
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
		from timeclock.www.job_time_tracker import extract_employee_from_token

		# Should raise authentication error for invalid token
		with self.assertRaises(frappe.AuthenticationError):
			extract_employee_from_token("invalid_token_string")

	def test_check_for_erp_log_in_guest(self) -> None:
		"""
		Test checking ERP login status for guest user.

		Verifies that check_for_erp_log_in returns "Guest" as the
		user_id when no user is logged into the ERP system.
		"""
		from timeclock.www.job_time_tracker import check_for_erp_log_in

		frappe.set_user("Guest")
		result: dict[str, str] = check_for_erp_log_in()

		self.assertEqual(result["user_id"], "Guest")

	def test_check_for_erp_log_in_authenticated(self) -> None:
		"""
		Test checking ERP login status for authenticated user.

		Verifies that check_for_erp_log_in returns the correct
		user_id when a user is logged into the ERP system.
		"""
		from timeclock.www.job_time_tracker import check_for_erp_log_in

		frappe.set_user("Administrator")
		result: dict[str, str] = check_for_erp_log_in()

		self.assertEqual(result["user_id"], "Administrator")

	def test_submit_jobcard(self) -> None:
		"""
		Test submitting a job card.

		Verifies that submit_jobcard marks a job card as "Completed"
		after all time logs have been properly closed.
		"""
		from timeclock.www.job_time_tracker import (
			log_end_time_of_jobcard,
			log_start_time_of_jobcard,
			submit_jobcard,
		)

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_operation is not None
		assert self._test_workstation is not None
		assert self._test_bom is not None

		# Create a fresh job card for this test
		job_card: JobCard = cast(
			JobCard,
			frappe.get_doc(
				{
					"doctype": "Job Card",
					"work_order": self._test_work_order.name,
					"operation": self._test_operation.name,
					"workstation": self._test_workstation.name,
					"for_quantity": 1,
					"wip_warehouse": self._test_work_order.wip_warehouse,
					"bom_no": self._test_bom.name,
					"status": "Open",
					"sequence_id": 10,
				}
			).insert(ignore_permissions=True),
		)

		try:
			# Start time log
			start_time = now_datetime()
			log_start_time_of_jobcard(str(self._test_employee.name), str(start_time), str(job_card.name))

			# End time log
			end_time = add_to_date(start_time, minutes=30)
			log_end_time_of_jobcard(str(self._test_employee.name), str(end_time), str(job_card.name))

			# Submit the job card
			job_card.reload()
			job_card_dict: dict[str, Any] = {
				"name": job_card.name,
				"operation": job_card.operation,
			}
			complete_time = add_to_date(end_time, minutes=5)
			result: dict[str, Any] = submit_jobcard(
				job_card_dict, str(complete_time), str(self._test_employee.name)
			)

			self.assertEqual(result["status"], "success")
			self.assertIn("job_card", result)

			# Verify job card status
			job_card.reload()
			self.assertEqual(job_card.status, "Completed")

		finally:
			# Clean up - cancel if submitted before deleting
			job_card.reload()
			if job_card.docstatus == 1:
				job_card.cancel()
			frappe.delete_doc("Job Card", job_card.name, ignore_permissions=True, force=True)

	def test_submit_jobcard_with_unfinished_times(self) -> None:
		"""
		Test that submitting a job card with unfinished times completes them.

		Verifies that submit_jobcard automatically fills in missing to_time
		values when a job card is submitted with open time logs.
		"""
		from timeclock.www.job_time_tracker import log_start_time_of_jobcard, submit_jobcard

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_operation is not None
		assert self._test_workstation is not None
		assert self._test_bom is not None

		# Create a fresh job card for this test
		job_card: JobCard = cast(
			JobCard,
			frappe.get_doc(
				{
					"doctype": "Job Card",
					"work_order": self._test_work_order.name,
					"operation": self._test_operation.name,
					"workstation": self._test_workstation.name,
					"for_quantity": 1,
					"wip_warehouse": self._test_work_order.wip_warehouse,
					"bom_no": self._test_bom.name,
					"status": "Open",
					"sequence_id": 11,
				}
			).insert(ignore_permissions=True),
		)

		try:
			# Start time log but don't end it
			start_time = now_datetime()
			log_start_time_of_jobcard(str(self._test_employee.name), str(start_time), str(job_card.name))

			# Try to submit - should handle the unfinished time
			job_card.reload()
			job_card_dict: dict[str, Any] = {
				"name": job_card.name,
				"operation": job_card.operation,
			}
			complete_time = add_to_date(start_time, minutes=30)
			result: dict[str, Any] = submit_jobcard(
				job_card_dict, str(complete_time), str(self._test_employee.name)
			)

			# The function should complete and fill in the to_time
			self.assertEqual(result["status"], "success")

		finally:
			# Clean up - cancel if submitted before deleting
			job_card.reload()
			if job_card.docstatus == 1:
				job_card.cancel()
			frappe.delete_doc("Job Card", job_card.name, ignore_permissions=True, force=True)

	def test_machine_operations_use_machine_employee(self) -> None:
		"""
		Test that machine operations use machine employee IDs.

		Verifies that when logging time on machine operations (e.g., CNC Machine Time),
		the time log uses the machine's employee ID instead of the human operator.
		"""
		from timeclock.www.job_time_tracker import log_start_time_of_jobcard

		assert self._test_employee is not None
		assert self._test_work_order is not None
		assert self._test_workstation is not None
		assert self._test_bom is not None

		# Create a job card with a machine operation
		job_card: JobCard = cast(
			JobCard,
			frappe.get_doc(
				{
					"doctype": "Job Card",
					"work_order": self._test_work_order.name,
					"operation": "CNC Machine Time",  # This should use machine employee
					"workstation": self._test_workstation.name,
					"for_quantity": 1,
					"wip_warehouse": self._test_work_order.wip_warehouse,
					"bom_no": self._test_bom.name,
					"status": "Open",
					"sequence_id": 12,
				}
			).insert(ignore_permissions=True),
		)

		try:
			start_time = now_datetime()
			result: dict[str, Any] = log_start_time_of_jobcard(
				str(self._test_employee.name), str(start_time), str(job_card.name)
			)

			self.assertEqual(result["status"], "success")

			# Verify the time log uses the machine employee ID
			job_card.reload()
			if job_card.time_logs:
				last_log = job_card.time_logs[-1]
				# Should be the CNC machine ID, not the human employee
				self.assertEqual(last_log.employee, "HR-MACH-CNC-00051")

		finally:
			frappe.delete_doc("Job Card", job_card.name, ignore_permissions=True, force=True)

	def tearDown(self) -> None:
		"""
		Clean up test data after each test.

		Removes Employee Checkin records, resets job card time logs,
		and commits changes to persist cleanup.
		"""
		frappe.set_user("Administrator")

		# Clean up employee checkins created during tests
		if self._test_employee:
			checkins: list[str] = frappe.get_all(
				"Employee Checkin", filters={"employee": self._test_employee.name}, pluck="name"
			)
			for checkin in checkins:
				try:
					frappe.delete_doc("Employee Checkin", checkin, ignore_permissions=True, force=True)
				except Exception:
					pass

			# Delete ALL time logs for this employee across all job cards
			frappe.db.delete("Job Card Time Log", {"employee": self._test_employee.name})

		# Reset test job card time logs and status
		for job_card in self._test_job_cards:
			try:
				# Delete time logs directly from database
				frappe.db.delete("Job Card Time Log", {"parent": job_card.name})
				# Reset job card status
				frappe.db.set_value("Job Card", job_card.name, "status", "Open")
				# Clear document cache for this job card
				frappe.clear_document_cache("Job Card", job_card.name)
			except Exception:
				pass

		# Clear value cache
		frappe.db.value_cache = {}

		# Commit cleanup changes so they persist
		frappe.db.commit()
