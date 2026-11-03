# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

import datetime
import re
from typing import Literal, TypedDict, cast

import frappe
from frappe import _
from frappe.query_builder.functions import Sum
from frappe.rate_limiter import rate_limit
from frappe.utils import cint, get_first_day_of_week, getdate, now, now_datetime, today

from employee_timeclock.kiosk import (
	DEVICE_ID,
	KIOSK_SCAN_LIMIT,
	KIOSK_SCAN_WINDOW,
	require_kiosk_role,
	verify_badge,
)
from employee_timeclock.timeclock.custom.employee import Employee
from employee_timeclock.timeclock.custom.employee_checkin import EmployeeCheckin
from employee_timeclock.timeclock.doctype.workday.workday import Workday
from employee_timeclock.timeclock.shifts import (
	Shift,
	fill_workday,
	get_max_shift,
	get_max_shift_hours,
	get_shift_of,
	get_shifts,
	next_log_type,
	resync_around,
)


class KioskPunch(TypedDict):
	"""What ``submit_checkin`` returns to the Employee Clock-in/out web form."""

	log_type: Literal["IN", "OUT"]
	employee_name: str
	weekly_hours: float


LogType = Literal["", "IN", "OUT"]

# set invalid values for the time fields
invalid_values = ["", 0, "00:00", "undefined", None, "None", "null", "NULL"]
# get a collection of check_ins and check_outs
check_range = range(1, 13)


def _within_a_minute(elapsed: datetime.timedelta) -> bool:
	"""Whether a change was made less than a minute ago, counting whole days (unlike ``timedelta.seconds``)."""
	return datetime.timedelta(0) <= elapsed < datetime.timedelta(minutes=1)


def get_weekly_hours(employee: str) -> list[str | float]:
	"""Return ``[employee_name, hours]``: the employee's display name and this week's total hours."""
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
	workday = frappe.qb.DocType("Workday")
	result = (
		frappe.qb.from_(workday)
		.select(Sum(workday.total_hours))
		.where(workday.employee == employee)
		.where(workday.date.between(week_start, week_end))
	).run()
	# round the total hours to 2 decimal places; the sum is NULL when the week has no workdays
	total_hours = round(float(result[0][0] or 0), 2)
	# wrap the employee name and total hours into an array
	employee_hours = [employee_name, total_hours]
	# return the total hours
	return employee_hours


def determine_next_log_type(employee: str, at: datetime.datetime | None = None) -> Literal["IN", "OUT"]:
	"""Return the employee's next punch at ``at`` (default now): OUT while they have an IN open from
	the last maximum shift length, IN otherwise. A night shift's first scan after midnight is its OUT."""
	return next_log_type(employee, at)


def _as_datetime(value: object) -> datetime.datetime:
	if isinstance(value, datetime.datetime):
		return value
	return datetime.datetime.strptime(str(value).split(".")[0], "%Y-%m-%d %H:%M:%S")


def _edited_within_a_minute(workday_name: str | None) -> bool:
	"""Whether a Workday was saved less than a minute ago (its own save is still writing punches)."""
	if not workday_name:
		return False
	last_modified = frappe.db.get_value("Workday", workday_name, "last_modified")
	if not last_modified:
		return False
	current_time = now_datetime()
	return isinstance(current_time, datetime.datetime) and _within_a_minute(
		current_time - _as_datetime(last_modified)
	)


def _workday_of(employee: str, date: datetime.date) -> str | None:
	return cast(
		str | None,
		frappe.db.get_value("Workday", {"employee": employee, "date": date}, "name", order_by="creation asc"),
	)


def update_workday_from_checkin(checkin: EmployeeCheckin, method: str | None = None) -> EmployeeCheckin:
	"""Rebuild the Workdays a new or changed punch belongs to (the ``on_update`` hook).

	The punch's shift belongs to its IN's date, so a night shift's OUT updates the day before. A
	moved punch also rebuilds the Workday it was on.
	"""
	_ = method  # Explicitly mark as intentionally unused
	# the punch was written by a Workday save in the last minute: that save already holds it
	workday_modified = checkin.workday_modified or None
	if workday_modified:
		current_time = now_datetime()
		if isinstance(current_time, datetime.datetime) and _within_a_minute(
			current_time - _as_datetime(workday_modified)
		):
			return checkin
	checkin_time = _as_datetime(checkin.time)
	shift = get_shift_of(cast(str, checkin.name), checkin.employee, checkin_time)
	shift_date = shift.date if shift else checkin_time.date()
	# a Workday saved in the last minute is still writing its punches; leave it alone
	if _edited_within_a_minute(checkin.workday or _workday_of(checkin.employee, shift_date)):
		return checkin

	times = [checkin_time]
	previous_date = checkin.workday and frappe.db.get_value("Workday", checkin.workday, "date")
	if previous_date:
		times.append(datetime.datetime.combine(cast(datetime.date, getdate(previous_date)), datetime.time()))
	resync_around(checkin.employee, times)
	return checkin


