# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document

MAX_SHIFT_HOURS_LIMIT = 48
"""The longest maximum shift length allowed: past two days, a forgotten OUT would pair with a later shift's."""


class TimeclockSettings(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		max_shift_hours: DF.Float
	# end: auto-generated types

	def validate(self) -> None:
		if not 0 < self.max_shift_hours <= MAX_SHIFT_HOURS_LIMIT:
			frappe.throw(
				_("Maximum Shift Length must be more than 0 and at most {0} hours.").format(
					MAX_SHIFT_HOURS_LIMIT
				)
			)
