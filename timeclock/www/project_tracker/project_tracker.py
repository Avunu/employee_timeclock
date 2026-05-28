from datetime import datetime, timedelta
from typing import Any, Literal, cast

import frappe
import getmac
import jwt
from frappe import _
from frappe.query_builder import Case, DocType
from frappe.query_builder.functions import Coalesce, Max, Sum
from frappe.rate_limiter import rate_limit
from frappe.utils.data import get_datetime

from timeclock.timeclock.custom.employee_checkin import EmployeeCheckin
from timeclock.timeclock.custom.job_card import JobCard
from timeclock.timeclock.custom.job_card_time_log import (
	JobCardTimeLog,
)
from timeclock.www.project_tracker.models import (
	ActiveTimer,
	AuthenticateEmployeeResponse,
	EmployeeCheckinResponse,
	GetActiveTimerResponse,
	GetDeviceInfoResponse,
	GetMachineTimersResponse,
	GetOperationsResponse,
	GetWorkOrdersResponse,
	GetWorkstationsResponse,
	MachineTimer,
	Operation,
	StartTimerResponse,
	StopMachineTimerResponse,
	StopTimerResponse,
	SubmitJobCardResponse,
	UserSessionEmployee,
	WorkOrder,
)

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


def _is_machine_operation(operation: str) -> bool:
	"""Return True if the operation has ``is_machine_time`` checked."""
	Op = DocType("Operation")
	row = (frappe.qb.from_(Op).select(Op.is_machine_time).where(Op.name == operation).limit(1)).run(
		as_dict=True
	)
	return bool(row and row[0].get("is_machine_time"))


def _get_employee_groups_for_employee(employee_id: str) -> list[str]:
	"""Return the Employee Group names that contain *employee_id*."""
	EGT = DocType("Employee Group Table")
	return (
		frappe.qb.from_(EGT)
		.select(EGT.parent)
		.where(EGT.employee == employee_id)
		.where(EGT.parenttype == "Employee Group")
		.distinct()
		.run(pluck="parent")
	)


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
	expires: float = (datetime.now() + timedelta(minutes=30)).timestamp()
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
def authenticate_employee(rfid: str) -> AuthenticateEmployeeResponse:
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
		return AuthenticateEmployeeResponse(status="error", message="Invalid RFID").model_dump()

	# If valid, generate a JWT
	token = refresh_token(str(employee_id))

	# get the last employee checkin to see if the employee is clocked in or out
	EmployeeCheckins = DocType("Employee Checkin")
	last_checkin: list[str] = (
		frappe.qb.from_(EmployeeCheckins)
		.select(EmployeeCheckins.log_type)
		.where(EmployeeCheckins.employee == employee_id)
		.orderby(EmployeeCheckins.modified, order=frappe.qb.desc)
		.limit(1)
		.run(pluck="log_type")
	)

	# check to see if there is any Job Card Time Log that was started but not ended

	return AuthenticateEmployeeResponse(
		status="success",
		last_checkin=cast(Literal["IN", "OUT"], last_checkin[0]) if last_checkin else None,
		token=token,
	).model_dump()


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


def _resolve_employee(token: str | None = None) -> tuple[str, str | None]:
	"""Resolve the current employee from Frappe session or JWT token.

	Tries the Frappe session first (logged-in user with linked Employee).
	Falls back to JWT token authentication if no session employee is found.

	Args:
		token: Optional JWT token for NFC/RFID authentication.

	Returns:
		Tuple of (employee_id, refreshed_token).  ``refreshed_token`` is
		``None`` when authenticated via Frappe session.

	Raises:
		frappe.AuthenticationError: When neither mechanism can resolve an employee.
	"""
	# 1. Try Frappe session
	employee_id = get_employee_for_user()
	if employee_id:
		return employee_id, None

	# 2. Fall back to JWT token
	if token:
		return extract_employee_from_token(token)

	frappe.throw(_("Authentication required."), exc=frappe.AuthenticationError)
	raise  # unreachable but satisfies type checker


