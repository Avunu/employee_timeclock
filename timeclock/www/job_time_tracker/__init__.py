import datetime
from typing import Any, cast

import frappe
import jwt
from erpnext.manufacturing.doctype.job_card.job_card import JobCard
from erpnext.manufacturing.doctype.job_card_time_log.job_card_time_log import (
	JobCardTimeLog,
)
from frappe import _
from frappe.query_builder import Case, DocType
from frappe.query_builder.functions import Coalesce, Max, Sum
from frappe.rate_limiter import rate_limit
from frappe.utils.data import get_datetime

from timeclock.timeclock.custom.employee_checkin import EmployeeCheckin

# import secret key from site_config.json
SECRET_KEY = frappe.get_site_config().get("encryption_key")


def _get_machine_employee_ids(operation: str) -> list[str]:
	"""Return the employee IDs from the Employee Group linked to a machine operation.

	If the operation has ``is_machine_time`` checked and a ``employee_group``
	set, queries the Employee Group Table for all member employee IDs.

	Args:
		operation: The Operation name.

	Returns:
		List of employee ID strings.  Empty list when the operation is not
		a machine operation or the group has no members.
	"""
	Op = DocType("Operation")
	row = (
		frappe.qb.from_(Op).select(Op.is_machine_time, Op.employee_group).where(Op.name == operation).limit(1)
	).run(as_dict=True)

	if not row or not row[0].get("is_machine_time") or not row[0].get("employee_group"):
		return []

	EGT = DocType("Employee Group Table")
	return (
		frappe.qb.from_(EGT)
		.select(EGT.employee)
		.where(EGT.parent == row[0]["employee_group"])
		.where(EGT.parenttype == "Employee Group")
		.run(pluck="employee")
	)


def _get_all_machine_employee_ids() -> list[str]:
	"""Return every machine employee ID across all machine operations.

	Queries all Operations where ``is_machine_time == 1`` and collects the
	employee IDs from each linked Employee Group.

	Returns:
		De-duplicated list of machine employee ID strings.
	"""
	Op = DocType("Operation")
	EGT = DocType("Employee Group Table")

	employee_ids: list[str] = (
		frappe.qb.from_(Op)
		.inner_join(EGT)
		.on((EGT.parent == Op.employee_group) & (EGT.parenttype == "Employee Group"))
		.select(EGT.employee)
		.where(Op.is_machine_time == 1)
		.where(Op.employee_group.isnotnull())
		.distinct()
	).run(pluck="employee")

	return employee_ids


def _build_machine_employee_case(operation_field: Any, fallback_employee_id: str) -> Any:
	"""Build a SQL CASE expression mapping operations to machine employee IDs.

	For each machine operation (``is_machine_time == 1``) that has a linked
	Employee Group, creates a WHEN clause mapping the operation name to the
	*first* employee in that group.  Non-machine operations fall back to
	``fallback_employee_id``.

	When no machine operations are configured, returns the
	``fallback_employee_id`` string directly (usable as a literal in
	query-builder expressions) to avoid an empty CASE statement.

	Args:
		operation_field: The query-builder field to compare (e.g. ``WOOp.operation``).
		fallback_employee_id: The human employee ID used as the ELSE / sole value.

	Returns:
		A frappe query-builder ``Case`` expression, or a plain string when
		there are no machine operations.
	"""
	Op = DocType("Operation")
	EGT = DocType("Employee Group Table")

	machine_ops: list[dict[str, Any]] = (
		frappe.qb.from_(Op)
		.inner_join(EGT)
		.on((EGT.parent == Op.employee_group) & (EGT.parenttype == "Employee Group"))
		.select(Op.name.as_("operation"), EGT.employee)
		.where(Op.is_machine_time == 1)
		.where(Op.employee_group.isnotnull())
		.groupby(Op.name)
	).run(as_dict=True)

	if not machine_ops:
		return fallback_employee_id

	case = Case()
	for row in machine_ops:
		case = case.when(operation_field == row["operation"], row["employee"])
	return case.else_(fallback_employee_id)


def _resolve_job_card_name(work_order: str, operation: str, *, corrective: bool = False) -> str | None:
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


def get_employee_for_user() -> str | None:
	"""Get the Employee ID linked to the current session user

	Returns:
		The linked Employee ID, or None if no link exists
	"""
	if not frappe.session.user or frappe.session.user == "Guest":
		return None
	return frappe.get_value("Employee", {"user_id": frappe.session.user}, "name")

	# return {
	#     "status": "success",
	#     "last_checkin": last_checkin[0] if last_checkin else None,
	#     "open_job_card": open_job_card.name if open_job_card_time_log else None,
	#     "token": token}


