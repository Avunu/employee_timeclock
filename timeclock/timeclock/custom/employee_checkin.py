# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import frappe
from frappe.types import DF
from hrms.hr.doctype.employee_checkin.employee_checkin import EmployeeCheckin as BaseEmployeeCheckin


class EmployeeCheckin(BaseEmployeeCheckin):
	"""Typing-only shell for custom fields; intentionally not registered as a controller override."""

	attendance: DF.Link | None
	device_id: DF.Data | None
	employee: DF.Link
	employee_name: DF.Data | None
	latitude: DF.Float
	log_type: DF.Literal["", "IN", "OUT"]
	longitude: DF.Float
	offshift: DF.Check
	shift: DF.Link | None
	shift_actual_end: DF.Datetime | None
	shift_actual_start: DF.Datetime | None
	shift_end: DF.Datetime | None
	shift_start: DF.Datetime | None
	skip_auto_attendance: DF.Check
	time: DF.Datetime
	manual_override: DF.Check
	manual_override_date: DF.Date | None
	manual_override_time: DF.Time | None
	workday_override: DF.Check
	overridden_time: DF.Datetime | None
	workday: DF.Link | None
	workday_modified: DF.Datetime | None


def insert_punch(checkin: EmployeeCheckin) -> bool:
	"""Insert a punch from a timeclock page; on failure undo it, log the error and return False.

	The insert runs in a savepoint, so a punch that fails validation or in its ``on_update`` hook
	(the Workday sync) leaves neither the checkin nor a partial Workday behind, while the request
	can still answer the page with an "unsuccessful" status.
	"""
	savepoint = "timeclock_punch"
	frappe.db.savepoint(savepoint)
	try:
		checkin.insert(ignore_permissions=True)
	except Exception:
		frappe.db.rollback(save_point=savepoint)
		frappe.log_error(title=f"Timeclock punch failed for {checkin.employee}")
		return False
	frappe.db.release_savepoint(savepoint)
	return True