@frappe.whitelist(allow_guest=True)
def log_in_employee(time: str, token: str | None = None) -> EmployeeCheckinResponse:
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

	try:
		employee_id, _token = _resolve_employee(token)
	except Exception:
		return EmployeeCheckinResponse(
			status="error", message="No employee linked to current user"
		).model_dump()

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
		return EmployeeCheckinResponse(status="success", log=new_log).model_dump()
	else:
		return EmployeeCheckinResponse(status="unsuccessful", log=new_log).model_dump()


# Issue with logout. The log is made but _unsaved = True. so its not passing to workday management
@frappe.whitelist(allow_guest=True)
def log_out_employee(time: str, token: str | None = None) -> EmployeeCheckinResponse:
	"""
	Log an employee's clock-out (OUT) time.

	Creates a new Employee Checkin record with log_type "OUT" for the authenticated employee.
	The checkin is created from the Job Timeclock Scanner device.

	Args:
		time: Timestamp string for the check-out time
		token: Optional JWT authentication token for NFC auth

	Returns:
		Dict containing:
			- status: "success" or "unsuccessful"
			- log: The created EmployeeCheckin object

	Raises:
		None: Catches exceptions and returns unsuccessful status
	"""
	try:
		employee_id, _token = _resolve_employee(token)
	except Exception:
		return EmployeeCheckinResponse(status="error", message="Authentication required").model_dump()

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
		return EmployeeCheckinResponse(status="success", log=new_log).model_dump()
	else:
		return EmployeeCheckinResponse(status="unsuccessful", log=new_log).model_dump()


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=2, seconds=1)
def get_work_orders(token: str | None = None) -> GetWorkOrdersResponse:
	"""
	Retrieve all active work orders for display in the job timeclock.

	Fetches work orders with status of "Submitted", "Not Started", or "In Process".
	Authenticates the employee via Frappe session or JWT token.

	Args:
		token: Optional JWT authentication token (NFC auth)

	Returns:
		Dict containing:
			- status: "success" or "error"
			- token: Refreshed JWT token (None for session auth)
			- work_orders: List of work order dicts with name, production_item, and status
			- message: Error message if authentication failed

	Raises:
		None: Returns error dict on exception
	"""
	frappe.publish_realtime("test", "aye yooooo")

	try:
		employee_id, token = _resolve_employee(token)
	except Exception as e:
		return GetWorkOrdersResponse(status="error", message=str(e)).model_dump()

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

	return GetWorkOrdersResponse(
		status="success",
		token=token,
		work_orders=[
			WorkOrder(
				name=wo["name"],
				production_item=wo["production_item"],
				status=wo["status"],
				planned_time_mins=float(wo.get("planned_time_mins", 0)),
				logged_time_mins=float(wo.get("logged_time_mins", 0)),
			)
			for wo in work_orders
		],
	).model_dump()


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=4, seconds=1)
def get_operations(
	work_order: str, workstations: str = "[]", token: str | None = None
) -> GetOperationsResponse:
	"""
	Retrieve all operations for a work order with aggregated time totals.

	Anchors on the Work Order Operation child table and LEFT JOINs through
	Job Card → Job Card Time Log to aggregate regular and corrective time.

	When workstations are provided, operations whose workstation matches any
	of the given names are sorted to the top, followed by the remaining
	operations in their natural idx order.

	Args:
		work_order: Name/ID of the work order
		workstations: JSON-encoded list of workstation names to prioritize
		token: Optional JWT authentication token (NFC auth)

	Returns:
		Dict containing:
			- status: "success" or "error"
			- token: Refreshed JWT token (None for session auth)
			- operations: List of operation dicts with time totals

	Raises:
		None: Returns error dict on exception
	"""
	try:
		employee_id, token = _resolve_employee(token)
	except Exception as e:
		return GetOperationsResponse(status="error", message=str(e)).model_dump()

	import json as _json

	try:
		ws_list: list[str] = _json.loads(workstations) if workstations else []
	except (ValueError, TypeError):
		ws_list = [workstations] if workstations else []

	WorkOrderOperations = DocType("Work Order Operation")
	JobCards = DocType("Job Card")
	JobCardTimeLogs = DocType("Job Card Time Log")
	Operations = DocType("Operation")

	# CASE: map operation -> expected employee (machine ops use machine employee)
	employee_case = _build_machine_employee_case(WorkOrderOperations.operation, employee_id)

	results: list[dict[str, Any]] = (
		frappe.qb.from_(WorkOrderOperations)
		.join(Operations)
		.on(Operations.name == WorkOrderOperations.operation)
		.left_join(JobCards)
		.on(
			(JobCards.work_order == WorkOrderOperations.parent)
			& (JobCards.operation == WorkOrderOperations.operation)
			& (JobCards.docstatus < 2)
		)
		.left_join(JobCardTimeLogs)
		.on(JobCardTimeLogs.parent == JobCards.name)
		.select(
			WorkOrderOperations.name.as_("work_order_operation"),
			WorkOrderOperations.operation,
			WorkOrderOperations.workstation,
			WorkOrderOperations.time_in_mins.as_("planned_time_mins"),
			Operations.is_machine_time,
			Coalesce(
				Sum(Case().when(JobCards.is_corrective_job_card == 0, JobCardTimeLogs.time_in_mins).else_(0)),  # type: ignore
				0,
			).as_("actual_time_mins"),
			Coalesce(
				Sum(
					Case()
					.when(
						(JobCards.is_corrective_job_card == 0) & (JobCardTimeLogs.employee == employee_case),
						JobCardTimeLogs.time_in_mins,
					)
					.else_(0)  # type: ignore
				),
				0,
			).as_("employee_time_mins"),
			Coalesce(
				Sum(Case().when(JobCards.is_corrective_job_card == 1, JobCardTimeLogs.time_in_mins).else_(0)),  # type: ignore
				0,
			).as_("corrective_total_time_mins"),
			Coalesce(
				Sum(
					Case()
					.when(
						(JobCards.is_corrective_job_card == 1) & (JobCardTimeLogs.employee == employee_case),
						JobCardTimeLogs.time_in_mins,
					)
					.else_(0)  # type: ignore
				),
				0,
			).as_("corrective_employee_time_mins"),
			Coalesce(
				Max(Case().when(JobCards.is_corrective_job_card == 0, JobCards.docstatus).else_(None)),  # type: ignore
				0,
			).as_("regular_docstatus"),
		)
		.where(WorkOrderOperations.parent == work_order)
		.where(WorkOrderOperations.parenttype == "Work Order")
		.groupby(WorkOrderOperations.name)
		.orderby(
			Case().when(WorkOrderOperations.workstation.isin(ws_list), 0).else_(1)
			if ws_list
			else WorkOrderOperations.idx
		)
		.orderby(WorkOrderOperations.idx)
	).run(as_dict=True)

	operations = [
		Operation(
			name=row["work_order_operation"],
			operation=row["operation"],
			workstation=row.get("workstation", ""),
			planned_time_mins=float(row.get("planned_time_mins", 0)),
			actual_time_mins=float(row.get("actual_time_mins", 0)),
			employee_time_mins=float(row.get("employee_time_mins", 0)),
			corrective_total_time_mins=float(row.get("corrective_total_time_mins", 0)),
			corrective_employee_time_mins=float(row.get("corrective_employee_time_mins", 0)),
			is_submitted=int(row.get("regular_docstatus", 0)) == 1,
			is_machine_time=bool(row.get("is_machine_time")),
		)
		for row in results
	]

	return GetOperationsResponse(status="success", token=token, operations=operations).model_dump()


