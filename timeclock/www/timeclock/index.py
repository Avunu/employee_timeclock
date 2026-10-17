# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import frappe
from frappe.sessions import get_csrf_token

no_cache = True


def get_context(context):
	# check for valid requesting IPs
	csrf_token = get_csrf_token()
	context.csrf_token = csrf_token
