# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""Demo data for frappe-demo and the screenshots in docs/screenshots/.

A small fabrication shop on the demo week: five employees with RFID tags, their punches from
Monday to the demo day (one of them forgot to clock out on Tuesday), the Workdays the app keeps
for those punches, and two work orders whose Job Cards carry logged time and one running timer.

Avery Chen is linked to the Administrator user, so the job time tracker (/job_timeclock) opens
signed in as an employee, the way it does on a shop-floor PC an employee has signed into.
"""

import datetime
from typing import Any, cast

import frappe
from erpnext.manufacturing.doctype.work_order.work_order import WorkOrder
from frappe.utils import add_days
from frappe.utils.password import get_encryption_key

from employee_timeclock.timeclock.report.workday_management.workday_management import sync_workday

SESSION_USER = "Administrator"
"""The user the screenshots sign in as; the first employee is linked to it."""

EMPLOYEES = [
	("Avery", "Chen", "Female", "0004417251"),
	("Jordan", "Patel", "Male", "0004417252"),
	("Maria", "Lopez", "Female", "0004417253"),
	("Sam", "Okafor", "Male", "0004417254"),
	("Priya", "Nair", "Female", "0004417255"),
]
"""First name, last name, gender and the RFID tag each employee badges in with."""

SHIFT = [(7, 0), (11, 30), (12, 0), (15, 30)]
"""A day's punches: in, out for lunch, back in, out. Each employee is a few minutes off them."""

FORGOT_TO_CLOCK_OUT = ("Jordan Patel", 1)
"""Who forgot the last punch, and on which day of the week (0 is Monday)."""

WORKSTATIONS = ["Cutting Station", "Welding Bay", "Assembly Bench", "Paint Booth"]
OPERATIONS = [
	("Cut Tubing", "Cutting Station"),
	("Weld Frame", "Welding Bay"),
	("Assemble", "Assembly Bench"),
	("Powder Coat", "Paint Booth"),
]
RAW_MATERIALS = ["Steel Tube 40mm", "Hardware Kit"]
PRODUCTS = [
	# item, quantity, minutes per operation
	("Steel Workbench", 10, [45, 90, 60, 30]),
	("Rolling Tool Cart", 6, [30, 60, 45, 30]),
]


def _employee(first: str, last: str, gender: str, tag: str, *, company: str, user: str | None) -> str:
	name = frappe.db.get_value("Employee", {"employee_name": f"{first} {last}"}, "name")
	if name:
		return cast(str, name)
	doc = frappe.get_doc(
		{
			"doctype": "Employee",
			"first_name": first,
			"last_name": last,
			"gender": gender,
			"date_of_birth": "1990-04-12",
			"date_of_joining": "2023-03-01",
			"status": "Active",
			"company": company,
			"user_id": user,
			"attendance_device_ids": [{"id": tag}],
		}
	).insert(ignore_permissions=True)
	return cast(str, doc.name)


def _punch(employee: str, time: datetime.datetime, log_type: str) -> None:
	if frappe.db.exists("Employee Checkin", {"employee": employee, "time": time}):
		return
	frappe.get_doc(
		{
			"doctype": "Employee Checkin",
			"employee": employee,
			"time": time,
			"log_type": log_type,
			"device_id": "Employee Clock-in/out Device",
		}
	).insert(ignore_permissions=True)


def _punches(employees: list[str], today: datetime.date) -> None:
	"""Monday to yesterday, a full shift each; today, the morning punch only (still on the clock)."""
	monday = today - datetime.timedelta(days=today.weekday())
	day = monday
	while day <= today:
		for i, employee in enumerate(employees):
			name = cast(str, frappe.db.get_value("Employee", employee, "employee_name"))
			shift = SHIFT[:1] if day == today else SHIFT
			if (name, (day - monday).days) == FORGOT_TO_CLOCK_OUT:
				shift = SHIFT[:3]
			for n, (hour, minute) in enumerate(shift):
				time = datetime.datetime.combine(day, datetime.time(hour, minute)) + datetime.timedelta(
					minutes=(i * 3 + n * 2) % 9
				)
				_punch(employee, time, "OUT" if n % 2 else "IN")
			sync_workday(employee, day)
		day = cast(datetime.date, add_days(day, 1))


def _job_cards(work_order: str) -> None:
	"""One Job Card per operation, when submitting the Work Order made none."""
	if frappe.db.exists("Job Card", {"work_order": work_order}):
		return
	order = frappe.get_doc("Work Order", work_order)
	for row in order.get("operations"):
		frappe.get_doc(
			{
				"doctype": "Job Card",
				"company": order.get("company"),
				"work_order": work_order,
				"operation": row.operation,
				"operation_id": row.name,
				"workstation": row.workstation,
				"for_quantity": order.get("qty"),
				"wip_warehouse": order.get("wip_warehouse"),
				"bom_no": order.get("bom_no"),
				"sequence_id": row.sequence_id or row.idx,
			}
		).insert(ignore_permissions=True)


