# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

from datetime import datetime
from typing import cast

import frappe
from erpnext.manufacturing.doctype.job_card.job_card import JobCard as BaseJobCard
from frappe.types import DF
from frappe.utils import flt, get_datetime

from .job_card_time_log import JobCardTimeLog


class TimeclockJobCard(BaseJobCard):
	"""Job Card extension (extend_doctype_class) for Timeclock-specific functionality with custom field types"""

	# Custom fields from job_card.json

	is_machine_time: DF.Check
	# The rows carry the custom machine_operator field (custom/job_card_time_log.json). Table fields are
	# lists, which are invariant, so narrowing the row type is reported as an incompatible override.
	time_logs: DF.Table[JobCardTimeLog]  # ty: ignore[invalid-attribute-override]  # list invariance, see above

	def before_validate(self):
		if self.is_machine_time:
			for log in self.time_logs:
				if log.employee:
					if not log.machine_operator:
						log.machine_operator = log.employee
					log.employee = ""
		super().before_validate()

	def get_overlap_for(self, args, open_job_cards=None):
		# The timeclock closes an employee's open timers before starting a new one, so its
		# saves skip the overlap check; upstream can otherwise reject a stop and leave the
		# timer open. Desk edits keep the check.
		if frappe.flags.in_timeclock:
			return []
		# Upstream calls get_open_job_cards unconditionally, which causes a false OverlapError
		# when employee is an empty string. Only run the check when employee is set.
		if args.get("employee"):
			return super().get_overlap_for(args, open_job_cards)
		return []

	def validate_sequence_id(self):
		# v16 throws whenever an earlier operation has zero completed qty, which blocks
		# logging time on operations worked in parallel. Only enforce the sequence once
		# this card reports completed qty (matches v15 behavior)
		if not flt(self.total_completed_qty):
			return
		super().validate_sequence_id()

	@frappe.whitelist()
	def complete_job_card(self, **kwargs):
		# The End Time field drops seconds (HH:mm), so finishing in the same minute as a resume
		# sends an end time earlier than the open log's start
		open_starts = [
			cast(datetime, get_datetime(log.from_time))
			for log in self.time_logs
			if log.from_time and not log.to_time
		]
		if kwargs.get("end_time") and open_starts:
			kwargs["end_time"] = max(cast(datetime, get_datetime(kwargs["end_time"])), *open_starts)
		elif kwargs.get("end_time") and self.time_logs:
			# the timeclock stops timers on clock-out without pausing the card, so there may be no
			# open log for upstream to record the completed qty on, and it silently saves nothing
			last_log = self.time_logs[-1]
			last_log.completed_qty = flt(last_log.completed_qty) + flt(kwargs.get("qty"))
		return super().complete_job_card(**kwargs)

	def validate_on_hold(self):
		# A paused card has no running timer, so a completed qty typed into the time logs can be
		# submitted without resuming first; upstream blocks the submit and the form hides Resume
		if self.is_paused and self.docstatus == 1 and all(log.to_time for log in self.time_logs):
			self.is_paused = 0
		super().validate_on_hold()
