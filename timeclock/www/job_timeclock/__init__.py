import datetime
from typing import Any, cast

import frappe
import jwt
from erpnext.manufacturing.doctype.job_card.job_card import JobCard
from erpnext.manufacturing.doctype.job_card_time_log.job_card_time_log import (
	JobCardTimeLog,
)
from frappe import _
from frappe.query_builder import DocType, Case
from frappe.query_builder.functions import Coalesce, Sum
from frappe.rate_limiter import rate_limit
from frappe.utils.data import get_datetime

from timeclock.timeclock.custom.employee_checkin import EmployeeCheckin

# import secret key from site_config.json
SECRET_KEY = frappe.get_site_config().get("encryption_key")

# List of "Machine employees" to be able to run machines same time as other processes.
MACHINE_OPERATIONS: dict[str, str] = {
	"Machine Staining Hours": "HR-MACH-ST-00052",
	"Sanding Machine Hours": "HR-MACH-SA-00053",
	"CNC Machine Time": "HR-MACH-CNC-00051",
	"Planing Machine Time": "HR-MACH-PL-00054",
}


def _resolve_job_card_name(
	work_order: str, operation: str, *, corrective: bool = False
) -> str | None:
	"""Resolve work_order + operation to a Job Card name.

	Args:
		work_order: Work Order name
		operation: Operation name (e.g. "CNC Machine Time")
		corrective: If True, find the corrective card for this operation

	Returns:
		Job Card name string, or None if not found
	"""
	filters: dict[str, Any] = {
		"work_order": work_order,
		"operation": operation,
		"is_corrective_job_card": 1 if corrective else 0,
		"docstatus": ["<", 2],
	}
	return cast(str | None, frappe.db.get_value("Job Card", filters, "name"))


def refresh_token(employee_id: str) -> str:
	"""
	Generate a new JWT token for an employee with 30-minute expiration.

	Creates a fresh JWT token containing the employee ID, name, and expiration timestamp.
	Used to maintain authentication sessions and extend login time.

	Args:
		employee_id: The employee's unique identifier

	Returns:
		Encoded JWT token string valid for 30 minutes

	Raises:
		None
	"""
	employee_name = frappe.get_value("Employee", {"employee": employee_id}, "employee_name")
	# If valid, generate a JWT
	expires: float = (datetime.datetime.now() + datetime.timedelta(minutes=30)).timestamp()
	token: str = jwt.encode(
		payload={
			"employee_id": employee_id,
			"employee_name": employee_name,
			"exp": expires,
		},
		key=SECRET_KEY or "",
		algorithm="HS256",
	)

	return token


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=1, seconds=1)
def authenticate_employee(rfid: str) -> dict[str, Any]:
	"""
	Authenticate an employee using their RFID badge.

	Validates the RFID against the database and generates a JWT token for the employee.
	Also retrieves the last check-in status to determine if the employee is clocked in or out.

	Args:
		rfid: The RFID identifier from the employee's badge

	Returns:
		Dict containing:
			- status: "success" or "error"
			- message: Error message if authentication failed
			- last_checkin: The last check-in type ("IN" or "OUT") if successful
			- token: JWT authentication token if successful

	Raises:
		None: Returns error dict instead of raising exceptions
	"""
	# mac_address = getmac.get_mac_address()
	# Validate the RFID against the database
	employee_id = frappe.get_value("Attendance Device ID", {"id": rfid}, "parent")

	if not employee_id:
		return {"status": "error", "message": ("Invalid RFID")}

	# If valid, generate a JWT
	token = refresh_token(str(employee_id))

	# get the last employee checkin to see if the employee is clocked in or out
	EmployeeCheckinDT = DocType("Employee Checkin")
	last_checkin: list[str] = (
		frappe.qb.from_(EmployeeCheckinDT)
		.select(EmployeeCheckinDT.log_type)
		.where(EmployeeCheckinDT.employee == employee_id)
		.orderby(EmployeeCheckinDT.modified, order=frappe.qb.desc)
		.limit(1)
		.run(pluck="log_type")
	)

	# get the last Job Card Time Log where there is no to_time to see if a timer is running
	# open_job_card_time_log = frappe.get_list("Job Card Time Log",
	#                                             filters={"employee": employee_id,
	#                                                      "to_time": None},
	#                                             order_by="modified desc",
	#                                             limit=1,
	#                                             ignore_permissions=True,
	#                                             pluck="name")

	# if (open_job_card_time_log):
	#     open_job_card_name = frappe.get_value("Job Card Time Log", open_job_card_time_log, "parent")
	#     open_job_card = frappe.get_doc("Job Card", open_job_card_name)

	# check to see if there is any Job Card Time Log that was started but not ended

	return {
		"status": "success",
		"last_checkin": last_checkin[0] if last_checkin else None,
		"token": token,
	}


