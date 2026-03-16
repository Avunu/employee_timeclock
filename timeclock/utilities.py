import frappe

rogue_workdays = frappe.get_all("Workday", filters={"employee_name": ""})

for workday in rogue_workdays:
	# check if an Employee Checkin is linked to the workday
	employee_checkin = frappe.get_all("Employee Checkin", filters={"workday": workday.name})
	if employee_checkin:
		for checkin in employee_checkin:
			frappe.delete_doc("Employee Checkin", checkin.name)
	frappe.delete_doc("Workday", workday.name)
