# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import datetime
import time
from operator import attrgetter, itemgetter
from typing import Any

import frappe
import getmac
import jwt
from frappe import _
from frappe.query_builder import DocType
from frappe.rate_limiter import rate_limit
from frappe.utils.data import format_datetime, get_datetime, now_datetime

from employee_timeclock.auth import get_token_secret
from employee_timeclock.kiosk import KioskAuthenticationError, require_kiosk_role, resolve_badge


def refresh_token(employee_id):
	employee_name = frappe.get_value("Employee", {"employee": employee_id}, "employee_name")
	# If valid, generate a JWT
	expires = (datetime.datetime.now() + datetime.timedelta(minutes=30)).timestamp()
	token = jwt.encode(
		payload={"employee_id": employee_id, "employee_name": employee_name, "exp": expires},
		key=get_token_secret(),
		algorithm="HS256",
	)

	return token


@frappe.whitelist()
@rate_limit(limit=1, seconds=1)
def authenticate_employee(rfid: str):
	# the legacy job timeclock is a kiosk page: only a Timeclock Kiosk user may use it
	require_kiosk_role()
	# mac_address = getmac.get_mac_address()
	# Validate the RFID against the database
	employee_id = resolve_badge(rfid)

	if not employee_id:
		return {"status": "error", "message": _("Badge not recognised.")}

	# If valid, generate a JWT
	token = refresh_token(employee_id)

	# get the last employee checkin to see if the employee is clocked in or out
	last_checkin = frappe.get_list(
		"Employee Checkin",
		filters={"employee": employee_id},
		order_by="modified desc",
		limit=1,
		ignore_permissions=True,
		pluck="log_type",
	)

	# get the last Job Card Time Log where there is no to_time to see if a timer is running
	# open_job_card_time_log = frappe.get_list("Job Card Time Log",
	#                                             filters={"employee": employee_id,
	#                                                      "to_time": None},
	#                                             order_by="modified desc",
	#                                             limit=1,
	#                                             ignore_permissions=True,
	#                                             pluck="name")

	# if (open_job_card_time_log):
	#     open_job_card_name = frappe.get_value("Job Card Time Log", open_job_card_time_log, "parent")
	#     open_job_card = frappe.get_doc("Job Card", open_job_card_name)

	# check to see if there is any Job Card Time Log that was started but not ended

	return {"status": "success", "last_checkin": last_checkin[0] if last_checkin else None, "token": token}


def extract_employee_from_token(token):
	try:
		# Decode the JWT using the same secret key
		payload = jwt.decode(token, get_token_secret(), algorithms=["HS256"])
		employee_id = payload.get("employee_id")

		# refresh the token
		token = refresh_token(employee_id)

		if not employee_id:
			raise jwt.InvalidTokenError

		return employee_id, token

	except jwt.ExpiredSignatureError:
		# The token has expired
		frappe.throw(_("Token has expired. Please re-authenticate."), exc=KioskAuthenticationError)

	except jwt.InvalidTokenError:
		# The token is invalid for some other reason
		frappe.throw(_("Invalid token. Please re-authenticate."), exc=KioskAuthenticationError)

	# return {
	#     "status": "success",
	#     "last_checkin": last_checkin[0] if last_checkin else None,
	#     "open_job_card": open_job_card.name if open_job_card_time_log else None,
	#     "token": token}


@frappe.whitelist()
def log_in_employee(token: str, time: str):
	# the legacy job timeclock is a kiosk page: only a Timeclock Kiosk user may use it
	require_kiosk_role()

	employee_id, token = extract_employee_from_token(token)

	new_log = frappe.new_doc("Employee Checkin")
	new_log.employee = employee_id
	new_log.time = time
	new_log.log_type = "IN"
	new_log.manual_override = False
	new_log.device_id = "Job Timeclock Scanner"
	try:
		new_log.insert(ignore_permissions=True)
	except:
		pass
	if new_log:
		return {"status": "success", "log": new_log}
	else:
		return {"status": "unsuccessful", "log": new_log}

	# try:
	#     new_log.insert(ignore_permissions= True)
	#     return {"status":"success", "log": new_log}
	# except:
	#     return {"status":"unsuccessful", "log": new_log}


