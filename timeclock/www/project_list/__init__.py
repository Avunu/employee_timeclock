import frappe
from frappe.rate_limiter import rate_limit
from frappe.utils.data import now_datetime, format_datetime


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=1, seconds=1)
def get_active_projects():
    """Returns list of active projects"""
    return {
        'projects': frappe.get_list("Project", filters={"status": "Open"}, fields=["name", "project_name"])
    }