# frappe.set_value(doctype, name, fieldname, value)


@frappe.whitelist(methods=["POST"])
@rate_limit(limit=KIOSK_SCAN_LIMIT, seconds=KIOSK_SCAN_WINDOW)
def submit_checkin(
	badge: str, time: str, log_type: str | None = None, manual_override: int | bool = 0
) -> KioskPunch:
	"""Record a punch from the Employee Clock-in/out web form for the employee whose badge was scanned.

	Only a Timeclock Kiosk user may call it, and the employee is the one the badge belongs to, never
	an ID the client names. The punch is OUT while the employee has an IN open from the last maximum
	shift length (so a night shift's scan after midnight is its OUT) and IN otherwise, unless the employee entered
	the time by hand, when the form's IN/OUT choice is used. A second scan in the same minute keeps
	the punch already recorded.

	Args:
		badge: The scanned badge: an issued badge token or a registered RFID tag.
		time: The punch time, ``YYYY-MM-DD HH:MM:SS``; seconds are dropped.
		log_type: ``IN`` or ``OUT``; used only with ``manual_override``.
		manual_override: Whether the employee entered the time by hand.

	Returns:
		The punch's log type, the employee's name and their hours this week, for the form's toast.

	Raises:
		frappe.PermissionError: The user is not a Timeclock Kiosk user.
		employee_timeclock.kiosk.KioskAuthenticationError: The badge is not recognised.
		frappe.RateLimitExceededError: Too many scans from this client.
	"""
	require_kiosk_role()
	employee = verify_badge(badge)
	punched_at = datetime.datetime.strptime(time, "%Y-%m-%d %H:%M:%S").replace(second=0)
	checkin_time = punched_at.strftime("%Y-%m-%d %H:%M:%S")
	if cint(manual_override):
		if log_type not in ("IN", "OUT"):
			frappe.throw(_("Choose Clock In or Clock Out."))
		next_log_type = cast(Literal["IN", "OUT"], log_type)
	else:
		next_log_type = determine_next_log_type(employee, punched_at)

	# a second scan inside the same minute keeps the punch already recorded
	existing = cast(
		str | None,
		frappe.db.get_value("Employee Checkin", {"employee": employee, "time": checkin_time}, "name"),
	)
	if existing:
		recorded = cast(Literal["IN", "OUT"], frappe.db.get_value("Employee Checkin", existing, "log_type"))
	else:
		checkin = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
		checkin.employee = employee
		checkin.time = checkin_time
		checkin.log_type = next_log_type
		checkin.manual_override = cint(manual_override)
		checkin.device_id = DEVICE_ID
		checkin.insert(ignore_permissions=True)
		update_workday_from_checkin(checkin)
		recorded = next_log_type

	employee_name, weekly_hours = get_weekly_hours(employee)
	return KioskPunch(log_type=recorded, employee_name=str(employee_name), weekly_hours=float(weekly_hours))


def enqueue_update_workday_from_checkin(checkin: EmployeeCheckin, method: str | None = None) -> None:
	_ = method  # Explicitly mark as intentionally unused
	frappe.enqueue(
		"employee_timeclock.timeclock.api.update_workday_from_checkin",
		queue="short",
		is_async=True,
		checkin=checkin,
	)


TIME_TEXT = re.compile(r"^\d{1,2}:\d{2} (AM|PM|am|pm)$")


def _parse_slot(date_str: str, text: str | None) -> datetime.datetime | None:
	"""A Workday's ``h:mm AM/PM`` text on the Workday's date, or None when it isn't a time."""
	if not text or not TIME_TEXT.match(text):
		return None
	# a time written as 0:30 AM means 12:30 AM
	if text.startswith("0:"):
		text = "12:" + text[2:]
	return datetime.datetime.strptime(f"{date_str} {text}", "%Y-%m-%d %I:%M %p")


