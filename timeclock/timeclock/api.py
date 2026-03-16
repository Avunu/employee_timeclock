import calendar
import datetime
import json
import re
from typing import Any, Literal, TypedDict, cast

import frappe
from frappe.utils import get_first_day_of_week, now, now_datetime, today

from timeclock.timeclock.custom.employee import Employee
from timeclock.timeclock.custom.employee_checkin import EmployeeCheckin
from timeclock.timeclock.doctype.workday.workday import Workday


class CheckinData(TypedDict):
	"""Type definition for checkin data from web forms."""

	employee: str
	time: str
	log_type: Literal["IN", "OUT"]
	manual_override: int
	device_id: str


LogType = Literal["", "IN", "OUT"]

# set invalid values for the time fields
invalid_values = ["", 0, "00:00", "undefined", None, "None", "null", "NULL"]
# get a collection of check_ins and check_outs
check_range = range(1, 13)


@frappe.whitelist(allow_guest=True)
def get_weekly_hours(employee: str) -> list[str | float]:
	employee_doc = cast(Employee, frappe.get_doc("Employee", employee))
	employee_name = employee_doc.get_title()
	# get the start and end dates of the week
	week_start_raw = get_first_day_of_week(today())
	if isinstance(week_start_raw, str):
		week_start = datetime.datetime.strptime(week_start_raw, "%Y-%m-%d").date()
	else:
		week_start = week_start_raw
	week_end = week_start + datetime.timedelta(days=6)
	# get the total hours for the week
	total_hours = frappe.get_all(
		"Workday",
		filters={"employee": employee, "date": ["between", [week_start, week_end]]},
		fields=["sum(total_hours) as total_hours"],
		order_by="date asc",
		group_by="employee",
		as_list=True,
	)
	# round the total hours to 2 decimal places
	total_hours = round(total_hours[0][0], 2)
	# wrap the employee name and total hours into an array
	employee_hours = [employee_name, total_hours]
	# return the total hours
	return employee_hours


@frappe.whitelist(allow_guest=True)
def determine_next_log_type(employee: str, data: Any = None) -> Literal["IN", "OUT"]:
	# data is unused
	_ = data  # Explicitly mark as intentionally unused

	# Get the checkins and checkouts of the employee for the current day
	response: list[dict[str, Any]] = frappe.get_all(
		"Employee Checkin",
		filters={"employee": employee, "time": [">", today()]},
		order_by="time asc",
		fields=["time", "log_type"],
	)

	# if response is empty then the employee has not checked in yet
	if response == []:
		return "IN"

	# if the last log type is in then the next log type is out
	if response[-1]["log_type"] == "IN":
		return "OUT"
	return "IN"


def build_workday(checkin_times: list[datetime.datetime], workday: Workday) -> Workday:
	# sort the check_times
	checkin_times.sort()
	# set the form fields based on the check_times
	for i in range(len(checkin_times)):
		if i % 2 == 0:
			workday.set("check_in_" + str(int(i / 2) + 1), checkin_times[i].strftime("%-I:%M %p"))
			workday.set("check_in_" + str(int(i / 2) + 1) + "_dt", checkin_times[i])
		else:
			workday.set("check_out_" + str(int(i / 2) + 1), checkin_times[i].strftime("%-I:%M %p"))
			workday.set("check_out_" + str(int(i / 2) + 1) + "_dt", checkin_times[i])
	# clear any remaining check_ins and check_outs
	for i in range(len(checkin_times), 24):
		if i % 2 == 0:
			# # debug
			# frappe.msgprint(f'clearing check_in_{int(i/2)+1}')
			workday.set("check_in_" + str(int(i / 2) + 1), None)
			workday.set("check_in_" + str(int(i / 2) + 1) + "_dt", None)
		else:
			# # debug
			# frappe.msgprint(f'clearing check_out_{int(i/2)+1}')
			workday.set("check_out_" + str(int(i / 2) + 1), None)
			workday.set("check_out_" + str(int(i / 2) + 1) + "_dt", None)

	# calculate the total hours worked
	total_hours: float = 0.0
	for i in check_range:
		check_in = cast(datetime.datetime | None, workday.get(f"check_in_{i}_dt"))
		check_out = cast(datetime.datetime | None, workday.get(f"check_out_{i}_dt"))
		# if both check_in and check_out are datetime objects, then calculate the hours
		if isinstance(check_in, datetime.datetime) and isinstance(check_out, datetime.datetime):
			check_hours = (check_out - check_in).total_seconds() / 3600
			total_hours += check_hours

	# set the total hours worked
	workday.total_hours = total_hours

	return workday


