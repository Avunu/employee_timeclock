import json

import frappe
import time
import datetime
import calendar


@frappe.whitelist(allow_guest=True)
def get_weekly_hours(employee):
    employee_doc = frappe.get_doc('Employee', employee)
    employee_name = employee_doc.get_title()
    # get the start and end dates of the week
    week_start = frappe.utils.get_first_day_of_week(frappe.utils.today())
    week_end = week_start + datetime.timedelta(days=6)
    # get the total hours for the week
    total_hours = frappe.get_all('Workday',
                                    filters={
                                        'employee': employee,
                                        'date': ['between', [week_start, week_end]]
                                    },
                                    fields=['sum(total_hours) as total_hours'],
                                    order_by='date asc',
                                    group_by='employee',
                                    as_list=True
                                    )
    # round the total hours to 2 decimal places
    total_hours = round(total_hours[0][0], 2)
    # wrap the employee name and total hours into an array
    employee_hours = [employee_name, total_hours]
    # return the total hours
    return employee_hours


@frappe.whitelist(allow_guest=True)
def determine_next_log_type(employee, data):
    data = frappe._dict(json.loads(data))

    # Get the checkins and checkouts of the employee for the current day
    response = frappe.get_all('Employee Checkin',
                              filters={
                                  'employee': employee,
                                  'time': ['>', frappe.utils.today()]
                              },
                              order_by='time asc',
                              fields=['time', 'log_type'],
                              )

    # if response is empty then the employee has not checked in yet
    if response == []:
        next_log_type = "IN"
    else:
        # if the last log type is in then the next log type is out
        if response[-1]['log_type'] == "IN":
            next_log_type = "OUT"
        else:
            next_log_type = "IN"

    # Return "IN" or "OUT" based on last checkin or out
    return next_log_type


# frappe.set_value(doctype, name, fieldname, value)

@frappe.whitelist(allow_guest=True)
def submit_checkin(web_form, data):
    """Save the web form"""
    data = frappe._dict(json.loads(data))
    entry_time = datetime.datetime.strptime(data.time, '%Y-%m-%d %H:%M:%S')
    # make sure that checkin doesn't exist with the same time
    checkin_exists = frappe.get_all('Employee Checkin',
                                filters={
                                    'employee': data.employee,
                                    'time': entry_time.strftime('%Y-%m-%d %H:%M')+':00'
                                },
                                fields=['name'],
                                order_by='time asc',
                                )
    if checkin_exists:
        checkin = frappe.get_doc('Employee Checkin', checkin_exists[0]['name'])
        checkin.log_type = data.log_type
        checkin.save(ignore_permissions=True)
    else:
        # create the checkin
        checkin = frappe.new_doc('Employee Checkin')
        checkin.employee = data.employee
        checkin.time = entry_time.strftime('%Y-%m-%d %H:%M')+':00'
        checkin.log_type = data.log_type
        checkin.manual_override = data.manual_override
        checkin.device_id = data.device_id
        checkin.insert(ignore_permissions=True)
 
    frappe.flags.web_form_doc = checkin

    update_workday_from_checkin(checkin, None)

    # check to see if it's a manual override
    if data.manual_override:
        # grab the log type of the latest checkin, sorted by time
        latest_checkin_name, latest_checkin_log_type = frappe.get_value('Employee Checkin', {
            'employee': data.employee,
            'time': ['>=', frappe.utils.get_first_day_of_week(frappe.utils.today())]
        }, ['name', 'log_type'], order_by='time desc')

        # if the latest checkin is the same as the current checkin, then break
        if latest_checkin_name != checkin.name and latest_checkin_log_type == checkin.log_type:
            # if it is then set the log type to the opposite of the current checkin
            latest_checkin = frappe.get_doc('Employee Checkin', latest_checkin_name)
            latest_checkin.log_type = "IN" if checkin.log_type == "OUT" else "OUT"
            latest_checkin.save(ignore_permissions=True, ignore_version=True)

    return