# Issue with logout. The log is made but _unsaved = True. so its not passing to workday management
@frappe.whitelist()
def log_out_employee(token: str, time: str):
	# the legacy job timeclock is a kiosk page: only a Timeclock Kiosk user may use it
	require_kiosk_role()
	employee_id, token = extract_employee_from_token(token)

	new_log = frappe.new_doc("Employee Checkin")
	new_log.employee = employee_id
	new_log.time = time
	new_log.log_type = "OUT"
	new_log.manual_override = False
	new_log.device_id = "Job Timeclock Scanner"
	try:
		new_log.insert(ignore_permissions=True)
		new_log.save()
	except:
		pass
	if new_log:
		return {"status": "success", "log": new_log}
	else:
		return {"status": "unsuccessful", "log": new_log}


@frappe.whitelist()
@rate_limit(limit=1, seconds=1)
def get_work_orders(token: str):
	# the legacy job timeclock is a kiosk page: only a Timeclock Kiosk user may use it
	require_kiosk_role()
	try:
		employee_id, token = extract_employee_from_token(token)
	except Exception as e:
		return e

	# Get the employee's work orders
	# work order status can be Submitted, Not Started, or In Process
	work_orders = frappe.get_list(
		"Work Order",
		filters={"status": ["in", ["Submitted", "Not Started", "In Process"]]},
		fields=["name", "production_item", "status"],
		ignore_permissions=True,
	)
	return {"status": "success", "token": token, "work_orders": work_orders}


def update_job_cards_with_time_log(job_cards, employee_id):
	machines = {
		"Machine Staining Hours": "HR-MACH-ST-00052",
		"Sanding Machine Hours": "HR-MACH-SA-00053",
		"CNC Machine Time": "HR-MACH-CNC-00051",
		"Planing Machine Time": "HR-MACH-PL-00054",
	}

	new_job_cards = []
	all_logs = []
	for card in job_cards:
		full = frappe.get_doc("Job Card", card.name)

		# get all the time Logs
		time_logs = full.time_logs
		all_logs.append(time_logs)

		# filter for machine.
		if card.operation in machines:
			for key, machine_id in machines.items():
				if key == card.operation:
					employee_logs = []
					for log in time_logs:
						if log.employee == machine_id:
							employee_logs.append(log)
					break
		# filter by employee.
		else:
			employee_logs = []
			for log in time_logs:
				if log.employee == employee_id:
					employee_logs.append(log)

		if employee_logs != []:
			latest_time_log = max(employee_logs, key=lambda log: log.from_time)
			card.time_logs = latest_time_log
			new_job_cards.append(card)
		else:
			card.time_logs = time_logs
			new_job_cards.append(card)

	return new_job_cards, all_logs


def check_jobcard_active(employee_job_cards):
	# Job cards coming in are already filtered by the employee clocked into system.

	active = 0
	active_cards = []
	for card in employee_job_cards:
		if card.time_logs:
			try:
				if card.time_logs.time_in_mins == 0:
					active += 1
				else:
					pass
			except:
				pass
			if active > 0:
				# card["is_active"] = True
				active_cards.append(True)
			else:
				# card["is_active"] = False
				active_cards.append(False)
			active = 0
		else:
			active_cards.append(False)

	# if len(active_cards) != len(employee_job_cards):
	#     return

	return active_cards


@frappe.whitelist()
@rate_limit(limit=4, seconds=1)
def get_job_cards(token: str, work_order: str):
	# the legacy job timeclock is a kiosk page: only a Timeclock Kiosk user may use it
	require_kiosk_role()
	# authenticate the employee
	try:
		employee_id, token = extract_employee_from_token(token)
	except Exception as e:
		return e

	# Get the employee's job cards
	job_cards = frappe.get_list(
		"Job Card",
		filters={"work_order": work_order, "is_corrective_job_card": 0},
		fields=["name", "operation", "status", "sequence_id"],
		ignore_permissions=True,
	)

	if job_cards == []:
		return {"status": "success", "token": token, "job_cards": job_cards, "time_logs": ""}
	else:
		job_cards, time_logs = update_job_cards_with_time_log(job_cards, employee_id)
		job_cards = sorted(job_cards, key=attrgetter("sequence_id"))
		active_cards = check_jobcard_active(job_cards)
		return {
			"status": "success",
			"token": token,
			"job_cards": job_cards,
			"time_logs": time_logs,
			"active_cards": active_cards,
		}


