from erpnext.manufacturing.doctype.job_card.job_card import JobCard as BaseJobCard
from frappe.types import DF


class JobCard(BaseJobCard):
	"""Custom JobCard override for Timeclock-specific functionality with custom field types"""

	# Custom fields from job_card.json

	is_machine_time: DF.Check

	def get_overlap_for(self, args, open_job_cards=None):
		# Upstream calls get_open_job_cards unconditionally, which causes a false OverlapError
		# when employee is an empty string. Guard the check to only run when employee is set.
		if args.get("employee"):
			return super().get_overlap_for(args, open_job_cards)
		return []
