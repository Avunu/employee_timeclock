# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import frappe
from frappe.sessions import get_csrf_token

from employee_timeclock.kiosk import require_kiosk_page
from employee_timeclock.kiosk_pwa import KIOSK_APPS, get_head_context

no_cache = True


def get_context(context):
	# the badge kiosk runs signed in as a Timeclock Kiosk user
	require_kiosk_page()
	context.title = KIOSK_APPS["timeclock"].name
	context.pwa = get_head_context("timeclock")
	csrf_token = get_csrf_token()
	# A fresh token is written to the session, and a GET request isn't committed on its own:
	# without this the kiosk's first punch can fail the CSRF check.
	frappe.db.commit()
	context.csrf_token = csrf_token
	context.boot = {
		# The page times the session out from this and reloads when it runs out, which lands
		# on require_kiosk_page() above.
		"session_expiry": frappe.get_system_settings("session_expiry"),
		# The SDK sends this as the site's name, or the page's hostname if it isn't told.
		"sitename": frappe.local.site,
	}