@frappe.whitelist(allow_guest=True)
def update_workday_from_checkin(checkin, method=None):
    # if the checkin was just updated from a workday then don't do anything
    # get the date from the checkin
    checkin_time = checkin.time
    # check to see if checkin_time is a datetime object
    if not isinstance(checkin_time, datetime.datetime):
        # if it's not then convert it to a datetime object
        checkin_time = datetime.datetime.strptime(checkin_time, '%Y-%m-%d %H:%M:%S')
    # if a workday is linked to the checkin then use it
    if checkin.workday:
        workday = checkin.workday
    else:
        # get a workday for the same day as the checkin
        workday = frappe.get_all('Workday',
                                    filters={
                                        'employee': checkin.employee,
                                        'date': checkin_time.date()
                                    },
                                    fields=['name', 'total_hours'],
                                    order_by='date asc',
                                    group_by='employee',
                                    as_list=True
                                    )
        if workday: workday = workday[0][0]
        else: workday = None

    if workday:
        # get the workday
        workday = frappe.get_doc('Workday', workday)
        # if the workday was modified in the last minute then don't do anything
        if (datetime.datetime.now() - workday.modified).seconds < 60:
            return
    else:
        # if the workday does not exist then create it
        workday = frappe.new_doc('Workday')
        workday.employee = checkin.employee
        workday.date = checkin_time.date()
        workday.day_of_week = calendar.day_name[checkin_time.weekday()]

    # get all checkins for the employee and date
    check_ins = frappe.get_all('Employee Checkin',
                               filters={
                                   'employee': workday.employee,
                                   'time': ['between', [workday.date, workday.date]],
                                   'log_type': 'IN'
                               },
                               fields=['time'],
                               order_by='time asc'
                               )

    # get all checkins for the employee and date
    check_outs = frappe.get_all('Employee Checkin',
                                filters={
                                    'employee': workday.employee,
                                    'time': ['between', [workday.date, workday.date]],
                                    'log_type': 'OUT'
                                },
                                fields=['time'],
                                order_by='time asc'
                                )

    # clear any existing values from the workday check_in_ and check_out_ fields
    for i in range(1, 13):
        workday.set('check_in_' + str(i), None)
        workday.set('check_in' + str(i) + '_dt', None)
        workday.set('check_out_' + str(i), None)
        workday.set('check_out_dt' + str(i) + '_dt', None)

    # assign the checkins and checkouts to the correct in and out fields (AM/PM format)
    for i in range(len(check_ins)):
        workday.set(f"check_in_{i+1}",
                    check_ins[i]["time"].strftime('%-I:%M %p'))
        workday.set(f"check_in_{i+1}_dt",
                    check_ins[i]["time"])
    for i in range(len(check_outs)):
        workday.set(f"check_out_{i+1}",
                    check_outs[i]["time"].strftime('%-I:%M %p'))
        workday.set(f"check_out_{i+1}_dt",
                    check_outs[i]["time"])

    # save the workday
    workday.save(ignore_permissions=True, ignore_version=True)
    frappe.db.commit()

    return checkin


@frappe.whitelist(allow_guest=True)
def workday_update_total_hours(workday, method=None):
    # set invalid values for the time fields
    invalid_values = ['00:00', 'undefined', None]
    # calculate the total hours worked
    total_hours = 0
    for i in range(1, 13):
        check_in = workday.get(f"check_in_{i}")
        check_out = workday.get(f"check_out_{i}")
        # clear invalid values
        if check_in in invalid_values or check_out in invalid_values:
            if check_in in invalid_values:
                workday.set(f"check_in_{i}", None)
            if check_out in invalid_values:
                workday.set(f"check_out_{i}", None)
            break
        if check_in and check_out:
            # convert check_in and check_out to datetime.timedelta objects
            check_in_dt = datetime.datetime.strptime(str(workday.date) + ' ' + str(check_in), '%Y-%m-%d %I:%M %p')
            check_out_dt = datetime.datetime.strptime(str(workday.date) + ' ' + str(check_out), '%Y-%m-%d %I:%M %p')
            # set the corresponding datetime fields
            workday.set(f"check_in_{i}_dt", check_in_dt)
            workday.set(f"check_out_{i}_dt", check_out_dt)
            check_hours = (check_out_dt - check_in_dt).total_seconds() / 3600
            # if check_hours is negative then swap the check_in and check_out
            if check_hours < 0:
                workday.set(f"check_in_{i}", check_out)
                workday.set(f"check_in_{i}_dt", check_out_dt)
                workday.set(f"check_out_{i}", check_in)
                workday.set(f"check_out_{i}_dt", check_in_dt)
                check_hours = abs(check_hours)
            total_hours += check_hours

    # set the total hours worked
    workday.total_hours = total_hours

    return workday