def extract_employee_from_token(token: str) -> tuple[str, str]:
	"""
	Extract and validate employee ID from JWT token.

	Decodes the JWT token using the secret key, validates the employee ID,
	and generates a refreshed token with extended expiration time.

	Args:
		token: JWT token string to decode

	Returns:
		Tuple containing:
			- employee_id: The authenticated employee's ID
			- refreshed_token: New JWT token with extended expiration

	Raises:
		frappe.AuthenticationError: If token is expired or invalid
	"""
	try:
		# Decode the JWT using the same secret key
		payload: dict[str, Any] = jwt.decode(token, SECRET_KEY or "", algorithms=["HS256"])
		employee_id: str | None = payload.get("employee_id")

		if not employee_id:
			raise jwt.InvalidTokenError

		# refresh the token
		refreshed_token: str = refresh_token(employee_id)

		return employee_id, refreshed_token

	except jwt.ExpiredSignatureError:
		# The token has expired
		frappe.throw(
			_("Token has expired. Please re-authenticate."),
			exc=frappe.AuthenticationError,
		)
		raise  # This line will never be reached but satisfies type checker

	except jwt.InvalidTokenError:
		# The token is invalid for some other reason
		frappe.throw(_("Invalid token. Please re-authenticate."), exc=frappe.AuthenticationError)
		raise  # This line will never be reached but satisfies type checker

	# return {
	#     "status": "success",
	#     "last_checkin": last_checkin[0] if last_checkin else None,
	#     "open_job_card": open_job_card.name if open_job_card_time_log else None,
	#     "token": token}


@frappe.whitelist(allow_guest=True)
def log_in_employee(token: str, time: str) -> dict[str, Any]:
	"""
	Log an employee's clock-in (IN) time.

	Creates a new Employee Checkin record with log_type "IN" for the authenticated employee.
	The checkin is created from the Job Timeclock Scanner device.

	Args:
		token: JWT authentication token for the employee
		time: Timestamp string for the check-in time

	Returns:
		Dict containing:
			- status: "success" or "unsuccessful"
			- log: The created EmployeeCheckin object

	Raises:
		None: Catches exceptions and returns unsuccessful status
	"""

	employee_id, token = extract_employee_from_token(token)

	new_log = EmployeeCheckin("Employee Checkin", {})
	new_log.employee = employee_id
	new_log.time = time
	new_log.log_type = "IN"
	new_log.manual_override = False
	new_log.device_id = "Job Timeclock Scanner"
	try:
		new_log.insert(ignore_permissions=True)
	except Exception as _e:
		pass
	if new_log:
		return {"status": "success", "log": new_log}
	else:
		return {"status": "unsuccessful", "log": new_log}

	# try:
	#     new_log.insert(ignore_permissions= True)
	#     return {"status":"success", "log": new_log}
	# except:
	#     return {"status":"unsuccessful", "log": new_log}


