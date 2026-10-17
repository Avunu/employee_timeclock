# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""Who may use the timeclock kiosks, and how an employee proves who they are at one.

A kiosk is a browser signed in as a low-privilege user holding the ``Timeclock Kiosk`` role. The
kiosk endpoints refuse everyone else, Guest included. At the kiosk an employee identifies with a
badge, never with their Employee ID (IDs are sequential, so anyone could punch for anyone):

* an issued **badge token**, a random ``secrets.token_urlsafe`` value HR prints on the badge (as a
  barcode or QR code). Only its SHA-256 digest is stored, on the Employee.
* a registered **RFID tag**, an Attendance Device ID row on the Employee.

Every failure reads the same, whether the badge is unknown, revoked or belongs to an inactive
employee, so the kiosk never confirms that an employee exists.
"""

import hashlib
import secrets
from typing import TypedDict

import frappe
from frappe import _
from frappe.utils import now_datetime

KIOSK_ROLE = "Timeclock Kiosk"
"""The role a kiosk's user holds. Shipped as a fixture (timeclock/fixtures/role.json)."""

BADGE_ISSUER_ROLES = ["HR Manager", "System Manager"]
"""The roles that may issue and revoke badge tokens."""

KIOSK_SCAN_LIMIT = 30
KIOSK_SCAN_WINDOW = 60
"""Badge verifications allowed per client IP in a window of this many seconds: a busy shift change
is one scan every two seconds, a brute force needs far more than 43,200 tries a day."""

BADGE_TOKEN_BYTES = 18
"""Random bytes in a badge token: 144 bits, 24 URL-safe characters, short enough for a barcode."""

BADGE_HASH_FIELD = "timeclock_badge_hash"
BADGE_ISSUED_FIELD = "timeclock_badge_issued_on"

DEVICE_ID = "Employee Clock-in/out Device"
"""The device recorded on the punches the Employee Clock-in/out web form makes."""


class KioskAuthenticationError(frappe.AuthenticationError):
	"""A badge or badge JWT a kiosk sent was not accepted (HTTP 401).

	A subclass on purpose: frappe signs the client out (it deletes the ``sid`` cookie) when a request
	ends in exactly ``frappe.AuthenticationError``. A kiosk stays signed in as its kiosk user, so a
	misread badge or an expired badge JWT must not end that session.
	"""


class IssuedBadge(TypedDict):
	"""What ``issue_badge`` returns: the token, shown to HR once, and when it was issued."""

	employee: str
	token: str
	issued_on: str


def require_kiosk_role() -> None:
	"""Refuse the request unless the session user holds the Timeclock Kiosk role.

	Raises:
		frappe.PermissionError: The user is Guest or lacks the role.
	"""
	frappe.only_for(KIOSK_ROLE)


def hash_badge_token(token: str) -> str:
	"""Return the stored form of a badge token: its SHA-256 hex digest.

	A plain digest (no salt, no key stretching) is the right tool here: the token is 144 random bits,
	so there is nothing to guess and no dictionary to precompute, and an unsalted digest can be
	looked up by an index. That lookup is also why verification is timing safe: the database
	compares digests, and learning a digest's prefix tells an attacker nothing about a token.
	"""
	return hashlib.sha256(token.strip().encode()).hexdigest()


def resolve_badge(scan: str | None) -> str | None:
	"""Return the active Employee a scanned badge belongs to, or None.

	Checks an issued badge token first, then a registered RFID tag. Every failure is logged without
	the scanned value and is indistinguishable to the caller.
	"""
	scan = (scan or "").strip()
	employee: str | None = None
	if scan:
		employee = frappe.db.get_value(
			"Employee", {BADGE_HASH_FIELD: hash_badge_token(scan), "status": "Active"}, "name"
		)
		if not employee:
			tagged = frappe.db.get_value("Attendance Device ID", {"id": scan}, "parent")
			if tagged and frappe.db.get_value("Employee", tagged, "status") == "Active":
				employee = tagged
	if not employee:
		frappe.logger("timeclock.kiosk").warning(
			"timeclock: badge not recognised (user=%s, ip=%s)",
			frappe.session.user,
			getattr(frappe.local, "request_ip", None),
		)
	return employee


def verify_badge(scan: str | None) -> str:
	"""Return the active Employee a scanned badge belongs to.

	Raises:
		KioskAuthenticationError: The badge is not recognised, with the same message whatever the
			reason.
	"""
	employee = resolve_badge(scan)
	if not employee:
		frappe.throw(_("Badge not recognised."), exc=KioskAuthenticationError, title=_("Timeclock"))
	return str(employee)


@frappe.whitelist(methods=["POST"])
def issue_badge(employee: str) -> IssuedBadge:
	"""Issue a new badge token for an employee, replacing (and so revoking) any earlier one.

	The token is returned once, for HR to print on the badge. Only its digest is kept.

	Raises:
		frappe.PermissionError: The user is neither an HR Manager nor a System Manager.
		frappe.DoesNotExistError: There is no such Employee.
	"""
	frappe.only_for(BADGE_ISSUER_ROLES)
	if not frappe.db.exists("Employee", employee):
		frappe.throw(_("Employee {0} not found.").format(employee), exc=frappe.DoesNotExistError)
	token = secrets.token_urlsafe(BADGE_TOKEN_BYTES)
	issued_on = now_datetime()
	frappe.db.set_value(
		"Employee",
		employee,
		{BADGE_HASH_FIELD: hash_badge_token(token), BADGE_ISSUED_FIELD: issued_on},
	)
	frappe.get_doc("Employee", employee).add_comment("Info", _("Issued a new timeclock badge."))
	return IssuedBadge(employee=employee, token=token, issued_on=str(issued_on))


@frappe.whitelist(methods=["POST"])
def revoke_badge(employee: str) -> None:
	"""Revoke an employee's badge token, for a lost badge or a leaver.

	Raises:
		frappe.PermissionError: The user is neither an HR Manager nor a System Manager.
		frappe.DoesNotExistError: There is no such Employee.
	"""
	frappe.only_for(BADGE_ISSUER_ROLES)
	if not frappe.db.exists("Employee", employee):
		frappe.throw(_("Employee {0} not found.").format(employee), exc=frappe.DoesNotExistError)
	frappe.db.set_value("Employee", employee, {BADGE_HASH_FIELD: None, BADGE_ISSUED_FIELD: None})
	frappe.get_doc("Employee", employee).add_comment("Info", _("Revoked the timeclock badge."))


def refuse_web_form_checkin(doc: object, method: str | None = None) -> None:
	"""Refuse an Employee Checkin made through frappe's generic web form endpoint.

	The Employee Clock-in/out web form has an ``employee`` field, so frappe's own
	``web_form.accept`` would otherwise insert a punch for any Employee ID it is sent, skipping
	the badge. The form's real submit goes through ``timeclock.timeclock.api.submit_checkin``.
	"""
	_unused = (doc, method)
	if frappe.flags.in_web_form:
		frappe.throw(_("Punches are recorded by scanning a badge."), exc=frappe.PermissionError)


def require_login_page() -> None:
	"""Send Guest to the login page, then back to the page they asked for."""
	if frappe.session.user == "Guest":
		path = getattr(frappe.local, "path", "") or ""
		frappe.local.flags.redirect_location = f"/login?redirect-to=/{path.lstrip('/')}"
		raise frappe.Redirect


def require_kiosk_page() -> None:
	"""Gate a kiosk page: send Guest to the login page, refuse a user without the kiosk role."""
	require_login_page()
	require_kiosk_role()