@frappe.whitelist(allow_guest=True)
def update_workday_from_checkin(checkin: EmployeeCheckin, method: str | None = None) -> EmployeeCheckin:
	_ = method  # Explicitly mark as intentionally unused
	# if the workday was modified in the last minute, then break
	workday_modified = checkin.workday_modified or None
	if workday_modified:
		if not isinstance(workday_modified, datetime.datetime):
			workday_modified = datetime.datetime.strptime(
				str(workday_modified).split(".")[0], "%Y-%m-%d %H:%M:%S"
			)
		current_time = now_datetime()
		if isinstance(current_time, datetime.datetime) and (current_time - workday_modified).seconds < 60:
			return checkin
	# get the date from the checkin
	checkin_time_raw = checkin.time
	# check to see if checkin_time is a datetime object
	if not isinstance(checkin_time_raw, datetime.datetime):
		# if it's not then convert it to a datetime object
		checkin_time = datetime.datetime.strptime(str(checkin_time_raw), "%Y-%m-%d %H:%M:%S")
	else:
		checkin_time = checkin_time_raw
	# if a workday is linked to the checkin then use it
	workday_name: str | None = None
	if checkin.workday:
		workday_name = checkin.workday
	else:
		# get a workday for the same day as the checkin
		workday_list: list[list[str]] = frappe.get_all(
			"Workday",
			filters={"employee": checkin.employee, "date": checkin_time.date()},
			fields=["name"],
			order_by="date asc",
			as_list=True,
		)
		if workday_list:
			workday_name = workday_list[0][0]

	workday: Workday
	if workday_name:
		# get the workday
		workday = cast(Workday, frappe.get_doc("Workday", workday_name))
		# if the workday was modified in the last minute then don't do anything
		if workday.last_modified:
			last_modified = workday.last_modified
			if not isinstance(last_modified, datetime.datetime):
				last_modified = datetime.datetime.strptime(
					str(last_modified).split(".")[0], "%Y-%m-%d %H:%M:%S"
				)
			current_time = now_datetime()
			if isinstance(current_time, datetime.datetime) and (current_time - last_modified).seconds < 60:
				return checkin
	else:
		# if the workday does not exist then create it
		workday = cast(Workday, frappe.new_doc("Workday"))
		workday.employee = checkin.employee

		# get employee name from employee
		employee_name = cast(str, frappe.get_value("Employee", checkin.employee, "employee_name"))
		workday.employee_name = employee_name
		workday.date = checkin_time.date()
		workday.day_of_week = calendar.day_name[checkin_time.weekday()]
		workday.last_modified = now()
		workday.db_insert(ignore_if_duplicate=True)

	# debug
	# frappe.msgprint('checkin_time: '+str(checkin_time))
	# frappe.msgprint('workday: '+str(workday.name))

	checkin_times: list[datetime.datetime] = frappe.get_all(
		"Employee Checkin",
		filters={
			"employee": workday.employee,
			"time": ["between", [workday.date, workday.date]],
		},
		fields=["time"],
		order_by="time asc",
		pluck="time",
	)

	if checkin_time not in checkin_times:
		checkin_times.append(checkin_time)
	# frappe.error_log('checkin_times: '+str(checkin_times))

	workday = build_workday(checkin_times, workday)
	workday.db_update()

	# debug
	# frappe.msgprint('checkin: '+str(checkin.name))

	# connect the workday to the checkin
	# checkin.workday = workday.name
	# checkin.workday_modified = now_datetime()
	# checkin.save(ignore_permissions=True)
	frappe.db.set_value("Employee Checkin", checkin.name, "workday", workday.name)
	# workday.save(ignore_permissions=True)
	frappe.db.commit()

	return checkin


# frappe.set_value(doctype, name, fieldname, value)


