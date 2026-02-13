app_name = "timeclock"
app_title = "Timeclock"
app_publisher = "Avunu LLC"
app_description = "ERPNext Timeclock"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "mail@avu.nu"
app_license = "MIT"
app_include_js = "timeclock.bundle.js"
export_python_type_annotations = True
required_apps = ["erpnext", "hrms"]

webform_include_js = {
	"Employee Checkin": [
		"public/node_modules/@popperjs/core/dist/umd/popper-lite.min.js",
		"public/node_modules/@eonasdan/tempus-dominus/dist/js/tempus-dominus.min.js",
	]
}

webform_include_css = {
	"Employee Checkin": [
		"timeclock/public/node_modules/@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css"
	]
}

web_include_css = [
	"/assets/timeclock/node_modules/@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css",
	"/assets/frappe/css/octicons/octicons.css",
]

doc_events = {
	"Workday": {
		"before_save": "timeclock.timeclock.api.workday_update_total_hours",
		"on_update": "timeclock.timeclock.api.update_checkins_from_workday",
	},
	"Employee Checkin": {
		"on_update": "timeclock.timeclock.api.update_workday_from_checkin",
		"on_trash": "timeclock.timeclock.api.clear_workday_punch_on_checkin_trash",
	},
}

override_doctype_class = {
	"Employee Checkin": "timeclock.timeclock.custom.employee_checkin.EmployeeCheckin",
	"Employee": "timeclock.timeclock.custom.employee.Employee",
	"Operation": "timeclock.timeclock.custom.operation.Operation",
}

# include tempus-dominus.min.js on the workday doctype
# doctype_js = {
#     "Workday": ["public/node_modules/@popperjs/core/dist/umd/popper-lite.min.js",
#                 "public/node_modules/@eonasdan/tempus-dominus/dist/js/tempus-dominus.min.js",
#                 "public/node_modules/@eonasdan/tempus-dominus/dist/plugins/customDateFormat.js"]
# }

doctype_list_js = {
    "Job Card": "public/js/job_card.js"
}

# doctype_css = {
#     "Workday": "/assets/timeclock/node_modules/@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css"
# }

# doctype_list_css = {
#     "Workday": "/assets/timeclock/node_modules/@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css"
# }
