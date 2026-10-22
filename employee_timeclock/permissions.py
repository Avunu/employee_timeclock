# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""Who sees the app on the desk's apps screen."""

import frappe


def has_app_permission() -> bool:
	"""Return whether the session user may read Workdays, the records the apps-screen tile opens.

	The kiosk users and the employees who only clock in never see the tile: their pages are the
	kiosks, not the desk.
	"""
	return bool(frappe.has_permission("Workday", "read"))