@frappe.whitelist()
def sort_jobcard_by_workstation(jobCards: list[dict[str, Any]], workstation: str):
	# the legacy job timeclock is a kiosk page: only a Timeclock Kiosk user may use it
	require_kiosk_role()
	operation_workstation = [
		{"workstation": "Planer", "operation": ["Planing Machine Time", "Pulling & Planing"]},
		{"workstation": "CNC", "operation": ["CNC Labor", "CNC Machine Time"]},
		{"workstation": "Hand Sanding", "operation": ["Hand Sanding"]},
		{
			"workstation": "Sander/Stainer",
			"operation": [
				"Sanding Machine Labor",
				"Sanding Machine Hours",
				"Machine Staining Labor",
				"Machine Staining Hours",
			],
		},
		{
			"workstation": "Truss Assembly",
			"operation": ["Truss Assembly", "Hardware Packing Labor", "Packing Labor"],
		},
		{"workstation": "T&G Cutting", "operation": ["T&G Cutting"]},
	]

	for entry in operation_workstation:
		if entry["workstation"] == workstation:
			operations = entry["operation"]

	top_index = []
	new_jobCards = []
	waste = []
	for card in jobCards:
		for station_operation in operations:
			if card["operation"] == station_operation and card not in waste:
				top_index.append(card)
				waste.append(card)
			elif card not in new_jobCards and card not in waste:
				new_jobCards.append(card)
				waste.append(card)

	if len(top_index) == 0:
		return {"status": "success", "sorted_job_cards": jobCards}

	i = 0
	for index in top_index:
		new_jobCards.insert(i, index)
		i += 1

	return {"status": "success", "sorted_job_cards": new_jobCards}


@frappe.whitelist()
def log_end_time_of_jobcard(employee_id: str, end_time: str, jobcard_name: str):
	# the legacy job timeclock is a kiosk page: only a Timeclock Kiosk user may use it
	require_kiosk_role()

	job_card = frappe.get_doc("Job Card", jobcard_name, ignore_permissions=True)

	# List of "Machine employees" to be able to run machines same time as other processes.
	machines = {
		"Machine Staining Hours": "HR-MACH-ST-00052",
		"Sanding Machine Hours": "HR-MACH-SA-00053",
		"CNC Machine Time": "HR-MACH-CNC-00051",
		"Planing Machine Time": "HR-MACH-PL-00054",
	}

	if job_card.operation in machines:
		for key, machine_id in machines.items():
			if key == job_card.operation:
				employee_id = machine_id
				break

	employee_logs = []
	for log in job_card.time_logs:
		if log.employee == employee_id:
			employee_logs.append(log)

	# last_time_log = job_card.time_logs[-1]
	last_time_log = employee_logs[-1]

	last_time_log.update(
		{
			"to_time": end_time,
		}
	)

	try:
		job_card.append("time_logs", last_time_log)
		job_card.save(ignore_permissions=True)
		updated_log = job_card.time_logs
		return {
			"status": "success",
			"updated_log": updated_log,
		}
	except:
		return {"status": "failed", "job_card": job_card}


# Function to check out employee of a job card, when they start a new one.
@frappe.whitelist()
def check_all_job_cards(employee_id: str, time: str):
	# the legacy job timeclock is a kiosk page: only a Timeclock Kiosk user may use it
	require_kiosk_role()
	# work_orders = frappe.db.get_list('Work Order', filters=[{
	#     'status':'Not Started'}, {'status':'In Process'}], pluck='name')
	work_orders = frappe.db.get_list(
		"Work Order",
		or_filters=[{"status": "Not Started"}, {"status": "In Process"}],
		fields=["name", "status"],
		ignore_permissions=True,
	)

	# Get all job cards and check for employee id
	job_cards_list = []
	for work_order in work_orders:
		# get job cards by work
		job_cards = frappe.db.get_list(
			"Job Card", filters={"work_order": work_order.name}, fields=["name"], ignore_permissions=True
		)

		if len(job_cards) == 0:
			pass
		else:
			for job_card in job_cards:
				full_job_card = frappe.get_doc("Job Card", job_card.name, ignore_permissions=True)
				job_card.time_logs = full_job_card.time_logs

				duplicate = []
				for log in job_card.time_logs:
					if log.employee == employee_id and job_card not in duplicate:
						job_cards_list.append(job_card)
						duplicate.append(job_card)
	# Exit if no job cards are found with employee.
	if len(job_cards_list) == 0:
		return "no cards logged out"

	machines = ["Machine Staining Hours", "Sanding Machine Hours", "CNC Machine Time", "Planing Machine Time"]

	# Go through job cards for employee
	card_logged_out = []
	for card in job_cards_list:
		# job_card = frappe.get_doc('Job Card', card.name, ignore_permissions = True)
		for log in card.time_logs:
			if not log.to_time and card and (card.operation not in machines) and log.employee == employee_id:
				response = log_end_time_of_jobcard(employee_id, time, card.name)
				card_logged_out.append(log)
			else:
				pass

	if len(card_logged_out) == 0:
		return "no cards logged out"
	# return {'card_logged_out':card_logged_out, 'employee':employee_id}
	return card_logged_out


