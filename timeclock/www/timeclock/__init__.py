# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import datetime
from typing import Any, cast

import frappe
import jwt
from frappe import _
from frappe.rate_limiter import rate_limit

from timeclock.auth import get_token_secret
from timeclock.timeclock.custom.employee_checkin import EmployeeCheckin, insert_punch


def refresh_token(employee_id: str) -> str:
	"""
	Generate a new JWT token for an employee with 30-minute expiration.

	Creates a fresh JWT token containing the employee ID, name, and expiration timestamp.
	Used to maintain authentication sessions and extend login time.

	Args:
		employee_id: The employee's unique identifier

	Returns:
		Encoded JWT token string valid for 30 minutes
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
		key=get_token_secret(),
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
	"""
	# mac_address = getmac.get_mac_address()
	# Validate the RFID against the database
	employee_id = frappe.get_value("Attendance Device ID", {"id": rfid}, "parent")

	if not employee_id:
		return {"status": "error", "message": ("Invalid RFID")}

	# If valid, generate a JWT
	token: str = refresh_token(str(employee_id))

	# get the last employee checkin to see if the employee is clocked in or out
	last_checkin: list[str] = frappe.get_list(
		"Employee Checkin",
		filters={"employee": employee_id},
		order_by="modified desc",
		limit=1,
		ignore_permissions=True,
		pluck="log_type",
	)

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
		payload: dict[str, Any] = jwt.decode(token, get_token_secret(), algorithms=["HS256"])
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


@frappe.whitelist(allow_guest=True)
def log_in_employee(token: str, time: str) -> dict[str, Any]:
	"""
	Log an employee's clock-in (IN) time.

	Creates a new Employee Checkin record with log_type "IN" for the authenticated employee.
	The checkin is created from the Timeclock Scanner device.

	Args:
		token: JWT authentication token for the employee
		time: Timestamp string for the check-in time

	Returns:
		Dict containing:
			- status: "success" or "unsuccessful"
			- log: The created EmployeeCheckin object
	"""

	employee_id, token = extract_employee_from_token(token)

	new_log = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
	new_log.employee = employee_id
	new_log.time = time
	new_log.log_type = "IN"
	new_log.device_id = "Timeclock Scanner"
	new_log.manual_override = False
	if insert_punch(new_log):
		return {"status": "success", "log": new_log}
	return {"status": "unsuccessful", "log": new_log}


@frappe.whitelist(allow_guest=True)
def log_out_employee(token: str, time: str) -> dict[str, Any]:
	"""
	Log an employee's clock-out (OUT) time.

	Creates a new Employee Checkin record with log_type "OUT" for the authenticated employee.
	The checkin is created from the Timeclock Scanner device.

	Args:
		token: JWT authentication token for the employee
		time: Timestamp string for the check-out time

	Returns:
		Dict containing:
			- status: "success" or "unsuccessful"
			- log: The created EmployeeCheckin object
	"""
	employee_id, token = extract_employee_from_token(token)

	new_log = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
	new_log.employee = employee_id
	new_log.time = time
	new_log.log_type = "OUT"
	new_log.manual_override = False
	new_log.device_id = "Timeclock Scanner"
	if insert_punch(new_log):
		return {"status": "success", "log": new_log}
	return {"status": "unsuccessful", "log": new_log}
