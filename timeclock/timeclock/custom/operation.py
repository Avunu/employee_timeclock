from erpnext.manufacturing.doctype.operation.operation import Operation as BaseOperation
from frappe.types import DF


class Operation(BaseOperation):
	"""Custom Operation override for Timeclock-specific functionality with custom field types"""

	# Custom fields from operation.json
	is_machine_time: DF.Check
	employee_group: DF.Link | None