@frappe.whitelist()
def log_start_time_of_jobcard(employee_id: str, start_time: str, jobcard_name: str):
	# the legacy job timeclock is a kiosk page: only a Timeclock Kiosk user may use it
	require_kiosk_role()

	job_card = frappe.get_doc("Job Card", jobcard_name, ignore_permissions=True)
	new_time_log = frappe.new_doc("Job Card Time Log")

	# List of "Machine employees" to be able to run machines same time as other processes.
	machines = {
		"Machine Staining Hours": "HR-MACH-ST-00052",
		"Sanding Machine Hours": "HR-MACH-SA-00053",
		"CNC Machine Time": "HR-MACH-CNC-00051",
		"Planing Machine Time": "HR-MACH-PL-00054",
	}

	if job_card.operation in machines:
		for key, machine_id in machines.items():
			if key == job_card.operation:
				# log out other machine times.
				card_logged_out = check_all_job_cards(machine_id, start_time)
				new_time_log.update({"from_time": start_time, "employee": machine_id})
				break

	else:
		# here so that machine time won't log employee out
		try:
			card_logged_out = check_all_job_cards(employee_id, start_time)
			new_time_log.update(
				{
					"from_time": start_time,
					"employee": employee_id,
				}
			)
		except:
			new_time_log.update(
				{
					"from_time": start_time,
					"employee": employee_id,
				}
			)

	try:
		job_card.append("time_logs", new_time_log)
		job_card.save(ignore_permissions=True)
		updated_log = job_card.time_logs
		return {
			"status": "success",
			"job_card": job_card,
			"updated_log": updated_log,
			"card_logged_out": card_logged_out,
		}

	except Exception as e:
		frappe.log_error("Error Saving Log", e)
		# job_card = 'log_start_time_failed.'
		job_card.save(ignore_permissions=True)
		return {"status": "failed", "job_card": job_card, "serverError": True}


@frappe.whitelist()
def check_for_erp_log_in():
	# the legacy job timeclock is a kiosk page: only a Timeclock Kiosk user may use it
	require_kiosk_role()
	if frappe.session.user != "Guest":
		return {"user_id": frappe.session.user}
	else:
		return {"user_id": frappe.session.user}


@frappe.whitelist()
def submit_jobcard(jobCard: dict[str, Any], complete_time: str, employee_id: str):
	# the legacy job timeclock is a kiosk page: only a Timeclock Kiosk user may use it
	require_kiosk_role()
	completed_qty = 1
	status = "Submitted"
	doc = frappe.get_doc("Job Card", jobCard["name"], ignore_permissions=True)

	if doc.time_logs and len(doc.time_logs) > 0:
		last_row = doc.time_logs[-1]

	if last_row and complete_time:
		for row in doc.time_logs:
			# return {'status':'success', 'job_card':row}
			if not row.to_time:
				row.update(
					{
						"to_time": get_datetime(complete_time),
						"operation": jobCard["operation"],
						"completed_qty": 1.0,
					}
				)

		doc.status = "Completed"
		doc.save(ignore_permission=True)
		return {"status": "success", "job_card": doc}

	else:
		error_message = "Log has unfinished times."
		return {"status": "failed", "error_message": error_message}