def _work_orders(company: str, today: datetime.date) -> list[str]:
	for workstation in WORKSTATIONS:
		if not frappe.db.exists("Workstation", workstation):
			frappe.get_doc({"doctype": "Workstation", "workstation_name": workstation}).insert(
				ignore_permissions=True
			)
	for operation, workstation in OPERATIONS:
		if not frappe.db.exists("Operation", operation):
			frappe.get_doc({"doctype": "Operation", "name": operation, "workstation": workstation}).insert(
				ignore_permissions=True, set_name=operation
			)
	for item in RAW_MATERIALS + [product for product, _qty, _minutes in PRODUCTS]:
		if not frappe.db.exists("Item", item):
			frappe.get_doc(
				{
					"doctype": "Item",
					"item_code": item,
					"item_name": item,
					"item_group": "Products" if item not in RAW_MATERIALS else "Raw Material",
					"stock_uom": "Nos",
					"is_stock_item": 1,
					"valuation_rate": 25,
				}
			).insert(ignore_permissions=True)
	warehouse = frappe.db.get_value("Warehouse", {"is_group": 0, "company": company}, "name")
	names = []
	for i, (product, qty, minutes) in enumerate(PRODUCTS):
		name = frappe.db.get_value("Work Order", {"production_item": product, "docstatus": 1}, "name")
		if not name:
			bom = frappe.get_doc(
				{
					"doctype": "BOM",
					"company": company,
					"item": product,
					"quantity": 1,
					"is_active": 1,
					"is_default": 1,
					"with_operations": 1,
					"rm_cost_as_per": "Valuation Rate",
					"operations": [
						{"operation": operation, "workstation": workstation, "time_in_mins": mins}
						for (operation, workstation), mins in zip(OPERATIONS, minutes, strict=True)
					],
					"items": [{"item_code": item, "qty": 2} for item in RAW_MATERIALS],
				}
			).insert(ignore_permissions=True)
			bom.submit()
			work_order = cast(
				WorkOrder,
				frappe.get_doc(
					{
						"doctype": "Work Order",
						"production_item": product,
						"qty": qty,
						"bom_no": bom.name,
						"company": company,
						"wip_warehouse": warehouse,
						"fg_warehouse": warehouse,
						"planned_start_date": datetime.datetime.combine(
							cast(datetime.date, add_days(today, i - 2)), datetime.time(7, 0)
						),
					}
				),
			)
			work_order.get_items_and_operations_from_bom()
			work_order.insert(ignore_permissions=True)
			work_order.submit()
			name = work_order.name
		names.append(cast(str, name))
		_job_cards(cast(str, name))
	return names


def _job_time(employees: list[str], work_orders: list[str], today: datetime.date) -> None:
	"""Logged time on the workbench order, and Avery's welding timer, running since this morning."""
	frappe.flags.in_timeclock = True
	yesterday = cast(datetime.date, add_days(today, -1))
	logs = [
		# work order, operation, employee, day, from, to (None: still running)
		(0, "Cut Tubing", 2, yesterday, (7, 10), (11, 30)),
		(0, "Cut Tubing", 2, yesterday, (12, 5), (14, 45)),
		(0, "Weld Frame", 3, yesterday, (7, 15), (11, 35)),
		(0, "Weld Frame", 0, today, (7, 5), None),
		(1, "Cut Tubing", 4, today, (7, 10), (9, 40)),
	]
	for wo, operation, emp, day, start, end in logs:
		card = frappe.db.get_value(
			"Job Card",
			{"work_order": work_orders[wo], "operation": operation, "is_corrective_job_card": 0},
			"name",
		)
		from_time = datetime.datetime.combine(day, datetime.time(*start))
		if frappe.db.exists("Job Card Time Log", {"parent": card, "from_time": from_time}):
			continue
		job_card = frappe.get_doc("Job Card", cast(str, card))
		job_card.append(
			"time_logs",
			{
				"employee": employees[emp],
				"from_time": from_time,
				"to_time": datetime.datetime.combine(day, datetime.time(*end)) if end else None,
			},
		)
		job_card.save(ignore_permissions=True)
	frappe.flags.in_timeclock = False


def setup(ctx: dict[str, Any]) -> None:
	"""Create the demo shop once; every date comes from ``ctx["today"]``."""
	today = cast(datetime.date, ctx["today"])
	# The kiosks sign their badge JWTs with the site's encryption key; make sure the site has one.
	get_encryption_key()
	company = ctx.get("company") or frappe.db.get_single_value("Global Defaults", "default_company")
	employees = [
		_employee(*row, company=company, user=SESSION_USER if i == 0 else None)
		for i, row in enumerate(EMPLOYEES)
	]
	_punches(employees, today)
	work_orders = _work_orders(cast(str, company), today)
	_job_time(employees, work_orders, today)
