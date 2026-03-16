import frappe

no_cache = True
from frappe.sessions import get_csrf_token


def get_context(context):
	# check for valid requesting IPs
	csrf_token = get_csrf_token()
	frappe.db.commit()
	context.csrf_token = csrf_token