# Issue with logout. The log is made but _unsaved = True. so its not passing to workday management
@frappe.whitelist(allow_guest=True)
def log_out_employee(token: str, time: str) -> dict[str, Any]:
	"""
	Log an employee's clock-out (OUT) time.

	Creates a new Employee Checkin record with log_type "OUT" for the authenticated employee.
	The checkin is created from the Job Timeclock Scanner device.

	Args:
		token: JWT authentication token for the employee
		time: Timestamp string for the check-out time

	Returns:
		Dict containing:
			- status: "success" or "unsuccessful"
			- log: The created EmployeeCheckin object

	Raises:
		None: Catches exceptions and returns unsuccessful status
	"""
	employee_id, token = extract_employee_from_token(token)

	new_log = EmployeeCheckin("Employee Checkin", {})
	new_log.employee = employee_id
	new_log.time = time
	new_log.log_type = "OUT"
	new_log.manual_override = False
	new_log.device_id = "Job Timeclock Scanner"
	try:
		new_log.insert(ignore_permissions=True)
		new_log.save()
	except Exception as _e:
		pass
	if new_log:
		return {"status": "success", "log": new_log}
	else:
		return {"status": "unsuccessful", "log": new_log}


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=1, seconds=1)
def get_work_orders(token: str) -> dict[str, Any]:
	"""
	Retrieve all active work orders for display in the job timeclock.

	Fetches work orders with status of "Submitted", "Not Started", or "In Process".
	Authenticates the employee via JWT token before retrieving work orders.

	Args:
		token: JWT authentication token for the employee

	Returns:
		Dict containing:
			- status: "success" or "error"
			- token: Refreshed JWT token
			- work_orders: List of work order dicts with name, production_item, and status
			- message: Error message if authentication failed

	Raises:
		None: Returns error dict on exception
	"""
	frappe.publish_realtime("test", "aye yooooo")

	try:
		employee_id, token = extract_employee_from_token(token)
	except Exception as e:
		return {"status": "error", "message": str(e)}

	# Get the employee's work orders
	# work order status can be Submitted, Not Started, or In Process
	WorkOrders = DocType("Work Order")
	work_orders: list[dict[str, Any]] = (
		frappe.qb.from_(WorkOrders)
		.select(WorkOrders.name, WorkOrders.production_item, WorkOrders.status)
		.where(WorkOrders.status.isin(["Submitted", "Not Started", "In Process"]))
		.run(as_dict=True)
	)
	return {"status": "success", "token": token, "work_orders": work_orders}


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=4, seconds=1)
def get_operations(token: str, work_order: str) -> dict[str, Any]:
	"""
	Retrieve all operations for a work order with aggregated time totals.

	Anchors on the Work Order Operation child table and LEFT JOINs through
	Job Card → Job Card Time Log to aggregate regular and corrective time.

	Args:
		token: JWT authentication token for the employee
		work_order: Name/ID of the work order

	Returns:
		Dict containing:
			- status: "success" or "error"
			- token: Refreshed JWT token
			- operations: List of operation dicts with time totals

	Raises:
		None: Returns error dict on exception
	"""
	try:
		employee_id, token = extract_employee_from_token(token)
	except Exception as e:
		return {"status": "error", "message": str(e)}

	WOOp = DocType("Work Order Operation")
	JC = DocType("Job Card")
	TL = DocType("Job Card Time Log")

	# CASE: map operation -> expected employee (machine ops use machine employee)
	employee_case = Case()
	for op_name, machine_id in MACHINE_OPERATIONS.items():
		employee_case = employee_case.when(WOOp.operation == op_name, machine_id)
	employee_case = employee_case.else_(employee_id)

	results: list[dict[str, Any]] = (
		frappe.qb.from_(WOOp)
		.left_join(JC)
		.on(
			(JC.work_order == WOOp.parent)
			& (JC.operation == WOOp.operation)
			& (JC.docstatus < 2)
		)
		.left_join(TL)
		.on(TL.parent == JC.name)
		.select(
			WOOp.name.as_("work_order_operation"),
			WOOp.operation,
			WOOp.workstation,
			WOOp.time_in_mins.as_("planned_time_mins"),
			Coalesce(
				Sum(Case().when(JC.is_corrective_job_card == 0, TL.time_in_mins).else_(0)), 0
			).as_("actual_time_mins"),
			Coalesce(
				Sum(
					Case()
					.when(
						(JC.is_corrective_job_card == 0) & (TL.employee == employee_case),
						TL.time_in_mins,
					)
					.else_(0)
				),
				0,
			).as_("employee_time_mins"),
			Coalesce(
				Sum(Case().when(JC.is_corrective_job_card == 1, TL.time_in_mins).else_(0)), 0
			).as_("corrective_total_time_mins"),
			Coalesce(
				Sum(
					Case()
					.when(
						(JC.is_corrective_job_card == 1) & (TL.employee == employee_case),
						TL.time_in_mins,
					)
					.else_(0)
				),
				0,
			).as_("corrective_employee_time_mins"),
		)
		.where(WOOp.parent == work_order)
		.where(WOOp.parenttype == "Work Order")
		.groupby(WOOp.name)
		.orderby(WOOp.idx)
	).run(as_dict=True)

	operations: list[dict[str, Any]] = [
		{
			"name": row["work_order_operation"],
			"operation": row["operation"],
			"workstation": row.get("workstation", ""),
			"planned_time_mins": float(row.get("planned_time_mins", 0)),
			"actual_time_mins": float(row.get("actual_time_mins", 0)),
			"employee_time_mins": float(row.get("employee_time_mins", 0)),
			"corrective_total_time_mins": float(row.get("corrective_total_time_mins", 0)),
			"corrective_employee_time_mins": float(row.get("corrective_employee_time_mins", 0)),
		}
		for row in results
	]

	return {
		"status": "success",
		"token": token,
		"operations": operations,
	}


