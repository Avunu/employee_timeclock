from . import __version__ as app_version
app_name = "timeclock"
app_title = "Timeclock"
app_publisher = "Avunu LLC"
app_description = "ERPNext Timeclock"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "mail@avu.nu"
app_license = "MIT"
webform_include_js = {
    "Employee Checkin": [
        "public/node_modules/@popperjs/core/dist/umd/popper-lite.min.js",
        "public/node_modules/@eonasdan/tempus-dominus/dist/js/tempus-dominus.min.js"
    ]
}
web_include_css = ["/assets/css/tempus-dominus.min.css",
                   "/assets/frappe/css/octicons/octicons.css"]

"""doc_events = {
    "Employee Checkin": {
        "on_change": "timeclock.timeclock.api.convert_checkin_to_workday",
    }
}"""
