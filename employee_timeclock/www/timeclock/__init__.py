# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import datetime
from typing import Any, Literal, TypedDict, cast

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
	verify_badge,
)
from employee_timeclock.timeclock.api import KioskPunch, get_weekly_hours, record_punch
from employee_timeclock.timeclock.custom.employee_checkin import EmployeeCheckin, insert_punch
from employee_timeclock.timeclock.shifts import last_log_type, resync_around

TIME_FORMAT = "%Y-%m-%d %H:%M:%S"

SYNC_BATCH_LIMIT = 100
"""Queued punches the kiosk may send in one sync_punches call."""

OFFLINE_PUNCH_MAX_AGE = datetime.timedelta(days=7)
OFFLINE_PUNCH_MAX_AHEAD = datetime.timedelta(minutes=5)
"""How far from the server's clock a queued punch's time may be: a tablet offline for over a week,
or a time ahead of the server by more than clock drift explains, is refused rather than guessed at."""


class KioskPunchResult(KioskPunch):
	"""What ``punch`` returns: the punch, and the server's clock for the kiosk to keep in step with."""

	server_time: str


class SyncResult(TypedDict):
	"""What became of one queued punch: ``recorded``, ``duplicate`` (recorded before) or ``rejected``."""

	id: str
	status: Literal["recorded", "duplicate", "rejected"]


class SyncAnswer(TypedDict):
	"""What ``sync_punches`` returns: each punch's result, and the server's clock."""

	results: list[SyncResult]
	server_time: str


def parse_kiosk_time(text: object) -> datetime.datetime | None:
	try:
		return datetime.datetime.strptime(str(text), TIME_FORMAT)
	except ValueError:
		return None


@frappe.whitelist(methods=["POST"])
@rate_limit(limit=KIOSK_SCAN_LIMIT, seconds=KIOSK_SCAN_WINDOW)
def punch(
	badge: str, time: str | None = None, log_type: str | None = None, punch_id: str | None = None
) -> KioskPunchResult:
	"""Record a punch for the employee whose badge was scanned at the kiosk.

	The kiosk's one call per scan, through ``record_punch``: IN or OUT by the employee's open shift,
	and a second scan inside the same minute keeps the punch already recorded.

	The punch is at the server's time, unless the employee entered one by hand for a punch they
	forgot: then ``time`` and ``log_type`` are theirs, and the punch is marked a manual override.

	Args:
		badge: The scanned badge: an issued badge token or a registered RFID tag.
		time: A time entered by hand, ``YYYY-MM-DD HH:MM:SS``; not in the future.
		log_type: ``IN`` or ``OUT``, with ``time``.
		punch_id: The kiosk's own id for the punch. A punch sent again under the same id (a retry
			after a lost answer) is recorded once.

	Raises:
		frappe.PermissionError: The user is not a Timeclock Kiosk user.
		employee_timeclock.kiosk.KioskAuthenticationError: The badge is not recognised.
		frappe.RateLimitExceededError: Too many scans from this client.
		frappe.ValidationError: A hand-entered time is malformed or in the future, or has no IN/OUT.
	"""
	require_kiosk_role()
	now = now_datetime()
	if time:
		entered = parse_kiosk_time(time)
		if entered is None:
			frappe.throw(_("Enter the date and time of the punch you missed."))
		elif entered > now:
			frappe.throw(_("That time is in the future. Enter the time of the punch you missed."))
	employee = verify_badge(badge)
	recorded = record_punch(
		employee,
		time or now.strftime(TIME_FORMAT),
		log_type=log_type,
		manual_override=bool(time),
		kiosk_punch_id=punch_id,
	)
	employee_name, weekly_hours = get_weekly_hours(employee)
	return KioskPunchResult(
		log_type=recorded,
		employee_name=str(employee_name),
		weekly_hours=float(weekly_hours),
		server_time=now.strftime(TIME_FORMAT),
	)