@frappe.whitelist(allow_guest=True)
def submit_checkin(web_form: Any, data: str) -> LogType:
	"""Save the web form"""
	_ = web_form  # Explicitly mark as intentionally unused
	parsed_data = cast(CheckinData, frappe._dict(json.loads(data)))
	entry_time = datetime.datetime.strptime(parsed_data["time"], "%Y-%m-%d %H:%M:%S")
	checkin_time = entry_time.strftime("%Y-%m-%d %H:%M") + ":00"
	# make sure that checkin doesn't exist with the same time
	checkin_exists: list[dict[str, str]] = frappe.get_all(
		"Employee Checkin",
		filters={"employee": parsed_data["employee"], "time": entry_time.strftime("%Y-%m-%d %H:%M") + ":00"},
		fields=["name"],
		order_by="time desc",
	)
	if checkin_exists:
		checkin = cast(EmployeeCheckin, frappe.get_doc("Employee Checkin", checkin_exists[0]["name"]))
		# update the checkin
		checkin.time = checkin_time
		checkin.save(ignore_permissions=True)
		frappe.db.commit()
	else:
		# create the checkin
		checkin = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
		checkin.employee = parsed_data["employee"]
		checkin.time = checkin_time
		checkin.log_type = parsed_data["log_type"]
		checkin.manual_override = parsed_data["manual_override"]
		checkin.device_id = parsed_data["device_id"]
		checkin.insert(ignore_permissions=True)
		# update the workday
		update_workday_from_checkin(checkin)

	return checkin.log_type


def enqueue_update_workday_from_checkin(checkin: EmployeeCheckin, method: str | None = None) -> None:
	_ = method  # Explicitly mark as intentionally unused
	frappe.enqueue(
		"timeclock.timeclock.api.update_workday_from_checkin", queue="short", is_async=True, checkin=checkin
	)


@frappe.whitelist(allow_guest=True)
def workday_update_total_hours(workday: Workday, method: str | None = None) -> Workday:
	_ = method  # Explicitly mark as intentionally unused
	workday.last_modified = now()
	date = workday.date
	date_str: str
	if isinstance(date, datetime.datetime):
		date_str = date.strftime("%Y-%m-%d")
	else:
		date_str = str(date)
	check_ins = cast(list[str | None], [workday.get("check_in_" + str(i)) for i in check_range])
	check_outs = cast(list[str | None], [workday.get("check_out_" + str(i)) for i in check_range])
	# test each check_in and check_out to see if it is a valid time string in the format '%I:%M %p'
	regex = re.compile(r"^\d{1,2}:\d{2} (AM|PM|am|pm)$")
	valid_check_ins: list[str] = [x for x in check_ins if x and regex.match(x)]
	valid_check_outs: list[str] = [x for x in check_outs if x and regex.match(x)]
	# combine the check_ins and check_outs into a single list
	check_times: list[datetime.datetime] = []
	for i in range(len(valid_check_ins)):
		# if the check_in starts with '0:' then replace it with '12:'
		check_in_str = valid_check_ins[i]
		if check_in_str.startswith("0:"):
			check_in_str = "12:" + check_in_str[2:]
		check_times.append(datetime.datetime.strptime(date_str + " " + check_in_str, "%Y-%m-%d %I:%M %p"))
	for i in range(len(valid_check_outs)):
		# if the check_out starts with '0:' then replace it with '12:'
		check_out_str = valid_check_outs[i]
		if check_out_str.startswith("0:"):
			check_out_str = "12:" + check_out_str[2:]
		check_times.append(datetime.datetime.strptime(date_str + " " + check_out_str, "%Y-%m-%d %I:%M %p"))

	workday = build_workday(check_times, workday)

	# emit update event
	workday.notify_update()

	return workday


def clear_workday_punch_on_checkin_trash(checkin: EmployeeCheckin, method: str | None = None) -> None:
	_ = method  # Explicitly mark as intentionally unused
	# check to see if a workday is linked to the checkin
	if checkin.workday:
		# get workday based on checkin.
		workday = cast(Workday, frappe.get_doc("Workday", checkin.workday))
		# if the workday was modified in the last minute then don't do anything
		if workday.last_modified:
			last_modified = workday.last_modified
			if not isinstance(last_modified, datetime.datetime):
				last_modified = datetime.datetime.strptime(
					str(last_modified).split(".")[0], "%Y-%m-%d %H:%M:%S"
				)
			current_time = now_datetime()
			if isinstance(current_time, datetime.datetime) and (current_time - last_modified).seconds < 60:
				return
		# find the workday checking field that matches the checkin time
		for i in check_range:
			if workday.get("check_in_" + str(i) + "_dt") == checkin.time:
				frappe.db.set_value("Workday", workday.name, "check_in_" + str(i), None)
				frappe.db.set_value("Workday", workday.name, "check_in_" + str(i) + "_dt", None)
			if workday.get("check_out_" + str(i) + "_dt") == checkin.time:
				frappe.db.set_value("Workday", workday.name, "check_out_" + str(i), None)
				frappe.db.set_value("Workday", workday.name, "check_out_" + str(i) + "_dt", None)

		# reload the workday from the database
		workday.reload()
		# recalculate the total hours
		workday = workday_update_total_hours(workday)
		# commit the changes
		frappe.db.set_value("Workday", workday.name, "total_hours", workday.total_hours)
		# commit the changes
		workday.db_update()
		frappe.db.commit()


