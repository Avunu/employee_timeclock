# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import frappe

no_cache = True
from frappe.sessions import get_csrf_token

from employee_timeclock.kiosk import require_kiosk_page


def get_context(context):
	# the legacy job timeclock runs signed in as a Timeclock Kiosk user
	require_kiosk_page()
	csrf_token = get_csrf_token()
	context.csrf_token = csrf_token