def _refusal(queued: dict[str, Any], now: datetime.datetime) -> tuple[str, str | None]:
	"""Why a queued punch can't be recorded, and its employee when it can (the reason is then "")."""
	at = parse_kiosk_time(queued.get("time"))
	if at is None:
		return "its time is not a date and time", None
	if at > now + OFFLINE_PUNCH_MAX_AHEAD:
		return "its time is ahead of the server's clock", None
	if at < now - OFFLINE_PUNCH_MAX_AGE:
		return "it is more than a week old", None
	employee = resolve_badge(str(queued.get("badge") or ""))
	if not employee:
		return "its badge is not recognised", None
	return "", employee


def _sync_one(queued: dict[str, Any], now: datetime.datetime) -> SyncResult:
	"""Record one queued punch in its own savepoint, so a failure leaves the rest of the batch alone."""
	punch_id = str(queued.get("id") or "")
	if frappe.db.exists("Employee Checkin", {"kiosk_punch_id": punch_id}):
		return SyncResult(id=punch_id, status="duplicate")
	reason, employee = _refusal(queued, now)
	if employee:
		frappe.db.savepoint("kiosk_sync")
		try:
			record_punch(
				employee,
				str(queued["time"]),
				log_type=queued.get("log_type"),
				manual_override=bool(queued.get("manual")),
				kiosk_punch_id=punch_id,
			)
			frappe.db.release_savepoint("kiosk_sync")
			return SyncResult(id=punch_id, status="recorded")
		except Exception as error:
			frappe.db.rollback(save_point="kiosk_sync")
			reason = str(error) or type(error).__name__
	# The employee has long left the kiosk, so the refusal goes where HR will see it. The badge
	# itself is left out, as everywhere the kiosk logs.
	frappe.log_error(
		title="Timeclock: an offline punch was not recorded",
		message=f"Punch {punch_id} at {queued.get('time')} was not recorded: {reason}.",
	)
	return SyncResult(id=punch_id, status="rejected")


def _resync_workdays(punch_ids: list[str]) -> None:
	"""Rebuild the Workdays the synced punches belong to, once the whole batch is in.

	Each punch updates its Workday as it is recorded, but one that lands within a minute of an
	earlier one leaves a just-saved Workday alone (``update_workday_from_checkin``). A batch often
	holds an employee's IN and OUT together, so its OUT would otherwise be missing from the Workday.
	"""
	# frappe drops an empty "in" filter, which would rebuild every employee's Workdays
	if not punch_ids:
		return
	times: dict[str, list[datetime.datetime]] = {}
	for checkin in frappe.get_all(
		"Employee Checkin", filters={"kiosk_punch_id": ["in", punch_ids]}, fields=["employee", "time"]
	):
		times.setdefault(checkin.employee, []).append(checkin.time)
	for employee, punched_at in times.items():
		resync_around(employee, punched_at)


@frappe.whitelist(methods=["POST"])
@rate_limit(limit=KIOSK_SCAN_LIMIT, seconds=KIOSK_SCAN_WINDOW)
def sync_punches(punches: list[dict[str, Any]]) -> SyncAnswer:
	"""Record the punches a kiosk queued while it was offline, oldest first.

	Each queued punch is ``{id, badge, time, log_type?, manual?}``, its time taken from the tablet's
	clock (kept in step with the server's). IN or OUT is decided at that time, as if it had been sent
	then. A punch already recorded under its id is a ``duplicate``; one that can't be recorded (an
	unknown badge, a time out of range) is ``rejected`` and logged for HR. Either way the kiosk can
	drop it from its queue.

	Raises:
		frappe.PermissionError: The user is not a Timeclock Kiosk user.
		frappe.RateLimitExceededError: Too many calls from this client.
		frappe.ValidationError: More punches than one call takes, or a punch without an id.
	"""
	require_kiosk_role()
	if len(punches) > SYNC_BATCH_LIMIT:
		frappe.throw(_("Send at most {0} punches at a time.").format(SYNC_BATCH_LIMIT))
	if not all(str(queued.get("id") or "") for queued in punches):
		frappe.throw(_("Every punch needs its id."))
	now = now_datetime()
	results = [
		_sync_one(queued, now) for queued in sorted(punches, key=lambda queued: str(queued.get("time")))
	]
	_resync_workdays([result["id"] for result in results if result["status"] == "recorded"])
	return SyncAnswer(results=results, server_time=now.strftime(TIME_FORMAT))


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