@frappe.whitelist(allow_guest=True)
def update_checkins_from_workday(workday: Workday, method: str | None = None) -> None:
	_ = method  # Explicitly mark as intentionally unused
	# update employee checkins using the workday check_in and check_out fields
	employee = workday.employee
	date = workday.date

	# cycle through the workday check in/out times, updating the Employee Checkin docs
	log_type: Literal["in", "out"]
	for log_type in cast(list[Literal["in", "out"]], ["in", "out"]):
		# get all checkins for the employee and date
		existing_checkins: list[dict[str, Any]] = frappe.get_all(
			"Employee Checkin",
			filters={"employee": employee, "time": ["between", [date, date]], "log_type": log_type.upper()},
			fields=["name", "time"],
			order_by="time asc",
		)
		for i in check_range:
			check_in_out_time = cast(datetime.datetime | None, workday.get(f"check_{log_type}_{i}_dt"))
			if check_in_out_time:
				if len(existing_checkins) >= i:
					# update the checkin
					checkin = cast(
						EmployeeCheckin, frappe.get_doc("Employee Checkin", existing_checkins[i - 1]["name"])
					)
					checkin.workday = workday.name
					# check to see if the checkin needs to be updated by comparing the times
					if checkin.time != check_in_out_time:
						if checkin.workday_override == 0:
							checkin.workday_override = 1
							checkin.overridden_time = checkin.time
						checkin.time = check_in_out_time
						checkin.workday_modified = now()
						checkin.db_update()
						frappe.db.commit()
				else:
					# create a new checkin
					new_checkin = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
					new_checkin.employee = employee
					new_checkin.time = check_in_out_time
					# Cast log_type.upper() to the expected Literal type
					new_checkin.log_type = cast(LogType, log_type.upper())
					new_checkin.device_id = "Workday Management"
					new_checkin.workday = workday.name
					new_checkin.workday_modified = now()
					new_checkin.db_insert(ignore_if_duplicate=True)
			else:
				# if the check in time is blank delete the corresponding check in
				if len(existing_checkins) >= i and check_in_out_time is None:
					checkin_to_delete = frappe.get_doc("Employee Checkin", existing_checkins[i - 1]["name"])
					checkin_to_delete.delete(ignore_permissions=True)
					frappe.db.commit()


@frappe.whitelist(allow_guest=True)
def submit_checkin2(data: str) -> None:
	"""Save the web form"""
	parsed_data = cast(CheckinData, frappe._dict(json.loads(data)))
	entry_time = datetime.datetime.strptime(parsed_data["time"], "%Y-%m-%d %H:%M:%S")
	checkin_time = entry_time.strftime("%Y-%m-%d %H:%M") + ":00"
	# make sure that checkin doesn't exist with the same time
	checkin_exists: list[dict[str, str]] = frappe.get_all(
		"Employee Checkin",
		filters={
			"employee": parsed_data["employee"],
			"time": checkin_time,
		},
		fields=["name"],
		order_by="time desc",
	)
	if checkin_exists:
		# DO WE NEED THIS? THE EMPLOYEE AND TIME ARE ALREADY IN...
		checkin = cast(EmployeeCheckin, frappe.get_doc("Employee Checkin", checkin_exists[0]["name"]))
		# update the checkin
		checkin.time = checkin_time
		checkin.save(ignore_permissions=True)
		frappe.db.commit()
	else:
		# create the checkin
		checkin = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
		checkin.employee = parsed_data["employee"]
		checkin.time = checkin_time
		checkin.log_type = parsed_data["log_type"]
		checkin.manual_override = parsed_data["manual_override"]
		checkin.device_id = parsed_data["device_id"]
		checkin.insert(ignore_permissions=True)
		# update the workday
		update_workday_from_checkin(checkin)
