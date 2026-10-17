# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

from erpnext.manufacturing.doctype.job_card_time_log.job_card_time_log import (
	JobCardTimeLog as BaseJobCardTimeLog,
)
from frappe.types import DF


class JobCardTimeLog(BaseJobCardTimeLog):
	"""Custom JobCardTimeLog override for Timeclock-specific functionality with custom field types"""

	# Custom fields from job_card_time_log.json

	machine_operator: DF.Link
