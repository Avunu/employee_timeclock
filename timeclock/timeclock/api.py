import json
import frappe
import time
import datetime
import calendar
import re
import math


# set invalid values for the time fields
invalid_values = ['', 0, '00:00', 'undefined', None, 'None', 'null', 'NULL']
# get a collection of check_ins and check_outs
check_range = range(1, 13)

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
        next_log_type = 'IN'
    else:
        # if the last log type is in then the next log type is out
        if response[-1]['log_type'] == 'IN':
            next_log_type = 'OUT'
        else:
            next_log_type = 'IN'

    # Return 'IN' or 'OUT' based on last checkin or out
    return next_log_type

# frappe.set_value(doctype, name, fieldname, value)

@frappe.whitelist(allow_guest=True)
def submit_checkin(web_form, data):
    '''Save the web form'''
    data = frappe._dict(json.loads(data))
    entry_time = datetime.datetime.strptime(data.time, '%Y-%m-%d %H:%M:%S')
    checkin_time = entry_time.strftime('%Y-%m-%d %H:%M')+':00'
    checkin_exists = []
    # make sure that checkin doesn't exist with the same time
    checkin_exists = frappe.get_all('Employee Checkin',
                                    filters={
                                        'employee': data.employee,
                                        'time': entry_time.strftime('%Y-%m-%d %H:%M')+':00'
                                    },
                                    fields=['name'],
                                    order_by='time desc',
                                    )
    if checkin_exists:
        checkin = frappe.get_doc('Employee Checkin', checkin_exists[0]['name'])
        # update the checkin
        checkin.time = checkin_time
        checkin.save(ignore_permissions=True)
        frappe.db.commit()
    else:
        # create the checkin
        checkin = frappe.new_doc('Employee Checkin')
        checkin.employee = data.employee
        checkin.time = checkin_time
        checkin.log_type = data.log_type
        checkin.manual_override = data.manual_override
        checkin.device_id = data.device_id
        checkin.insert(ignore_permissions=True)
        # update the workday
        update_workday_from_checkin(checkin)

    return checkin.log_type

def enqueue_update_workday_from_checkin(checkin, method=None):
    frappe.enqueue('timeclock.timeclock.api.update_workday_from_checkin', queue='short', is_async=True, checkin=checkin)
    return

