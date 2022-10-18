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
    checkin_exists = []
    # check to see if it's a manual override
    if data.manual_override:
        # grab the log type of the latest checkin, sorted by time
        latest_checkin_name, latest_checkin_log_type = frappe.get_value('Employee Checkin', {
            'employee': data.employee,
            'time': ['>=', frappe.utils.get_first_day_of_week(frappe.utils.today())]
        }, ['name', 'log_type'], order_by='time desc')

        # if the latest checkin is the same as the current checkin, then break
        if latest_checkin_name != data.name and latest_checkin_log_type == data.log_type:
            # if it is then set the log type to the opposite of the current checkin
            latest_checkin = frappe.get_doc(
                'Employee Checkin', latest_checkin_name)
            latest_checkin.log_type = 'OUT' if data.log_type == 'IN' else 'IN'
            latest_checkin.save(ignore_permissions=True, ignore_version=True)
            frappe.db.commit()
    else:
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
        # get the previous checkin as well, for the same employee and the same day
        previous_checkin = frappe.get_all('Employee Checkin',
                                          filters={
                                              'employee': data.employee,
                                              'time': ['>', entry_time.strftime('%Y-%m-%d')+' 00:00:00'],
                                              'time': ['<', (entry_time - datetime.timedelta(minutes=1)).strftime('%Y-%m-%d %H:%M')+':00']
                                          },
                                          fields=['name', 'time'],
                                          order_by='time desc',
                                          limit=1
                                          )
        # if there is a previous checkin, then the previous checkin is the checkin that is being edited
        if previous_checkin:
            previous_checkin = frappe.get_doc(
                'Employee Checkin', previous_checkin[0]['name'])
            # if the previous checkin is an IN, then the checkin being edited is an OUT
            if previous_checkin.log_type == 'IN':
                checkin.log_type = 'OUT'
            # if the previous checkin is an OUT, then the checkin being edited is an IN
            else:
                checkin.log_type = 'IN'
        # if there is no previous checkin, then the checkin being edited is an IN
        else:
            checkin.log_type = 'IN'
        # update the checkin
        checkin.time = entry_time.strftime('%Y-%m-%d %H:%M')+':00'
        checkin.save(ignore_permissions=True)
        frappe.db.commit()
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

    return


@frappe.whitelist(allow_guest=True)
def update_workday_from_checkin(checkin, method=None):
    # if the workday was modified in the last minute, then break
    workday_modified = checkin.workday_modified
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
        workday.db_insert()

    for log_type in ['in', 'out']:
        # get all checkins for the employee and date
        checkins = frappe.get_all('Employee Checkin',
                                  filters={
                                      'employee': workday.employee,
                                      'time': ['between', [workday.date, workday.date]],
                                      'log_type': log_type.upper()
                                  },
                                  fields=['time'],
                                  order_by='time asc'
                                  )

        # clear any existing values from the workday check_in_ and check_out_ fields
        for i in range(1, 13):
            frappe.db.set_value('Workday', workday.name,
                                f'check_{log_type}_{i}', None)
            frappe.db.set_value('Workday', workday.name,
                                f'check_{log_type}_{i}_dt', None)

        # assign the checkins to the correct in and out fields (AM/PM format)
        for i in range(len(checkins)):
            frappe.db.set_value('Workday', workday.name, f'check_{log_type}_{i+1}',
                                checkins[i]['time'].strftime('%-I:%M %p'))
            frappe.db.set_value('Workday', workday.name, f'check_{log_type}_{i+1}_dt',
                                checkins[i]['time'])

        # connect the workday to the checkin
        frappe.db.set_value('Employee Checkin', checkin.name,
                            'workday', workday.name)
        frappe.db.commit()

        # reload the workday from the database.
        workday.reload()
        # recalculate the total hours
        workday_update_total_hours(workday, commit=True)

    return checkin


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
        for i in range(1, 13):
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
        workday_update_total_hours(workday, commit=True)

    return


@frappe.whitelist(allow_guest=True)
def workday_update_total_hours(workday, commit=False):
    workday.last_modified = frappe.utils.now()
    # set invalid values for the time fields
    invalid_values = ['', '00:00', 'undefined', None]
    # calculate the total hours worked
    total_hours = 0
    for i in range(1, 13):
        check_in = workday.get(f'check_in_{i}')
        check_out = workday.get(f'check_out_{i}')
        # clear invalid values
        if check_in in invalid_values:
            check_in = None
            workday.set(f'check_in_{i}', None)
            workday.set(f'check_in_{i}_dt', None)
        if check_out in invalid_values:
            check_out = None
            workday.set(f'check_out_{i}', None)
            workday.set(f'check_out_{i}_dt', None)
        if check_in:
            check_in_dt = datetime.datetime.strptime(
                str(workday.date) + ' ' + str(check_in), '%Y-%m-%d %I:%M %p')
            workday.set(f'check_in_{i}_dt', check_in_dt)
        if check_out:
            check_out_dt = datetime.datetime.strptime(
                str(workday.date) + ' ' + str(check_out), '%Y-%m-%d %I:%M %p')
            workday.set(f'check_out_{i}_dt', check_out_dt)
        if check_in and check_out:
            check_hours = (check_out_dt - check_in_dt).total_seconds() / 3600
            # if check_hours is negative then swap the check_in and check_out
            if check_hours < 0:
                workday.set(f'check_in_{i}', check_out)
                workday.set(f'check_in_{i}_dt', check_out_dt)
                workday.set(f'check_out_{i}', check_in)
                workday.set(f'check_out_{i}_dt', check_in_dt)
                check_hours = abs(check_hours)
            total_hours += check_hours

    # set the total hours worked
    workday.total_hours = total_hours

    # commit the changes
    if commit:
        # commit the changes
        frappe.db.set_value('Workday', workday.name,
                            'total_hours', workday.total_hours)
        # commit the changes
        workday.db_update()
        frappe.db.commit()

    # log an error to make sure the workday is being updated
    frappe.log_error(f'Workday {workday.name} updated with {total_hours} hours',
                     'Workday Update')

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
        for i in range(1, 13):
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
                    checkin.db_insert()
            else:
                # if the check in is blank delete the check in
                if len(existing_checkins) >= i and check_in_out_time == None:
                    checkin = frappe.get_doc(
                        'Employee Checkin', existing_checkins[i-1]['name'])
                    checkin.delete(ignore_permissions=True)
                    frappe.db.commit()
    return
