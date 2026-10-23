# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import datetime
from typing import Any, cast

import frappe
import jwt
from frappe import _
from frappe.rate_limiter import rate_limit
from frappe.utils import now_datetime

from employee_timeclock.auth import get_token_secret
from employee_timeclock.kiosk import (
	KIOSK_SCAN_LIMIT,
	KIOSK_SCAN_WINDOW,
	KioskAuthenticationError,
	require_kiosk_role,
	resolve_badge,
)
from employee_timeclock.timeclock.api import KioskPunch, submit_checkin
from employee_timeclock.timeclock.custom.employee_checkin import EmployeeCheckin, insert_punch
from employee_timeclock.timeclock.shifts import last_log_type


@frappe.whitelist(methods=["POST"])
def punch(badge: str, time: str | None = None, log_type: str | None = None) -> KioskPunch:
	"""Record a punch for the employee whose badge was scanned at the kiosk.

	The kiosk's one call per scan. ``submit_checkin`` does the work: IN or OUT by the employee's open
	shift, a second scan inside the same minute keeps the punch already recorded, and the rate limit
	applies to this endpoint.

	The punch is at the server's time, unless the employee entered one by hand for a punch they
	forgot: then ``time`` and ``log_type`` are theirs, and the punch is marked a manual override.

	Args:
		badge: The scanned badge: an issued badge token or a registered RFID tag.
		time: A time entered by hand, ``YYYY-MM-DD HH:MM:SS``; not in the future.
		log_type: ``IN`` or ``OUT``, with ``time``.

	Raises:
		frappe.PermissionError: The user is not a Timeclock Kiosk user.
		employee_timeclock.kiosk.KioskAuthenticationError: The badge is not recognised.
		frappe.RateLimitExceededError: Too many scans from this client.
		frappe.ValidationError: A hand-entered time is malformed or in the future, or has no IN/OUT.
	"""
	if not time:
		return submit_checkin(badge, now_datetime().strftime("%Y-%m-%d %H:%M:%S"))
	try:
		entered: datetime.datetime | None = datetime.datetime.strptime(time, "%Y-%m-%d %H:%M:%S")
	except ValueError:
		entered = None
	if entered is None:
		frappe.throw(_("Enter the date and time of the punch you missed."))
	elif entered > now_datetime():
		frappe.throw(_("That time is in the future. Enter the time of the punch you missed."))
	return submit_checkin(badge, time, log_type=log_type, manual_override=1)


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


@frappe.whitelist(methods=["POST"])
@rate_limit(limit=KIOSK_SCAN_LIMIT, seconds=KIOSK_SCAN_WINDOW)
def authenticate_employee(rfid: str) -> dict[str, Any]:
	"""
	Authenticate an employee by their badge, at a Timeclock Kiosk.

	Resolves the badge (an issued badge token or a registered RFID tag) and generates a JWT for the
	employee. Also says whether the employee is on shift, to determine if the next punch is an IN or an OUT.

	Args:
		rfid: The scanned badge: an issued badge token or an RFID tag

	Returns:
		Dict containing:
			- status: "success" or "error"
			- message: Error message if authentication failed, the same whatever the reason
			- last_checkin: "IN" while the employee has an IN open from the last maximum shift length
				(Timeclock Settings), "OUT" when they punched in that time but are not on shift, else None
			- token: JWT authentication token if successful

	Raises:
		frappe.PermissionError: The user is not a Timeclock Kiosk user.
	"""
	require_kiosk_role()
	employee_id = resolve_badge(rfid)

	if not employee_id:
		return {"status": "error", "message": _("Badge not recognised.")}

	# If valid, generate a JWT
	token: str = refresh_token(str(employee_id))

	# an IN still open from the last maximum shift length means the employee is on shift, so a night
	# shift's scan after midnight is its OUT; an IN older than that (a forgotten clock-out) does not
	# make the next scan an OUT
	return {
		"status": "success",
		"last_checkin": last_log_type(str(employee_id)),
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
		frappe.PermissionError: The user is not a Timeclock Kiosk user.
		KioskAuthenticationError: If token is expired or invalid
	"""
	require_kiosk_role()
	message = _("Invalid token. Please re-authenticate.")
	try:
		# Decode the JWT using the same secret key
		payload: dict[str, Any] = jwt.decode(token, get_token_secret(), algorithms=["HS256"])
	except jwt.ExpiredSignatureError:
		payload = {}
		message = _("Token has expired. Please re-authenticate.")
	except jwt.InvalidTokenError:
		# The token is invalid for some other reason
		payload = {}

	employee_id = str(payload.get("employee_id") or "")
	if not employee_id:
		frappe.throw(message, exc=KioskAuthenticationError)

	return employee_id, refresh_token(employee_id)


@frappe.whitelist(methods=["POST"])
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


@frappe.whitelist(methods=["POST"])
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
