# Copyright (c) 2022, Avunu LLC and contributors
# For license information, please see license.txt

import json
import frappe
import datetime
from frappe.model.document import Document

class Workday(Document):
	pass

@frappe.whitelist()
def bulk_add_punches(date, employees, punches):
	# separate comma separated string into list
	employees = employees.split(",")
	# remove empty strings
	employees = [x for x in employees if x != ' ']
	# remove empty rows ("{}") from punches
	punches = json.loads(punches)
	punches = [punch for punch in punches if punch != {}]
	log_types = ["IN", "OUT"]
	# frappe.flags.in_import = True
	for employee in employees:
		# remove any leading spaces from employee name
		employee = employee.lstrip()
		# frappe.emit_js(f{"console.log('Adding punches for employee: {employee}')"})
		# publish_realtime("eval_js", "console.log('Adding punches for employee: " + employee "');", user=session.user)
		employee_id = frappe.db.get_value("Employee", {"employee_name": employee})
		# # create checkins directly
		# for i in range(len(punches)):
		# 	for log_type in log_types:
		# 		frappe.get_doc({
		# 			"doctype": "Employee Checkin",
		# 			"employee": employee,
		# 			"date": date,
		# 			"time": datetime.datetime.strptime(date + " " + punches[i]['check' + log_type.lower()], "%Y-%m-%d %I:%M %p"),
		# 			"log_type": log_type,
		# 			"device_id": "Bulk Add Punches",
		# 			"manual_override": 1
		# 		}).insert()
		# 		frappe.db.commit()
		workday = frappe.get_doc({
			"doctype": "Workday",
			"employee": employee_id,
			"employee_name": employee,
			"date": date,
			"day_of_week": datetime.datetime.strptime(date, "%Y-%m-%d").strftime("%A")
		})
		# set name to format:{employee_name}-{date}-{#####}
		workday.name = workday.employee_name + "-" + workday.date
		# workday.employee = employee_id
		# workday.employee_name = employee
		# workday.date = date
		# workday.day_of_week = datetime.datetime.strptime(date, "%Y-%m-%d").strftime("%A")
		for i in range(len(punches)):
			workday.set(f'check_in_{i + 1}', punches[i]['checkin'])
			workday.set(f'check_out_{i + 1}', punches[i]['checkout'])
		workday.db_insert()
		frappe.db.commit()
		workday = frappe.get_doc("Workday", workday.name)
		workday.employee = employee_id
		# frappe.emit_js("frappe.show_alert", {"message": "Workday created for " + employee + ' with id ' + employee_id, "indicator": "green"})
		# frappe.emit_js("console.log", "Workday created for " + employee + ' with id ' + employee_id)
		workday.save()
	# frappe.flags.in_import = False
	
	return "success"