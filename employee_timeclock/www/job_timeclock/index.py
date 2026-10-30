# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import frappe
from frappe.sessions import get_csrf_token

from employee_timeclock.kiosk import require_login_page
from employee_timeclock.kiosk_pwa import KIOSK_APPS, get_head_context

no_cache = True


def get_context(context):
	# a signed-in employee, or a Timeclock Kiosk user that employees badge into
	require_login_page()
	context.title = KIOSK_APPS["job_timeclock"].name
	context.pwa = get_head_context("job_timeclock")
	csrf_token = get_csrf_token()
	# A fresh token is written to the session, and a GET request isn't committed on its own:
	# without this the tablet's first call can fail the CSRF check.
	frappe.db.commit()
	context.csrf_token = csrf_token
	context.sitename = frappe.local.site
	context.boot = {
		# The page times the session out from this and reloads when it runs out, which lands
		# on require_login_page() above.
		"session_expiry": frappe.get_system_settings("session_expiry"),
		"sitename": frappe.local.site,
		"socketio_port": frappe.conf.socketio_port,
	}
