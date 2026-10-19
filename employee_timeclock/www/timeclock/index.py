# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

from frappe.sessions import get_csrf_token

from employee_timeclock.kiosk import require_kiosk_page

no_cache = True


def get_context(context):
	# the badge kiosk runs signed in as a Timeclock Kiosk user
	require_kiosk_page()
	context.csrf_token = get_csrf_token()
