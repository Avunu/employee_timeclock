# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

from frappe.utils import nowdate


def get_context(context):
	# Replace the "Today" default with the actual current date in YYYY-MM-DD (internal) format.
	# The Date control's validate() only accepts YYYY-MM-DD; display conversion happens later.
	today = nowdate()  # always returns YYYY-MM-DD
	for field in context.web_form_doc.get("web_form_fields", []):
		if field.get("fieldname") == "manual_override_date":
			field["default"] = today
			break
