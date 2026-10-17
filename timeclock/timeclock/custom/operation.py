# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

from erpnext.manufacturing.doctype.operation.operation import Operation as BaseOperation
from frappe.types import DF


class Operation(BaseOperation):
	"""Typing-only shell for custom fields; intentionally not registered as a controller override."""

	# Custom fields from operation.json
	is_machine_time: DF.Check
	employee_group: DF.Link | None
