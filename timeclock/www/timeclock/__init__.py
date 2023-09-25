import getmac


import frappe
from frappe.rate_limiter import rate_limit
from frappe.utils.data import now_datetime, format_datetime


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=1, seconds=1)
def scan(barcode, qty=None):
	reload_timeclock = frappe.defaults.get_global_default("reload_timeclock")
	if reload_timeclock and int(reload_timeclock):
		frappe.defaults.set_global_default("reload_timeclock", 0)
		return {
			'reload_timeclock': True
		}

	barcode = str(barcode) if not isinstance(barcode, str) else barcode
	employee = frappe.db.get_value('Item Barcode', {'barcode': barcode}, ['parent', 'parenttype'], as_dict=True)
	if not employee or employee.parenttype != 'Employee':
		return {
			'message': 'Card Not Found',
			'employee_name': 'Guest',
			'checkins': []
		}

	employee = frappe.db.get_value('Employee', employee.parent, ['name', 'employee_name', 'user_id'], as_dict=True)
	# get last 3 attendance records
	checkins = frappe.get_all('Employee Checkin', {'employee': employee.name}, ['name', 'time', 'log_type', 'device_id'], order_by="time DESC", limit_page_length=3,)
	if not checkins:
		checkins = []
	else:
		for c in checkins:
			c.time = format_datetime(c.time, 'M-d-yyyy HH:mm:ss')
	return {
		'employee_name': employee.employee_name,
		'employee_id': employee.name,
		'checkins': checkins
	}

@frappe.whitelist(allow_guest=True)
@rate_limit(limit=1, seconds=1)
def log_in(employee_id):
	mac_address = getmac.get_mac_address()
	if frappe.db.exists('Timeclock', {'mac_address': mac_address}):
		timeclock = frappe.get_cached_value('Timeclock', {'mac_address': mac_address}, 'name')
	else:
		timeclock = 'Unknown Device'
	eci = frappe.new_doc('Employee Checkin')
	eci.employee = employee_id
	eci.time = now_datetime()
	eci.log_type = "IN"
	eci.device_id = timeclock
	eci.save(ignore_permissions=True)
	return {
		'message': f"Logged In at {format_datetime(eci.time, 'M-d-yyyy HH:mm:ss')}",
	}

@frappe.whitelist(allow_guest=True)
@rate_limit(limit=1, seconds=1)
def log_out(employee_id):
	mac_address = getmac.get_mac_address()
	if frappe.db.exists('Timeclock', {'mac_address': mac_address}):
		timeclock = frappe.get_cached_value('Timeclock', {'mac_address': mac_address}, 'name')
	else:
		timeclock = 'Unknown Device'
	eci = frappe.new_doc('Employee Checkin')
	eci.employee = employee_id
	eci.time = now_datetime()
	eci.log_type = "OUT"
	eci.device_id = timeclock
	eci.save(ignore_permissions=True)
	return {
		'message': f"Logged Out at {format_datetime(eci.time, 'M-d-yyyy HH:mm:ss')}",
	}