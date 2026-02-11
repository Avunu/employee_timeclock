import frappe
from frappe.sessions import get_csrf_token

no_cache = True


def get_context(context):
    # check for valid requesting IPs
    csrf_token = get_csrf_token()
    frappe.db.commit()
    context.csrf_token = csrf_token
