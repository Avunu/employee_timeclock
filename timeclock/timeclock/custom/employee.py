from erpnext.setup.doctype.employee.employee import Employee as BaseEmployee
from frappe.types import DF


class Employee(BaseEmployee):
	"""Custom Employee override for Timeclock-specific functionality with custom field types"""

	# Custom fields from employee.json
	from timeclock.timeclock.doctype.attendance_device_id.attendance_device_id import (
		AttendanceDeviceID,
	)

	attendance_device_ids: DF.Table[AttendanceDeviceID]
