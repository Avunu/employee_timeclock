# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""Shared test helpers: the users the kiosk tests sign in as."""

from typing import cast

import frappe
from frappe.core.doctype.user.user import User

from employee_timeclock import kiosk

KIOSK_USER = "timeclock-kiosk@example.com"


def ensure_user(email: str, roles: tuple[str, ...] = (), user_type: str = "Website User") -> str:
	"""Create (once) a user holding exactly these roles."""
	if not frappe.db.exists("User", email):
		frappe.get_doc(
			{
				"doctype": "User",
				"email": email,
				"first_name": email.split("@")[0],
				"user_type": user_type,
				"send_welcome_email": 0,
			}
		).insert(ignore_permissions=True)
	user = cast(User, frappe.get_doc("User", email))
	missing = [role for role in roles if role not in {r.role for r in user.get("roles")}]
	if missing:
		user.add_roles(*missing)
	return email


def make_kiosk_user() -> str:
	"""Return a Website User holding only the Timeclock Kiosk role, creating the role if a test
	site has not synced the fixture."""
	if not frappe.db.exists("Role", kiosk.KIOSK_ROLE):
		frappe.get_doc({"doctype": "Role", "role_name": kiosk.KIOSK_ROLE, "desk_access": 0}).insert(
			ignore_permissions=True
		)
	return ensure_user(KIOSK_USER, (kiosk.KIOSK_ROLE,))