@frappe.whitelist(allow_guest=True)
def sort_jobcard_by_workstation(jobCards: list[dict[str, Any]], workstation: str) -> dict[str, Any]:
	"""
	Sort job cards to prioritize operations relevant to a specific workstation.

	Moves job cards with operations matching the specified workstation to the top of the list,
	making it easier for employees to find relevant work at their current workstation.

	Args:
		jobCards: List of job card dictionaries to sort
		workstation: Name of the workstation (e.g., "Planer", "CNC", "Hand Sanding")

	Returns:
		Dict containing:
			- status: "success"
			- sorted_job_cards: Reordered list with relevant operations at the top

	Raises:
		None
	"""
	operation_workstation: list[dict[str, Any]] = [
		{
			"workstation": "Planer",
			"operation": ["Planing Machine Time", "Pulling & Planing"],
		},
		{"workstation": "CNC", "operation": ["CNC Labor", "CNC Machine Time"]},
		{"workstation": "Hand Sanding", "operation": ["Hand Sanding"]},
		{
			"workstation": "Sander/Stainer",
			"operation": [
				"Sanding Machine Labor",
				"Sanding Machine Hours",
				"Machine Staining Labor",
				"Machine Staining Hours",
			],
		},
		{
			"workstation": "Truss Assembly",
			"operation": ["Truss Assembly", "Hardware Packing Labor", "Packing Labor"],
		},
		{"workstation": "T&G Cutting", "operation": ["T&G Cutting"]},
	]

	for entry in operation_workstation:
		if entry["workstation"] == workstation:
			operations: list[str] = entry["operation"]

	top_index: list[dict[str, Any]] = []
	new_jobCards: list[dict[str, Any]] = []
	waste: list[dict[str, Any]] = []
	for card in jobCards:
		for station_operation in operations:
			if card["operation"] == station_operation and card not in waste:
				top_index.append(card)
				waste.append(card)
			elif card not in new_jobCards and card not in waste:
				new_jobCards.append(card)
				waste.append(card)

	if len(top_index) == 0:
		return {"status": "success", "sorted_job_cards": jobCards}

	i: int = 0
	for index in top_index:
		new_jobCards.insert(i, index)
		i += 1

	return {"status": "success", "sorted_job_cards": new_jobCards}


def log_end_time_of_jobcard(
	employee_id: str,
	end_time: str,
	jobcard_name: str = "",
	work_order: str = "",
	operation: str = "",
) -> dict[str, Any]:
	"""
	Stop a timer on a job card by logging the end time.

	Accepts either a direct jobcard_name (used internally by check_all_job_cards)
	or work_order + operation (used by the frontend) to resolve the card.

	Args:
		employee_id: The employee stopping work on the job card
		end_time: Timestamp string for when work ends
		jobcard_name: Direct job card name (optional, for internal use)
		work_order: Work order name (used with operation to resolve card)
		operation: Operation name (used with work_order to resolve card)

	Returns:
		Dict containing:
			- status: "success" or "failed"
			- updated_log: The complete list of time logs
			- job_card: The JobCard object if failed

	Raises:
		None: Returns failed status on exception
	"""
	if not jobcard_name and work_order and operation:
		jobcard_name = _resolve_job_card_name(work_order, operation) or ""
	if not jobcard_name:
		return {"status": "failed", "error": "Job card not found"}

	job_card: JobCard = JobCard("Job Card", jobcard_name, ignore_permissions=True)

	if job_card.operation in MACHINE_OPERATIONS.keys():
		for key, machine_id in MACHINE_OPERATIONS.items():
			if key == job_card.operation:
				employee_id = machine_id
				break

	# Find the last time log for this employee (with no to_time)
	employee_logs: list[JobCardTimeLog] = [
		log for log in job_card.time_logs if log.employee == employee_id and not log.to_time
	]

	if not employee_logs:
		return {
			"status": "failed",
			"error": "No active time log found for this employee",
		}

	last_time_log: JobCardTimeLog = employee_logs[-1]
	last_time_log.to_time = end_time

	try:
		job_card.save(ignore_permissions=True)
		updated_log: list[JobCardTimeLog] = job_card.time_logs
		return {
			"status": "success",
			"updated_log": updated_log,
		}
	except Exception as e:
		frappe.log_error("Error Ending Time Log", e)
		return {"status": "failed", "job_card": job_card, "error": str(e)}


