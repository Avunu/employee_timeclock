# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

app_name = "employee_timeclock"
app_title = "Employee Timeclock"
app_publisher = "Avunu LLC"
app_description = "Badge-scan timeclock kiosks and job-card time tracking for ERPNext and HRMS"
app_email = "mail@avu.nu"
app_license = "MIT"
app_include_js = "employee_timeclock.app.bundle.js"
export_python_type_annotations = True
required_apps = ["erpnext", "hrms"]

add_to_apps_screen = [
	{
		"name": "employee_timeclock",
		"logo": "/assets/employee_timeclock/images/employee_timeclock-logo.svg",
		"title": "Employee Timeclock",
		"route": "/app/workday",
		"has_permission": "employee_timeclock.permissions.has_app_permission",
	}
]

doc_events = {
	"Workday": {
		"before_save": "employee_timeclock.timeclock.api.workday_update_total_hours",
		"on_update": "employee_timeclock.timeclock.api.update_checkins_from_workday",
	},
	"Employee Checkin": {
		"before_insert": "employee_timeclock.kiosk.refuse_web_form_checkin",
		"on_update": "employee_timeclock.timeclock.api.update_workday_from_checkin",
		"on_trash": "employee_timeclock.timeclock.api.clear_workday_punch_on_checkin_trash",
	},
}

extend_doctype_class = {"Job Card": "employee_timeclock.timeclock.custom.job_card.TimeclockJobCard"}

doctype_js = {"Employee": "public/js/employee.js", "Job Card": "public/js/job_card.js"}

doctype_list_js = {"Job Card": "public/js/job_card_list.js"}

# Serves each kiosk page's web app manifest and service worker - paths Frappe's own static pages
# refuse. See kiosk_pwa.py.
page_renderer = ["employee_timeclock.kiosk_pwa.KioskAppRenderer"]

fixtures = [
	{"dt": "List View Settings", "filters": {"name": ("in", ("Job Card"))}},
	{"dt": "Role", "filters": [["name", "=", "Timeclock Kiosk"]]},
]


# frappe-nix:rename-shim-begin timeclock
# timeclock's whitelisted methods under their old dotted paths, for callers that still use
# them (cached bundles, webhooks, bookmarks). Written by frappe-rename-app; keep it for
# at least one minor release after the rename.
override_whitelisted_methods = {
	**globals().get("override_whitelisted_methods", {}),
	"timeclock.kiosk.issue_badge": "employee_timeclock.kiosk.issue_badge",
	"timeclock.kiosk.revoke_badge": "employee_timeclock.kiosk.revoke_badge",
	"timeclock.timeclock.api.submit_checkin": "employee_timeclock.timeclock.api.submit_checkin",
	"timeclock.timeclock.doctype.workday.workday.bulk_add_punches": "employee_timeclock.timeclock.doctype.workday.workday.bulk_add_punches",
	"timeclock.timeclock.report.workday_management.workday_management.update_checkin": "employee_timeclock.timeclock.report.workday_management.workday_management.update_checkin",
	"timeclock.timeclock.report.workday_management.workday_management.add_checkin": "employee_timeclock.timeclock.report.workday_management.workday_management.add_checkin",
	"timeclock.timeclock.report.workday_management.workday_management.delete_checkins": "employee_timeclock.timeclock.report.workday_management.workday_management.delete_checkins",
	"timeclock.timeclock.report.workday_management.workday_management.rebuild_workdays": "employee_timeclock.timeclock.report.workday_management.workday_management.rebuild_workdays",
	"timeclock.www.job_timeclock.job_timeclock.authenticate_employee": "employee_timeclock.www.job_timeclock.job_timeclock.authenticate_employee",
	"timeclock.www.job_timeclock.job_timeclock.log_in_employee": "employee_timeclock.www.job_timeclock.job_timeclock.log_in_employee",
	"timeclock.www.job_timeclock.job_timeclock.log_out_employee": "employee_timeclock.www.job_timeclock.job_timeclock.log_out_employee",
	"timeclock.www.job_timeclock.job_timeclock.get_work_orders": "employee_timeclock.www.job_timeclock.job_timeclock.get_work_orders",
	"timeclock.www.job_timeclock.job_timeclock.get_operations": "employee_timeclock.www.job_timeclock.job_timeclock.get_operations",
	"timeclock.www.job_timeclock.job_timeclock.get_active_timer": "employee_timeclock.www.job_timeclock.job_timeclock.get_active_timer",
	"timeclock.www.job_timeclock.job_timeclock.start_timer": "employee_timeclock.www.job_timeclock.job_timeclock.start_timer",
	"timeclock.www.job_timeclock.job_timeclock.stop_timer": "employee_timeclock.www.job_timeclock.job_timeclock.stop_timer",
	"timeclock.www.job_timeclock.job_timeclock.get_user_session_employee": "employee_timeclock.www.job_timeclock.job_timeclock.get_user_session_employee",
	"timeclock.www.job_timeclock.job_timeclock.get_workstations": "employee_timeclock.www.job_timeclock.job_timeclock.get_workstations",
	"timeclock.www.job_timeclock.job_timeclock.get_device_info": "employee_timeclock.www.job_timeclock.job_timeclock.get_device_info",
	"timeclock.www.job_timeclock.job_timeclock.get_machine_timers": "employee_timeclock.www.job_timeclock.job_timeclock.get_machine_timers",
	"timeclock.www.job_timeclock.job_timeclock.stop_machine_timer": "employee_timeclock.www.job_timeclock.job_timeclock.stop_machine_timer",
	"timeclock.www.job_timeclock.job_timeclock.submit_jobcard": "employee_timeclock.www.job_timeclock.job_timeclock.submit_jobcard",
	"timeclock.www.timeclock.authenticate_employee": "employee_timeclock.www.timeclock.authenticate_employee",
	"timeclock.www.timeclock.log_in_employee": "employee_timeclock.www.timeclock.log_in_employee",
	"timeclock.www.timeclock.log_out_employee": "employee_timeclock.www.timeclock.log_out_employee",
}
# frappe-nix:rename-shim-end