def workday_update_total_hours(workday: Workday, method: str | None = None) -> Workday:
	"""Read a Workday's in and out text into its punch times and total (the ``before_save`` hook).

	Each slot is one shift. Its IN is on the Workday's date, and an OUT earlier than its IN is the
	next morning's, so a night shift entered as 10:00 PM to 6:00 AM counts 8 hours. A shift longer
	than the maximum shift length is refused.
	"""
	_unused = method
	workday.last_modified = now()
	date = workday.date
	date_str: str = date.strftime("%Y-%m-%d") if isinstance(date, datetime.date) else str(date)
	max_shift = get_max_shift()
	shifts: list[Shift] = []
	for i in check_range:
		check_in = _parse_slot(date_str, cast(str | None, workday.get(f"check_in_{i}")))
		check_out = _parse_slot(date_str, cast(str | None, workday.get(f"check_out_{i}")))
		if check_in and check_out and check_out < check_in:
			check_out += datetime.timedelta(days=1)
		if check_in and check_out and check_out - check_in > max_shift:
			frappe.throw(
				_("Row {0}: {1} to {2} is longer than the maximum shift of {3} hours.").format(
					i,
					workday.get(f"check_in_{i}"),
					workday.get(f"check_out_{i}"),
					f"{get_max_shift_hours():g}",
				)
			)
		if check_in or check_out:
			shifts.append(
				Shift(
					check_in=frappe._dict(time=check_in, log_type="IN") if check_in else None,
					check_out=frappe._dict(time=check_out, log_type="OUT") if check_out else None,
				)
			)

	workday = fill_workday(workday, shifts)

	# emit update event
	workday.notify_update()

	return workday


def clear_workday_punch_on_checkin_trash(checkin: EmployeeCheckin, method: str | None = None) -> None:
	"""Rebuild the Workdays a deleted punch was part of, without it (the ``on_trash`` hook).

	Removing a punch can re-pair its neighbours, so every day it could belong to is rebuilt.
	"""
	_ = method  # Explicitly mark as intentionally unused
	# a Workday save deleting the punches it no longer holds rebuilds itself; leave it alone, as for
	# any Workday saved in the last minute
	if frappe.flags.timeclock_writing_workday or _edited_within_a_minute(checkin.workday):
		return
	checkin_time = _as_datetime(checkin.time)
	times = [checkin_time]
	workday_date = checkin.workday and frappe.db.get_value("Workday", checkin.workday, "date")
	if workday_date:
		times.append(datetime.datetime.combine(cast(datetime.date, getdate(workday_date)), datetime.time()))
	resync_around(checkin.employee, times, exclude=[cast(str, checkin.name)])


def update_checkins_from_workday(workday: Workday, method: str | None = None) -> None:
	"""Write a saved Workday's punches back to Employee Checkins (the ``on_update`` hook).

	The Workday's punches are matched, IN with IN and OUT with OUT in time order, to the punches of
	the shifts that belong to its date: a moved punch keeps its original time in Overridden Time, a
	new one is created and one the Workday no longer holds is deleted.
	"""
	_ = method  # Explicitly mark as intentionally unused
	employee = workday.employee
	shifts = get_shifts(workday.date, workday.date, employee).get(employee, [])

	log_type: Literal["IN", "OUT"]
	for log_type in ("IN", "OUT"):
		kind = log_type.lower()
		existing: list[frappe._dict] = []
		for shift in shifts:
			punch = shift.check_in if log_type == "IN" else shift.check_out
			if punch is not None:
				existing.append(punch)
		existing.sort(key=lambda punch: _as_datetime(punch.time))
		wanted = sorted(
			cast(datetime.datetime, workday.get(f"check_{kind}_{i}_dt"))
			for i in check_range
			if workday.get(f"check_{kind}_{i}_dt")
		)
		for i, time in enumerate(wanted):
			if i < len(existing):
				checkin = cast(
					EmployeeCheckin, frappe.get_doc("Employee Checkin", cast(str, existing[i].name))
				)
				checkin.workday = workday.name
				if _as_datetime(checkin.time) != time:
					if checkin.workday_override == 0:
						checkin.workday_override = 1
						checkin.overridden_time = checkin.time
					checkin.time = time
					checkin.workday_modified = now()
				checkin.db_update()
			else:
				new_checkin = cast(EmployeeCheckin, frappe.new_doc("Employee Checkin"))
				new_checkin.employee = employee
				new_checkin.time = time
				new_checkin.log_type = log_type
				new_checkin.device_id = "Workday Management"
				new_checkin.workday = workday.name
				new_checkin.workday_modified = now()
				new_checkin.db_insert(ignore_if_duplicate=True)
		# the Workday no longer holds the rest
		for punch in existing[len(wanted) :]:
			frappe.flags.timeclock_writing_workday = True
			try:
				frappe.get_doc("Employee Checkin", cast(str, punch.name)).delete(ignore_permissions=True)
			finally:
				frappe.flags.timeclock_writing_workday = False