# Function to check out employee of a job card, when they start a new one.
@frappe.whitelist(allow_guest=True)
def check_all_job_cards(employee_id: str, time: str) -> str | list[Any]:
	"""
	Clock out an employee from all active job cards across all work orders.

	Searches through all active work orders (Not Started or In Process) to find
	job cards where the employee has an open time log (no end time). Automatically
	closes all such time logs with the provided time. Excludes machine operations.

	Args:
		employee_id: The employee to clock out from active job cards
		time: Timestamp string to use as the end time for open logs

	Returns:
		Union of:
			- String: "no cards logged out" if no active cards found
			- List: List of time log objects that were closed

	Raises:
		None
	"""
	# work_orders = frappe.db.get_list('Work Order', filters=[{
	#     'status':'Not Started'}, {'status':'In Process'}], pluck='name')
	work_orders: list[dict[str, Any]] = frappe.db.get_list(
		"Work Order",
		or_filters=[{"status": "Not Started"}, {"status": "In Process"}],
		fields=["name", "status"],
		ignore_permissions=True,
	)

	# Get all job cards and check for employee id
	job_cards_list: list[Any] = []
	for work_order in work_orders:
		# get job cards by work
		job_cards: list[Any] = frappe.db.get_list(
			"Job Card",
			filters={"work_order": work_order["name"]},
			fields=["name"],
			ignore_permissions=True,
		)

		if len(job_cards) == 0:
			pass
		else:
			for job_card in job_cards:
				full_job_card: JobCard = JobCard("Job Card", job_card.name, ignore_permissions=True)
				job_card.time_logs = full_job_card.time_logs

				duplicate = []
				for log in job_card.time_logs:
					if log.employee == employee_id and job_card not in duplicate:
						job_cards_list.append(job_card)
						duplicate.append(job_card)
	# Exit if no job cards are found with employee.
	if len(job_cards_list) == 0:
		return "no cards logged out"

	# Go through job cards for employee
	card_logged_out: list[Any] = []
	for card in job_cards_list:
		# job_card = frappe.get_doc('Job Card', card.name, ignore_permissions = True)
		for log in card.time_logs:
			if (
				not log.to_time
				and card
				and (card.operation not in MACHINE_OPERATIONS.keys())
				and log.employee == employee_id
			):
				log_end_time_of_jobcard(employee_id, time, card.name)
				card_logged_out.append(log)
			else:
				pass

	if len(card_logged_out) == 0:
		return "no cards logged out"
	# return {'card_logged_out':card_logged_out, 'employee':employee_id}
	return card_logged_out


