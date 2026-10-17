# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

app_name = "timeclock"
app_title = "Timeclock"
app_publisher = "Avunu LLC"
app_description = "ERPNext Timeclock"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "mail@avu.nu"
app_license = "MIT"
app_include_js = "timeclock.app.bundle.js"
export_python_type_annotations = True
required_apps = ["erpnext", "hrms"]

doc_events = {
	"Workday": {
		"before_save": "timeclock.timeclock.api.workday_update_total_hours",
		"on_update": "timeclock.timeclock.api.update_checkins_from_workday",
	},
	"Employee Checkin": {
		"before_insert": "timeclock.kiosk.refuse_web_form_checkin",
		"on_update": "timeclock.timeclock.api.update_workday_from_checkin",
		"on_trash": "timeclock.timeclock.api.clear_workday_punch_on_checkin_trash",
	},
}

extend_doctype_class = {"Job Card": "timeclock.timeclock.custom.job_card.TimeclockJobCard"}

doctype_js = {"Employee": "public/js/employee.js", "Job Card": "public/js/job_card.js"}

doctype_list_js = {"Job Card": "public/js/job_card_list.js"}

fixtures = [
	{"dt": "List View Settings", "filters": {"name": ("in", ("Job Card"))}},
	{"dt": "Role", "filters": [["name", "=", "Timeclock Kiosk"]]},
]