def _close_open_timers_on_operation(operation: str, close_time: datetime) -> int:
	"""Close all open time logs on a given operation across every job card.

	Args:
		operation: The Operation name to close timers on.
		close_time: Timestamp string to write into to_time.

	Returns:
		The number of time-log rows that were closed.
	"""
	TL = DocType("Job Card Time Log")
	JC = DocType("Job Card")

	open_logs: list[dict[str, Any]] = (
		frappe.qb.from_(TL)
		.inner_join(JC)
		.on(TL.parent == JC.name)
		.select(TL.parent, TL.name)
		.where(TL.to_time.isnull())
		.where(JC.operation == operation)
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


def _close_open_timers_on_employee(employee_id: str, close_time: datetime) -> int:
	"""Close open time logs for an employee across every job card.

	Args:
		employee_id: The human employee ID.
		close_time: Timestamp string to write into to_time.

	Returns:
		The number of time-log rows that were closed.
	"""
	TL = DocType("Job Card Time Log")
	JC = DocType("Job Card")

	open_logs: list[dict[str, Any]] = (
		frappe.qb.from_(TL)
		.inner_join(JC)
		.on(TL.parent == JC.name)
		.select(TL.parent, TL.name)
		.where(TL.to_time.isnull())
		.where(TL.employee == employee_id)
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
def get_active_timer(token: str | None = None) -> GetActiveTimerResponse:
	"""
	Get the currently running labor timer for the authenticated employee.

	Only returns the employee's own timer (not machine timers).
	Machine timers are fetched separately via ``get_machine_timers``.

	Args:
		token: Optional JWT authentication token (NFC auth)

	Returns:
		Dict with status, token, and active_timer (or None).
	"""
	try:
		employee_id, token = _resolve_employee(token)
	except Exception as e:
		return GetActiveTimerResponse(status="error", message=str(e)).model_dump()

	JobCards = DocType("Job Card")
	JobCardTimeLogs = DocType("Job Card Time Log")

	# Only look for the employee's own logs (labor timers)
	result: list[dict[str, Any]] = (
		frappe.qb.from_(JobCardTimeLogs)
		.inner_join(JobCards)
		.on(JobCardTimeLogs.parent == JobCards.name)
		.select(
			JobCards.work_order,
			JobCards.operation,
			JobCardTimeLogs.from_time,
			JobCards.is_corrective_job_card,
		)
		.where(JobCards.docstatus == 0)
		.where(JobCardTimeLogs.time_in_mins == 0)
		.where(JobCardTimeLogs.from_time.notnull())
		.where(JobCardTimeLogs.to_time.isnull())
		.where(JobCardTimeLogs.employee == employee_id)
		.limit(1)
	).run(as_dict=True)

	active_timer = None
	if result:
		row = result[0]
		print(row)
		active_timer = ActiveTimer(
			work_order=row["work_order"],
			operation=row["operation"],
			from_time=row["from_time"],
			is_corrective=bool(row["is_corrective_job_card"]),
		)
		print(active_timer)

	return GetActiveTimerResponse(status="success", token=token, active_timer=active_timer).model_dump()


@frappe.whitelist(allow_guest=True)
def start_timer(
	work_order: str,
	operation: str,
	start_time: datetime | str,
	is_corrective: bool = False,
	token: str | None = None,
) -> StartTimerResponse:
	"""
	Start a timer on a job card (regular or corrective).

	Resolves the work_order + operation to the underlying Job Card.
	For corrective timers, finds or creates a corrective Job Card.
	For machine operations, uses the machine employee ID.
	Automatically clocks out the employee from any other active timers.

	Args:
		work_order: Work order name
		operation: Operation name
		start_time: Timestamp string for when work begins
		is_corrective: Whether this is a corrective (rework) timer
		token: Optional JWT authentication token (NFC auth)

	Returns:
		Dict containing:
			- status: "success" or "failed"
			- error: Error message string if failed

	Raises:
		None: Catches and logs exceptions
	"""
	try:
		employee_id, _token = _resolve_employee(token)
	except Exception as e:
		return StartTimerResponse(status="failed", error=str(e)).model_dump()

	# convert start_time to datetime if it's a string
	if isinstance(start_time, str):
		try:
			start_time = datetime.fromisoformat(start_time)
		except ValueError:
			return StartTimerResponse(status="failed", error="Invalid start_time format").model_dump()

	# Resolve the original (non-corrective) job card
	jobcard_name = _resolve_job_card_name(work_order, operation) or ""
	if not jobcard_name:
		return StartTimerResponse(status="failed", error="Job card not found for this operation").model_dump()

	is_machine = _is_machine_operation(operation)
	time_log = {}
	time_log["from_time"] = start_time
	if is_machine:
		time_log["machine_operator"] = employee_id
	else:
		time_log["employee"] = employee_id

	try:
		if is_machine:
			# Machine timer: close any open timers on this operation across all employees to prevent overlap
			_close_open_timers_on_operation(operation, start_time)
		else:
			# Labor timer: close any open labor time logs before starting
			_close_open_timers_on_employee(employee_id, start_time)

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
				target_card.work_order = original_job_card.work_order
				target_card.bom_no = original_job_card.bom_no
				target_card.production_item = original_job_card.production_item
				target_card.operation = original_job_card.operation
				target_card.workstation = original_job_card.workstation
				target_card.for_quantity = 0
				target_card.wip_warehouse = original_job_card.wip_warehouse
				target_card.is_corrective_job_card = 1
				target_card.for_job_card = jobcard_name
				target_card.hour_rate = original_job_card.hour_rate
				target_card.project = original_job_card.project
				target_card.company = original_job_card.company
				target_card.sequence_id = original_job_card.sequence_id
				target_card.operation_id = original_job_card.operation_id

			target_card.append("time_logs", time_log)
			target_card.save(ignore_permissions=True)
		else:
			job_card: JobCard = JobCard("Job Card", jobcard_name, ignore_permissions=True)
			job_card.reload()
			job_card.append("time_logs", time_log)
			job_card.save(ignore_permissions=True)

		# Broadcast machine timer start to all connected clients
		if is_machine:
			Operations = DocType("Operation")
			EmployeeGroups = (
				frappe.qb.from_(Operations)
				.select(Operations.employee_group)
				.where(Operations.name == operation)
				.limit(1)
				.run(pluck="employee_group")
			)
			frappe.publish_realtime(
				"machine_timer_update",
				{
					"action": "start",
					"timer": MachineTimer(
						work_order=work_order,
						operation=operation,
						from_time=start_time,
						employee_group=EmployeeGroups[0] if EmployeeGroups else "",
						is_corrective=is_corrective,
					).model_dump(),
				},
				room="website",
				after_commit=True,
			)

		return StartTimerResponse(status="success").model_dump()

	except Exception as e:
		frappe.log_error("Error in start_timer", e)
		return StartTimerResponse(status="failed", error=str(e)).model_dump()


@frappe.whitelist(allow_guest=True)
def stop_timer(
	end_time: datetime | str,
	token: str | None = None,
	**_kwargs: Any,
) -> StopTimerResponse:
	"""
	Stop the running labor timer for an employee.

	Closes every open time log (where to_time is NULL) belonging to the
	employee's own ID only (not machine timers).

	Args:
		end_time: Timestamp string for when work ends
		token: Optional JWT authentication token (NFC auth)

	Returns:
		Dict with status "success" or "failed".
	"""
	try:
		employee_id, _token = _resolve_employee(token)
	except Exception as e:
		return StopTimerResponse(status="failed", error=str(e)).model_dump()

	# convert end_time to datetime if it's a string
	if isinstance(end_time, str):
		try:
			end_time = datetime.fromisoformat(end_time)
		except ValueError:
			return StopTimerResponse(status="failed", error="Invalid end_time format").model_dump()

	try:
		closed = _close_open_timers_on_employee(employee_id, end_time)
		if closed == 0:
			return StopTimerResponse(status="failed", error="No active time log found").model_dump()
		return StopTimerResponse(status="success").model_dump()

	except Exception as e:
		frappe.log_error("Error in stop_timer", e)
		return StopTimerResponse(status="failed", error=str(e)).model_dump()


@frappe.whitelist(allow_guest=True)
def get_user_session_employee() -> UserSessionEmployee:
	"""
	Check if a user is logged into the ERP system.

	Determines whether the current session belongs to an authenticated user
	or a guest visitor by examining the frappe session.

	If a session user is authenticated, returns their user ID, any associated
	Employee ID, the employee's display name, and last check-in status.

	Returns:
		Dict containing:
			- user_id: The current user's ID or "Guest" if not logged in
			- employee_id: The linked Employee ID, if any
			- employee_name: The employee's display name, if any
			- last_checkin: The last check-in type ("IN" or "OUT"), if any
	"""
	user_id: str = frappe.session.user or "Guest"
	if user_id != "Guest":
		employee_id = frappe.get_value("Employee", {"user_id": user_id}, "name")
		employee_name: str | None = None
		last_checkin: str | None = None
		if employee_id:
			employee_name = frappe.get_value("Employee", employee_id, "employee_name")
			EmployeeCheckins = DocType("Employee Checkin")
			checkin_result: list[str] = (
				frappe.qb.from_(EmployeeCheckins)
				.select(EmployeeCheckins.log_type)
				.where(EmployeeCheckins.employee == employee_id)
				.orderby(EmployeeCheckins.modified, order=frappe.qb.desc)
				.limit(1)
				.run(pluck="log_type")
			)
			last_checkin = cast(Literal["IN", "OUT"], checkin_result[0]) if checkin_result else None
		return UserSessionEmployee(
			user_id=user_id,
			employee_id=employee_id,
			employee_name=employee_name,
			last_checkin=last_checkin,
		).model_dump()
	return UserSessionEmployee(user_id=user_id).model_dump()


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=4, seconds=1)
def get_workstations() -> GetWorkstationsResponse:
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

	return GetWorkstationsResponse(status="success", workstations=workstations).model_dump()


@frappe.whitelist(allow_guest=True)
def get_device_info() -> GetDeviceInfoResponse:
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
		mac = getmac.get_mac_address(ip=ip) or ""
	except Exception:
		pass

	return GetDeviceInfoResponse(status="success", ip=ip, mac=mac).model_dump()


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=4, seconds=1)
def get_machine_timers(token: str | None = None) -> GetMachineTimersResponse:
	"""Return all active machine timers visible to the authenticated employee.

	An employee sees machine timers for every Employee Group they belong to.

	Args:
		token: Optional JWT authentication token (NFC auth).

	Returns:
		Dict with status and list of MachineTimer objects.
	"""
	try:
		employee_id, token = _resolve_employee(token)
	except Exception as e:
		return GetMachineTimersResponse(status="error", message=str(e)).model_dump()

	groups = _get_employee_groups_for_employee(employee_id)
	if not groups:
		return GetMachineTimersResponse(status="success", token=token, machine_timers=[]).model_dump()

	Operations = DocType("Operation")
	JobCards = DocType("Job Card")
	JobCardTimeLogs = DocType("Job Card Time Log")
	EmployeeGroupTable = DocType("Employee Group Table")

	# Machine employee IDs from Employee Groups the employee belongs to
	machine_emp_ids: list[str] = (
		frappe.qb.from_(EmployeeGroupTable)
		.select(EmployeeGroupTable.employee)
		.where(EmployeeGroupTable.parent.isin(groups))
		.where(EmployeeGroupTable.parenttype == "Employee Group")
		.distinct()
		.run(pluck="employee")
	)

	if not machine_emp_ids:
		return GetMachineTimersResponse(status="success", token=token, machine_timers=[]).model_dump()

	rows: list[dict[str, Any]] = (
		frappe.qb.from_(JobCardTimeLogs)
		.inner_join(JobCards)
		.on(JobCardTimeLogs.parent == JobCards.name)
		.inner_join(Operations)
		.on(Operations.name == JobCards.operation)
		.select(
			JobCards.work_order,
			JobCards.operation,
			JobCardTimeLogs.from_time,
			Operations.employee_group,
			JobCards.is_corrective_job_card,
		)
		.where(JobCards.docstatus == 0)
		.where(JobCardTimeLogs.to_time.isnull())
		.where(Operations.is_machine_time == 1)
	).run(as_dict=True)

	timers = [
		MachineTimer(
			work_order=r["work_order"],
			operation=r["operation"],
			from_time=r["from_time"],
			employee_group=r["employee_group"] or "",
			is_corrective=bool(r.get("is_corrective_job_card")),
		)
		for r in rows
	]

	return GetMachineTimersResponse(status="success", token=token, machine_timers=timers).model_dump()


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=4, seconds=1)
def stop_machine_timer(
	work_order: str,
	operation: str,
	end_time: datetime,
	token: str | None = None,
) -> StopMachineTimerResponse:
	"""Stop a specific machine timer.

	Finds the open time log for the machine employee on the given
	work_order + operation and closes it.  Broadcasts the stop event
	to all connected clients.

	Args:
		work_order: Work Order name.
		operation: Operation name (must be a machine operation).
		end_time: Timestamp string for when the machine timer ends.
		token: Optional JWT authentication token (NFC auth).

	Returns:
		Dict with status "success" or "failed".
	"""
	try:
		_employee_id, _token = _resolve_employee(token)
	except Exception as e:
		return StopMachineTimerResponse(status="failed", error=str(e)).model_dump()

	# convert end_time to datetime if it's a string
	if isinstance(end_time, str):
		try:
			end_time = datetime.fromisoformat(end_time)
		except ValueError:
			return StopMachineTimerResponse(status="failed", error="Invalid end_time format").model_dump()

	machine_employees = _get_machine_employee_ids(operation)
	if not machine_employees:
		return StopMachineTimerResponse(status="failed", error="Not a machine operation").model_dump()

	JobCardTimeLogs = DocType("Job Card Time Log")
	JobCards = DocType("Job Card")

	open_logs: list[dict[str, Any]] = (
		frappe.qb.from_(JobCardTimeLogs)
		.inner_join(JobCards)
		.on(JobCardTimeLogs.parent == JobCards.name)
		.select(JobCardTimeLogs.parent, JobCardTimeLogs.name)
		.where(JobCards.work_order == work_order)
		.where(JobCards.operation == operation)
		.where(JobCards.docstatus == 0)
		.where(JobCardTimeLogs.to_time.isnull())
	).run(as_dict=True)

	if not open_logs:
		return StopMachineTimerResponse(status="failed", error="No active machine timer found").model_dump()

	# Group by parent card and close
	cards: dict[str, list[str]] = {}
	for row in open_logs:
		cards.setdefault(row["parent"], []).append(row["name"])

	for card_name, log_names in cards.items():
		jc: JobCard = JobCard("Job Card", card_name, ignore_permissions=True)
		for tl in jc.time_logs:
			if tl.name in log_names:
				tl.to_time = end_time
		jc.save(ignore_permissions=True)

	# Broadcast stop event
	Operations = DocType("Operation")
	employee_group = (
		frappe.qb.from_(Operations)
		.select(Operations.employee_group)
		.where(Operations.name == operation)
		.limit(1)
		.run(pluck="employee_group")
	)
	frappe.publish_realtime(
		"machine_timer_update",
		{
			"action": "stop",
			"timer": MachineTimer(
				work_order=work_order,
				operation=operation,
				employee_group=employee_group[0] if employee_group else "",
			).model_dump(),
		},
		room="website",
		after_commit=True,
	)

	return StopMachineTimerResponse(status="success").model_dump()


@frappe.whitelist(allow_guest=True)
def submit_jobcard(
	jobCard: dict[str, Any], complete_time: str, token: str | None = None
) -> SubmitJobCardResponse:
	"""
	Complete and submit a job card by closing all open time logs.

	Closes any open time logs on the job card by setting their end time,
	marks them as completed, and updates the job card status to "Completed".

	Args:
		jobCard: Dictionary containing job card data including name and operation
		complete_time: Timestamp string for when the job was completed
		token: Optional JWT authentication token (NFC auth)

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
		return SubmitJobCardResponse(status="success", job_card=doc).model_dump()

	else:
		return SubmitJobCardResponse(status="failed", error_message="Log has unfinished times.").model_dump()