@frappe.whitelist(allow_guest=True)
def get_active_timer(token: str) -> dict[str, Any]:
	"""
	Get the currently running timer for the authenticated employee.

	Searches across all work orders for an open time log (no to_time)
	belonging to this employee or any of their machine employee IDs.

	Args:
		token: JWT authentication token for the employee

	Returns:
		Dict containing:
			- status: "success" or "error"
			- token: Refreshed JWT token
			- active_timer: Dict with work_order, operation, from_time,
			  is_corrective (or None if no timer running)

	Raises:
		None: Returns error dict on exception
	"""
	try:
		employee_id, token = extract_employee_from_token(token)
	except Exception as e:
		return {"status": "error", "message": str(e)}

	JC = DocType("Job Card")
	TL = DocType("Job Card Time Log")

	# Employee could be logged under their own ID or a machine employee ID
	employee_ids: list[str] = [employee_id] + list(MACHINE_OPERATIONS.values())

	result: list[dict[str, Any]] = (
		frappe.qb.from_(TL)
		.inner_join(JC)
		.on(TL.parent == JC.name)
		.select(
			JC.work_order,
			JC.operation,
			TL.from_time,
			JC.is_corrective_job_card,
		)
		.where(JC.docstatus < 2)
		.where(TL.time_in_mins == 0)
		.where(TL.to_time.isnull())
		.where(TL.employee.isin(employee_ids))
		.limit(1)
	).run(as_dict=True)

	active_timer: dict[str, Any] | None = None
	if result:
		row = result[0]
		active_timer = {
			"work_order": row["work_order"],
			"operation": row["operation"],
			"from_time": row["from_time"],
			"is_corrective": bool(row["is_corrective_job_card"]),
		}

	return {"status": "success", "token": token, "active_timer": active_timer}


@frappe.whitelist(allow_guest=True)
def start_timer(
	employee_id: str,
	work_order: str,
	operation: str,
	start_time: str,
	is_corrective: bool = False,
) -> dict[str, Any]:
	"""
	Start a timer on a job card (regular or corrective).

	Resolves the work_order + operation to the underlying Job Card.
	For corrective timers, finds or creates a corrective Job Card.
	For machine operations, uses the machine employee ID.
	Automatically clocks out the employee from any other active timers.

	Args:
		employee_id: The employee starting work
		work_order: Work order name
		operation: Operation name
		start_time: Timestamp string for when work begins
		is_corrective: Whether this is a corrective (rework) timer

	Returns:
		Dict containing:
			- status: "success" or "failed"
			- error: Error message string if failed

	Raises:
		None: Catches and logs exceptions
	"""
	# Resolve the original (non-corrective) job card
	jobcard_name = _resolve_job_card_name(work_order, operation) or ""
	if not jobcard_name:
		return {"status": "failed", "error": "Job card not found for this operation"}

	# Determine effective employee (machine ops use machine employee)
	log_employee = employee_id
	if operation in MACHINE_OPERATIONS:
		log_employee = MACHINE_OPERATIONS[operation]

	try:
		if is_corrective:
			original_job_card: JobCard = JobCard("Job Card", jobcard_name, ignore_permissions=True)

			# Find or create corrective job card
			existing_corrective = frappe.db.get_value(
				"Job Card", {"for_job_card": jobcard_name, "is_corrective_job_card": 1}, "name"
			)

			if existing_corrective:
				target_card: JobCard = JobCard("Job Card", existing_corrective, ignore_permissions=True)
				target_card.reload()
			else:
				target_card = cast(JobCard, frappe.new_doc("Job Card"))
				target_card.update(
					{
						"work_order": original_job_card.work_order,
						"bom_no": original_job_card.bom_no,
						"production_item": original_job_card.production_item,
						"operation": original_job_card.operation,
						"workstation": original_job_card.workstation,
						"for_quantity": 0,
						"wip_warehouse": original_job_card.wip_warehouse,
						"is_corrective_job_card": 1,
						"for_job_card": jobcard_name,
						"hour_rate": original_job_card.hour_rate,
						"project": original_job_card.project,
						"company": original_job_card.company,
						"sequence_id": original_job_card.sequence_id,
						"operation_id": original_job_card.operation_id,
					}
				)

			target_card.append("time_logs", {"from_time": start_time, "employee": log_employee})
			target_card.save(ignore_permissions=True)
		else:
			# Regular timer — clock out from other active cards first
			if operation in MACHINE_OPERATIONS:
				check_all_job_cards(log_employee, start_time)
			else:
				check_all_job_cards(employee_id, start_time)

			job_card: JobCard = JobCard("Job Card", jobcard_name, ignore_permissions=True)
			job_card.reload()
			job_card.append("time_logs", {"from_time": start_time, "employee": log_employee})
			job_card.save(ignore_permissions=True)

		return {"status": "success"}

	except Exception as e:
		frappe.log_error("Error in start_timer", e)
		return {"status": "failed", "error": str(e)}