@frappe.whitelist(allow_guest=True)
def log_in_employee(time: str, token: str | None = None) -> dict[str, Any]:
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

	if token:
		employee_id, token = extract_employee_from_token(token)
	else:
		employee_id = get_employee_for_user()
		if not employee_id:
			return {"status": "error", "message": ("No employee linked to current user")}

	new_log = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
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

	new_log = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
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

	# Get work orders with aggregated planned and logged times in a single query
	WorkOrders = DocType("Work Order")
	WOOp = DocType("Work Order Operation")
	JC = DocType("Job Card")
	TL = DocType("Job Card Time Log")

	# Subquery: planned time per work order
	planned_sq = (
		frappe.qb.from_(WOOp)
		.select(WOOp.parent.as_("wo"), Coalesce(Sum(WOOp.time_in_mins), 0).as_("planned_time_mins"))
		.where(WOOp.parenttype == "Work Order")
		.groupby(WOOp.parent)
	)

	# Subquery: logged time per work order
	logged_sq = (
		frappe.qb.from_(TL)
		.inner_join(JC)
		.on(TL.parent == JC.name)
		.select(JC.work_order.as_("wo"), Coalesce(Sum(TL.time_in_mins), 0).as_("logged_time_mins"))
		.where(JC.docstatus < 2)
		.groupby(JC.work_order)
	)

	work_orders: list[dict[str, Any]] = (
		frappe.qb.from_(WorkOrders)
		.left_join(planned_sq)
		.on(planned_sq.wo == WorkOrders.name)
		.left_join(logged_sq)
		.on(logged_sq.wo == WorkOrders.name)
		.select(
			WorkOrders.name,
			WorkOrders.production_item,
			WorkOrders.status,
			Coalesce(planned_sq.planned_time_mins, 0).as_("planned_time_mins"),
			Coalesce(logged_sq.logged_time_mins, 0).as_("logged_time_mins"),
		)
		.where(WorkOrders.status.isin(["Submitted", "Not Started", "In Process"]))
	).run(as_dict=True)

	for wo in work_orders:
		wo["planned_time_mins"] = float(wo.get("planned_time_mins", 0))
		wo["logged_time_mins"] = float(wo.get("logged_time_mins", 0))

	return {"status": "success", "token": token, "work_orders": work_orders}


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=4, seconds=1)
def get_operations(token: str, work_order: str, workstations: str = "[]") -> dict[str, Any]:
	"""
	Retrieve all operations for a work order with aggregated time totals.

	Anchors on the Work Order Operation child table and LEFT JOINs through
	Job Card → Job Card Time Log to aggregate regular and corrective time.

	When workstations are provided, operations whose workstation matches any
	of the given names are sorted to the top, followed by the remaining
	operations in their natural idx order.

	Args:
		token: JWT authentication token for the employee
		work_order: Name/ID of the work order
		workstations: JSON-encoded list of workstation names to prioritize

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

	import json as _json

	try:
		ws_list: list[str] = _json.loads(workstations) if workstations else []
	except (ValueError, TypeError):
		ws_list = [workstations] if workstations else []

	WOOp = DocType("Work Order Operation")
	JC = DocType("Job Card")
	TL = DocType("Job Card Time Log")

	# CASE: map operation -> expected employee (machine ops use machine employee)
	employee_case = _build_machine_employee_case(WOOp.operation, employee_id)

	results: list[dict[str, Any]] = (
		frappe.qb.from_(WOOp)
		.left_join(JC)
		.on((JC.work_order == WOOp.parent) & (JC.operation == WOOp.operation) & (JC.docstatus < 2))
		.left_join(TL)
		.on(TL.parent == JC.name)
		.select(
			WOOp.name.as_("work_order_operation"),
			WOOp.operation,
			WOOp.workstation,
			WOOp.time_in_mins.as_("planned_time_mins"),
			Coalesce(Sum(Case().when(JC.is_corrective_job_card == 0, TL.time_in_mins).else_(0)), 0).as_(
				"actual_time_mins"
			),
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
			Coalesce(Sum(Case().when(JC.is_corrective_job_card == 1, TL.time_in_mins).else_(0)), 0).as_(
				"corrective_total_time_mins"
			),
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
			Coalesce(Max(Case().when(JC.is_corrective_job_card == 0, JC.docstatus).else_(None)), 0).as_(
				"regular_docstatus"
			),
		)
		.where(WOOp.parent == work_order)
		.where(WOOp.parenttype == "Work Order")
		.groupby(WOOp.name)
		.orderby(Case().when(WOOp.workstation.isin(ws_list), 0).else_(1) if ws_list else WOOp.idx)
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
			"is_submitted": int(row.get("regular_docstatus", 0)) == 1,
		}
		for row in results
	]

	return {
		"status": "success",
		"token": token,
		"operations": operations,
	}


def _close_open_time_logs(employee_id: str, close_time: str) -> int:
	"""Close all open time logs for an employee across every job card.

	Queries Job Card Time Log for rows where to_time is NULL belonging
	to ``employee_id`` or any of the machine employee IDs associated
	with that employee.  Each affected parent Job Card is loaded, its
	open logs are stamped with ``close_time``, and the card is saved.

	Args:
		employee_id: The human employee ID.
		close_time: Timestamp string to write into to_time.

	Returns:
		The number of time-log rows that were closed.
	"""
	TL = DocType("Job Card Time Log")
	JC = DocType("Job Card")

	employee_ids: list[str] = [employee_id] + _get_all_machine_employee_ids()

	open_logs: list[dict[str, Any]] = (
		frappe.qb.from_(TL)
		.inner_join(JC)
		.on(TL.parent == JC.name)
		.select(TL.parent, TL.name)
		.where(TL.to_time.isnull())
		.where(TL.employee.isin(employee_ids))
		.where(JC.docstatus == 0)
	).run(as_dict=True)

	if not open_logs:
		return 0

	# Group log names by their parent Job Card
	cards: dict[str, list[str]] = {}
	for row in open_logs:
		cards.setdefault(row["parent"], []).append(row["name"])

	closed = 0
	for card_name, log_names in cards.items():
		job_card: JobCard = JobCard("Job Card", card_name, ignore_permissions=True)
		for tl in job_card.time_logs:
			if tl.name in log_names:
				tl.to_time = close_time
				closed += 1
		job_card.save(ignore_permissions=True)

	return closed


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
	employee_ids: list[str] = [employee_id] + _get_all_machine_employee_ids()

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
		.where(JC.docstatus == 0)
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
	machine_employees = _get_machine_employee_ids(operation)
	if machine_employees:
		log_employee = machine_employees[0]

	try:
		# Close any open time logs for this employee before starting
		_close_open_time_logs(employee_id, start_time)

		if is_corrective:
			original_job_card: JobCard = JobCard("Job Card", jobcard_name, ignore_permissions=True)

			# Find or create corrective job card
			existing_corrective = frappe.db.get_value(
				"Job Card",
				{"for_job_card": jobcard_name, "is_corrective_job_card": 1, "docstatus": 0},
				"name",
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
	end_time: str,
	**_kwargs: Any,
) -> dict[str, Any]:
	"""
	Stop all running timers for an employee.

	Closes every open time log (where to_time is NULL) belonging to
	this employee or any of their associated machine employee IDs.

	Accepts (and ignores) extra keyword arguments so existing frontend
	callers that still pass work_order / operation / is_corrective
	continue to work without error.

	Args:
		employee_id: The employee stopping work
		end_time: Timestamp string for when work ends

	Returns:
		Dict containing:
			- status: "success" or "failed"
			- error: Error message string if failed

	Raises:
		None: Catches and logs exceptions
	"""
	try:
		closed = _close_open_time_logs(employee_id, end_time)
		if closed == 0:
			return {"status": "failed", "error": "No active time log found"}
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

	If a session user is authenticated, returns their user ID; and any associated Employee ID

	Args:
		None

	Returns:
		Dict containing:
			- user_id: The current user's ID or "Guest" if not logged in

	Raises:
		None
	"""
	if frappe.session.user != "Guest":
		return {
			"user_id": frappe.session.user,
			"employee_id": frappe.get_value("Employee", {"user_id": frappe.session.user}, "name"),
		}
	else:
		return {"user_id": frappe.session.user}


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=4, seconds=1)
def get_workstations() -> dict[str, Any]:
	"""
	Retrieve all workstations for the workstation selector dropdown.

	Fetches workstation names from the Workstation doctype, ordered by name.

	Returns:
		Dict containing:
			- status: "success"
			- workstations: List of workstation name strings
	"""
	WS = DocType("Workstation")
	workstations: list[str] = (frappe.qb.from_(WS).select(WS.name).orderby(WS.name)).run(pluck="name")

	return {"status": "success", "workstations": workstations}


@frappe.whitelist(allow_guest=True)
def get_device_info() -> dict[str, Any]:
	"""Return the requesting client's IP address and MAC address.

	The IP is read from the incoming request.  The MAC address is resolved
	via the ``getmac`` Python library when available; falls back to an
	empty string otherwise.

	Returns:
		Dict containing:
			- status: "success"
			- ip: Client IP address string
			- mac: MAC address string, or empty string if unavailable
	"""
	ip: str = frappe.local.request_ip or ""
	mac: str = ""
	try:
		import getmac  # type: ignore[import]

		mac = getmac.get_mac_address(ip=ip) or ""
	except Exception:
		pass

	return {"status": "success", "ip": ip, "mac": mac}


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