@frappe.whitelist(allow_guest=True)
def update_workday_from_checkin(checkin, method=None):
    # if the workday was modified in the last minute, then break
    workday_modified = checkin.workday_modified or None
    if workday_modified:
        if not isinstance(workday_modified, datetime.datetime):
            workday_modified = datetime.datetime.strptime(
                workday_modified.split('.')[0], '%Y-%m-%d %H:%M:%S')
        if (frappe.utils.now_datetime() - workday_modified).seconds < 60:
            return checkin
    # get the date from the checkin
    checkin_time = checkin.time
    # check to see if checkin_time is a datetime object
    if not isinstance(checkin_time, datetime.datetime):
        # if it's not then convert it to a datetime object
        checkin_time = datetime.datetime.strptime(
            checkin_time, '%Y-%m-%d %H:%M:%S')
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
                                 fields=['name'],
                                 order_by='date asc',
                                 as_list=True
                                 )
        if workday:
            workday = workday[0][0]
        else:
            workday = None

    if workday:
        # get the workday
        workday = frappe.get_doc('Workday', workday)
        # if the workday was modified in the last minute then don't do anything
        if workday.last_modified:
            if (frappe.utils.now_datetime() - workday.last_modified).seconds < 60:
                return checkin
    else:
        # if the workday does not exist then create it
        workday = frappe.new_doc('Workday')
        workday.employee = checkin.employee
        
        # get employee name from employee
        employee_name = frappe.get_value(
            'Employee', checkin.employee, 'employee_name')
        workday.employee_name = employee_name
        workday.date = checkin_time.date()
        workday.day_of_week = calendar.day_name[checkin_time.weekday()]
        workday.last_modified = frappe.utils.now()
        workday.db_insert(ignore_if_duplicate=True)

    # debug
    # frappe.msgprint('checkin_time: '+str(checkin_time))
    # frappe.msgprint('workday: '+str(workday.name))

    checkin_times = frappe.get_all('Employee Checkin',
                                  filters={
                                      'employee': workday.employee,
                                      'time': ['between', [workday.date, workday.date]],
                                  },
                                  fields=['time'],
                                  order_by='time asc',
                                  pluck='time'
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
    # checkin.workday_modified = frappe.utils.now_datetime()
    # checkin.save(ignore_permissions=True)
    frappe.db.set_value('Employee Checkin', checkin.name,
                        'workday', workday.name)
    # workday.save(ignore_permissions=True)
    frappe.db.commit()

    return checkin

def build_workday(checkin_times, workday):
    # sort the check_times
    checkin_times.sort()
    # set the form fields based on the check_times
    for i in range(len(checkin_times)):
        if i % 2 == 0:
            workday.set('check_in_' + str(int(i/2)+1), checkin_times[i].strftime('%-I:%M %p'))
            workday.set('check_in_' + str(int(i/2)+1) + '_dt', checkin_times[i])
        else:
            workday.set('check_out_' + str(int(i/2)+1), checkin_times[i].strftime('%-I:%M %p'))
            workday.set('check_out_' + str(int(i/2)+1) + '_dt', checkin_times[i])
    # clear any remaining check_ins and check_outs
    checkin_times_len = len(checkin_times)
    for i in range(len(checkin_times), 24):
        if i % 2 == 0:
            # # debug
            # frappe.msgprint(f'clearing check_in_{int(i/2)+1}')
            workday.set('check_in_' + str(int(i/2)+1), None)
            workday.set('check_in_' + str(int(i/2)+1) + '_dt', None)
        else:
            # # debug
            # frappe.msgprint(f'clearing check_out_{int(i/2)+1}')
            workday.set('check_out_' + str(int(i/2)+1), None)
            workday.set('check_out_' + str(int(i/2)+1) + '_dt', None)

    # calculate the total hours worked
    total_hours = 0
    for i in check_range:
        check_in = workday.get(f'check_in_{i}_dt')
        check_out = workday.get(f'check_out_{i}_dt')
        # if both check_in and check_out are datetime objects, then calculate the hours
        if isinstance(check_in, datetime.datetime) and isinstance(check_out, datetime.datetime):
            check_hours = (check_out - check_in).total_seconds() / 3600
            total_hours += check_hours

    # set the total hours worked
    workday.total_hours = total_hours
    
    return workday

def clear_workday_punch_on_checkin_trash(checkin, method=None):
    # check to see if a workday is linked to the checkin
    if checkin.workday:
        # get workday based on checkin.
        workday = frappe.get_doc('Workday', checkin.workday)
        # if the workday was modified in the last minute then don't do anything
        if workday.last_modified:
            if (frappe.utils.now_datetime() - workday.last_modified).seconds < 60:
                return
        # find the workday checking field that matches the checkin time
        for i in check_range:
            if workday.get('check_in_' + str(i) + '_dt') == checkin.time:
                frappe.db.set_value('Workday', workday.name,
                                    'check_in_' + str(i), None)
                frappe.db.set_value('Workday', workday.name,
                                    'check_in_' + str(i) + '_dt', None)
            if workday.get('check_out_' + str(i) + '_dt') == checkin.time:
                frappe.db.set_value('Workday', workday.name,
                                    'check_out_' + str(i), None)
                frappe.db.set_value('Workday', workday.name,
                                    'check_out_' + str(i) + '_dt', None)

        # reload the workday from the database
        workday.reload()
        # recalculate the total hours
        workday = workday_update_total_hours(workday)
        # commit the changes
        frappe.db.set_value('Workday', workday.name,
                            'total_hours', workday.total_hours)
        # commit the changes
        workday.db_update()
        frappe.db.commit()

    return

@frappe.whitelist(allow_guest=True)
def workday_update_total_hours(workday, method=None):
    workday.last_modified = frappe.utils.now()
    date = workday.date
    if isinstance(date, datetime.datetime):
        date = date.strftime('%Y-%m-%d')
    check_ins = [workday.get('check_in_' + str(i)) for i in check_range]
    check_outs = [workday.get('check_out_' + str(i)) for i in check_range]
    # test each check_in and check_out to see if it is a valid time string in the format '%I:%M %p'
    regex = re.compile(r'^\d{1,2}:\d{2} (AM|PM|am|pm)$')
    check_ins = [x for x in check_ins if x and regex.match(x)]
    check_outs = [x for x in check_outs if x and regex.match(x)]
    # combine the check_ins and check_outs into a single list
    check_times = []
    # debug - print the variable type of check_ins and check_outs
    # frappe.msgprint(f'check_ins: {type(check_ins)}')
    # frappe.msgprint(f'check_outs: {type(check_outs)}')
    # frappe.msgprint(f'date: {type(date)}')
    for i in range(len(check_ins)):
        # if the check_in starts with '0:' then replace it with '12:'
        if check_ins[i].startswith('0:'):
            check_ins[i] = '12:' + check_ins[i][2:]
        check_times.append(datetime.datetime.strptime(str(date) + ' ' + str(check_ins[i]), '%Y-%m-%d %I:%M %p'))
    for i in range(len(check_outs)):
        # if the check_out starts with '0:' then replace it with '12:'
        if check_outs[i].startswith('0:'):
            check_outs[i] = '12:' + check_outs[i][2:]
        check_times.append(datetime.datetime.strptime(str(date) + ' ' + str(check_outs[i]), '%Y-%m-%d %I:%M %p'))
    
    workday = build_workday(check_times, workday)

    return workday


@frappe.whitelist(allow_guest=True)
def update_checkins_from_workday(workday, method=None):
    # update employee checkins using the workday check_in and check_out fields
    employee = workday.employee
    date = workday.date

    # cycle through the workday check in/out times, updating the Employee Checkin docs
    for log_type in ['in', 'out']:
        # get all checkins for the employee and date
        existing_checkins = frappe.get_all('Employee Checkin',
                                           filters={
                                               'employee': employee,
                                               'time': ['between', [date, date]],
                                               'log_type': log_type.upper()
                                           },
                                           fields=['name', 'time'],
                                           order_by='time asc'
                                           )
        for i in check_range:
            check_in_out_time = workday.get(f'check_{log_type}_{i}_dt')
            if check_in_out_time:
                if len(existing_checkins) >= i:
                    # update the checkin
                    checkin = frappe.get_doc(
                        'Employee Checkin', existing_checkins[i-1]['name'])
                    checkin.workday = workday.name
                    # check to see if the checkin needs to be updated by comparing the times
                    if checkin.time != check_in_out_time:
                        if checkin.workday_override == 0:
                            checkin.workday_override = 1
                            checkin.overridden_time = checkin.time
                        checkin.time = check_in_out_time
                        checkin.workday_modified = frappe.utils.now()
                        checkin.db_update()
                        frappe.db.commit()
                else:
                    # create a new checkin
                    checkin = frappe.new_doc('Employee Checkin')
                    checkin.employee = employee
                    checkin.time = check_in_out_time
                    checkin.log_type = log_type.upper()
                    checkin.device_id = 'Workday Management'
                    checkin.workday = workday.name
                    checkin.workday_modified = frappe.utils.now()
                    checkin.db_insert(ignore_if_duplicate=True)
            else:
                # if the check in time is blank delete the corresponding check in
                if len(existing_checkins) >= i and check_in_out_time == None:
                    checkin = frappe.get_doc(
                        'Employee Checkin', existing_checkins[i-1]['name'])
                    checkin.delete(ignore_permissions=True)
                    frappe.db.commit()
    return