@frappe.whitelist(allow_guest=True)
def stop_timer(
	employee_id: str,
	work_order: str,
	operation: str,
	end_time: str,
	is_corrective: bool = False,
) -> dict[str, Any]:
	"""
	Stop a running timer on a job card (regular or corrective).

	Resolves the work_order + operation to the underlying Job Card,
	finds the open time log for this employee, and sets the end time.

	Args:
		employee_id: The employee stopping work
		work_order: Work order name
		operation: Operation name
		end_time: Timestamp string for when work ends
		is_corrective: Whether this is a corrective (rework) timer

	Returns:
		Dict containing:
			- status: "success" or "failed"
			- error: Error message string if failed

	Raises:
		None: Catches and logs exceptions
	"""
	# Resolve the original (non-corrective) job card
	jobcard_name = _resolve_job_card_name(work_order, operation) or ""
	if not jobcard_name:
		return {"status": "failed", "error": "Job card not found for this operation"}

	# Determine effective employee (machine ops use machine employee)
	log_employee = employee_id
	if operation in MACHINE_OPERATIONS:
		log_employee = MACHINE_OPERATIONS[operation]

	try:
		if is_corrective:
			corrective_name = frappe.db.get_value(
				"Job Card", {"for_job_card": jobcard_name, "is_corrective_job_card": 1}, "name"
			)
			if not corrective_name:
				return {"status": "failed", "error": "No corrective job card found"}
			target_card: JobCard = JobCard("Job Card", corrective_name, ignore_permissions=True)
			target_card.reload()
		else:
			target_card = JobCard("Job Card", jobcard_name, ignore_permissions=True)

		# Find the last open time log for this employee
		employee_logs: list[JobCardTimeLog] = [
			log for log in target_card.time_logs if log.employee == log_employee and not log.to_time
		]

		if not employee_logs:
			return {"status": "failed", "error": "No active time log found"}

		employee_logs[-1].to_time = end_time
		target_card.save(ignore_permissions=True)
		return {"status": "success"}

	except Exception as e:
		frappe.log_error("Error in stop_timer", e)
		return {"status": "failed", "error": str(e)}


@frappe.whitelist(allow_guest=True)
def check_for_erp_log_in() -> dict[str, Any]:
	"""
	Check if a user is logged into the ERP system.

	Determines whether the current session belongs to an authenticated user
	or a guest visitor by examining the frappe session.

	Args:
		None

	Returns:
		Dict containing:
			- user_id: The current user's ID or "Guest" if not logged in

	Raises:
		None
	"""
	if frappe.session.user != "Guest":
		return {"user_id": frappe.session.user}
	else:
		return {"user_id": frappe.session.user}


@frappe.whitelist(allow_guest=True)
def submit_jobcard(jobCard: dict[str, Any], complete_time: str, employee_id: str) -> dict[str, Any]:
	"""
	Complete and submit a job card by closing all open time logs.

	Closes any open time logs on the job card by setting their end time,
	marks them as completed, and updates the job card status to "Completed".

	Args:
		jobCard: Dictionary containing job card data including name and operation
		complete_time: Timestamp string for when the job was completed
		employee_id: The employee completing the job card

	Returns:
		Dict containing:
			- status: "success" or "failed"
			- job_card: The completed JobCard object if successful
			- error_message: Description of the error if failed

	Raises:
		None: Returns failed status with error message
	"""
	completed_qty: int = 1
	doc: JobCard = JobCard("Job Card", jobCard["name"], ignore_permissions=True)

	last_row: JobCardTimeLog | None = None
	if doc.time_logs and len(doc.time_logs) > 0:
		last_row = doc.time_logs[-1]

	if last_row and complete_time:
		for row in doc.time_logs:
			# Close any open time logs
			if not row.to_time:
				row.update(
					{
						"to_time": get_datetime(complete_time),
						"operation": jobCard["operation"],
					}
				)

		# Set completed_qty on the last time log to satisfy submission validation
		last_row.completed_qty = completed_qty

		doc.save(ignore_permissions=True)
		doc.submit()
		return {"status": "success", "job_card": doc}

	else:
		error_message: str = "Log has unfinished times."
		return {"status": "failed", "error_message": error_message}
