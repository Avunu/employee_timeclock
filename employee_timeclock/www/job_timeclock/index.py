# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import frappe
from frappe.sessions import get_csrf_token

from employee_timeclock.kiosk import require_login_page

no_cache = True


def get_context(context):
	# a signed-in employee, or a Timeclock Kiosk user that employees badge into
	require_login_page()
	csrf_token = get_csrf_token()
	context.csrf_token = csrf_token
	context.sitename = frappe.local.site
	context.developer_mode = frappe.conf.developer_mode