@frappe.whitelist(allow_guest=True)
def update_checkins_from_workday(workday, method=None):
    # update employee checkins using the workday check_in and check_out fields
    employee = workday.employee
    date = workday.date

    # get all checkins for the employee and date
    check_ins = frappe.get_all('Employee Checkin',
                               filters={
                                   'employee': employee,
                                   'time': ['between', [date, date]],
                                   'log_type': 'IN'
                               },
                               fields=['name', 'time'],
                               order_by='time asc'
                               )

    # get all checkins for the employee and date
    check_outs = frappe.get_all('Employee Checkin',
                                filters={
                                    'employee': employee,
                                    'time': ['between', [date, date]],
                                    'log_type': 'OUT'
                                },
                                fields=['name', 'time'],
                                order_by='time asc'
                                )

    # cycle through the checkins and checkouts, updating the Employee Checkin docs
    for i in range(1, 13):
        check_in = workday.get(f"check_in_{i}_dt")
        check_out = workday.get(f"check_out_{i}_dt")
        if check_in and check_out:
            if len(check_ins) > i-2:
                if not len(check_ins) > i-1: break
                # update the checkin
                checkin = frappe.get_doc(
                    "Employee Checkin", check_ins[i-1]["name"])
                checkin.workday = workday.name
                # check to see if the checkin needs to be updated by comparing the times
                if checkin.time != check_in:
                    if checkin.workday_override == 0:
                        checkin.workday_override = 1
                        checkin.overridden_time = checkin.time
                    checkin.time = check_in
                    checkin.save(ignore_permissions=True, ignore_version=True)
                    frappe.db.commit()
            else:
                # create a new checkin
                checkin = frappe.new_doc('Employee Checkin')
                checkin.employee = employee
                checkin.time = check_in
                checkin.log_type = 'IN'
                checkin.device_id = 'Workday Management'
                checkin.workday = workday.name
                checkin.save(ignore_permissions=True, ignore_version=True)
            # check if the checkout exists
            if len(check_outs) > i-2:
                if not len(check_outs) > i-1: break
                # update the checkout
                checkout = frappe.get_doc(
                    "Employee Checkin", check_outs[i-1]["name"])
                checkout.workday = workday.name
                if checkout.time != check_out:
                    if checkout.workday_override == 0:
                        checkout.workday_override = 1
                        checkout.overridden_time = checkout.time
                    checkout.time = check_out
                    checkout.save(ignore_permissions=True, ignore_version=True)
                    frappe.db.commit()
            else:
                # create a new checkout
                checkout = frappe.new_doc('Employee Checkin')
                checkout.employee = employee
                checkout.time = check_out
                checkout.log_type = 'OUT'
                checkout.device_id = 'Workday Management'
                checkout.workday = workday.name
                checkout.save(ignore_permissions=True, ignore_version=True)
        else:
            # if the checkin or checkout is blank, delete the checkin and checkout
            if len(check_ins) > i-1 and check_in == None:
                checkin = frappe.get_doc(
                    "Employee Checkin", check_ins[i-1]["name"])
                checkin.delete(ignore_permissions=True)
                frappe.db.commit()
            if len(check_outs) > i-1 and check_out == None:
                checkout = frappe.get_doc(
                    "Employee Checkin", check_outs[i-1]["name"])
                checkout.delete(ignore_permissions=True)
                frappe.db.commit()
    return
