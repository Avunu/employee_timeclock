import json

import frappe
import time
import datetime
import calendar


@frappe.whitelist(allow_guest=True)
def get_weekly_hours(employee):

    employee_doc = frappe.get_doc('Employee', employee)
    employee_name = employee_doc.get_title()

    response = frappe.db.get_all('Employee Checkin',
                                 filters={'employee': employee, 'time': [
                                     '>', frappe.utils.get_first_day_of_week(frappe.utils.today())]},
                                 order_by='time asc',
                                 fields=['time', 'log_type'],
                                 )

    # Create lists for employees checkins and checkouts to be split into
    ints = []
    outts = []

    for i in response:
        if i['log_type'] == 'IN':
            ints.append(i['time'])
        else:
            outts.append(i['time'])

    # Sort the in and out list
    sints = sorted(ints)
    soutts = sorted(outts)
    # Reverse the in list for ease in the for loop
    rsints = list(reversed(sints))

    # Create the variable to track the number of hours worked
    total_hours = 0

    # Go through the checkout list one by one if soutts isn't empty
    if soutts != []:
        for i in soutts:
            inv = None
            # Go though the checkin list until it reaches one that matches the current checkout then break
            for e in rsints:
                if e <= i:
                    inv = e
                    break

            # Add time based on the amount of time between checkin and checkout
            if inv != None:
                total_hours += (i.date().day - inv.date().day) * 24
                total_hours += i.time().hour - inv.time().hour
                total_hours += (i.time().minute - inv.time().minute) / 60

                # Remove the checkin every time to help keep the list straight
                rsints.remove(inv)
                sints.remove(inv)
            else:
                total_hours = 0
    else:
        total_hours = 0

    # Round the total hours to 2 digits
    total_hours = round(total_hours, ndigits=2)

    # wrap the employee name and total hours into an array
    employee_hours = [employee_name, total_hours]

    # Return the total hours
    return employee_hours


@frappe.whitelist(allow_guest=True)
def determine_next_log_type(employee, data):
    data = frappe._dict(json.loads(data))
    # Get the checkins and checkouts of the employee
    response = frappe.db.get_all('Employee Checkin',
                                 filters={
                                     'employee': employee
                                 },
                                 fields=['time', 'log_type'],
                                 )

    # Make the dictionary a list of times sorted from earliest to latest
    sorted_response = sorted([i["time"] for i in response])

    # Set next log type to in
    next_log_type = "IN"

    # Go through the Checkins and Checkouts
    for i in response:
        # If the time part of the response equals the last time of the sorted list (also the latest)
        if i["time"] == sorted_response[-1]:
            # Change the next log type to out if the last was in, or leave the next log type as in
            if i["log_type"] == "IN":
                next_log_type = "OUT"
            # Break once the last checkin/out was found
            break

    # Return "IN" or "OUT" based on last checkin or out
    return next_log_type


# frappe.db.set_value(doctype, name, fieldname, value)


@frappe.whitelist(allow_guest=True)
def manual_override(employee, data, logType):
    data = frappe._dict(json.loads(data))
    response = frappe.db.get_all('Employee Checkin',
                                 filters={
                                     'employee': employee
                                 },
                                 fields=['time', 'log_type', 'name'],
                                 )

    # Make the dictionary a list of times sorted from earliest to latest
    sorted_response = sorted([i["time"] for i in response])

    time = data.time
    time = datetime.datetime.strptime(time, '%Y-%m-%d %H:%M:%S')
    sorted_response.append(time)
    sorted_response = sorted(sorted_response)
    complete_sorted_response = sorted(response, key=lambda x: x['time'])
    pTimeInd = sorted_response.index(time)
    pTime = sorted_response[pTimeInd]

    next_log_type = "OUT" if logType == "IN" else "IN"

    i = pTimeInd

    llt = []

    while i < len(complete_sorted_response):
        # sorted_response[i]["log_type"] = next_log_type
        frappe.db.set_value(
            'Employee Checkin', complete_sorted_response[i]["name"], 'log_type', next_log_type)
        frappe.db.commit()
        next_log_type = "IN" if next_log_type == "OUT" else "OUT"
        llt.append(next_log_type)
        i += 1

    return [llt, sorted_response, pTime, complete_sorted_response, logType, data]


@frappe.whitelist(allow_guest=True)
def accept(web_form, data):
    """Save the web form"""
    data = frappe._dict(json.loads(data))

    files = []
    files_to_delete = []

    web_form = frappe.get_doc("Web Form", web_form)

    if data.name and not web_form.allow_edit:
        frappe.throw(_("You are not allowed to update this Web Form Document"))

    frappe.flags.in_web_form = True
    meta = frappe.get_meta(data.doctype)

    doc = frappe.new_doc(data.doctype)

    # set values
    for field in web_form.web_form_fields:
        fieldname = field.fieldname
        df = meta.get_field(fieldname)
        value = data.get(fieldname, None)
        doc.set(fieldname, value)

    if doc.name:
        if web_form.has_web_form_permission(doc.doctype, doc.name, "write"):
            doc.save(ignore_permissions=True)
        else:
            # only if permissions are present
            doc.save()

    else:
        # insert
        if web_form.login_required and frappe.session.user == "Guest":
            frappe.throw(_("You must login to submit this form"))

        ignore_mandatory = True if files else False

        doc.insert(ignore_permissions=True, ignore_mandatory=ignore_mandatory)

    frappe.flags.web_form_doc = doc

    assign_checkin_to_workday(doc, None)

    return doc


def assign_checkin_to_workday(doc, method=None):
    # get the employee, date, and time from from Employee Checkin doc
    employee = doc.employee
    # convert the time to a datetime object
    checkin_dt = datetime.datetime.strptime(str(doc.time), '%Y-%m-%d %H:%M:%S')
    # get the date from time
    date = checkin_dt.date()
    time = checkin_dt.time()

    # check to see if an existing workday exists for the employee and date
    existing_workday = frappe.db.get_all('Workday',
                                         filters={
                                             'employee': employee,
                                             'date': date
                                         }
                                         )

    # if the workday exists, update it
    if existing_workday:
        # get the workday name, load it as a object
        workday_name = existing_workday[0]["name"]
        workday = frappe.get_doc("Workday", workday_name)

    # if the workday does not exist, create it
    else:
        # create a new workday
        workday = frappe.new_doc('Workday')
        workday.employee = employee
        workday.date = date
        workday.day_of_week = checkin_dt.strftime("%A")

    # get all checkins for the employee and date
    check_ins = frappe.db.get_all('Employee Checkin',
                                  filters={
                                      'employee': employee,
                                      'time': ['between', [date, date]],
                                      'log_type': 'IN'
                                  },
                                  fields=['time'],
                                  order_by='time asc'
                                  )

    # get all checkins for the employee and date
    check_outs = frappe.db.get_all('Employee Checkin',
                                   filters={
                                       'employee': employee,
                                       'time': ['between', [date, date]],
                                       'log_type': 'OUT'
                                   },
                                   fields=['time'],
                                   order_by='time asc'
                                   )

    # # zero out the check_in_{1-6} and check_out_{1-6} fields first
    # for i in range(1, 7):
    #     workday.set('check_in_' + str(i), '00:00')
    #     workday.set('check_out_' + str(i), '00:00')

    # assign the checkins and checkouts to the correct in and out fields (AM/PM format)
    for i in range(len(check_ins)):
        workday.set(f"check_in_{i+1}", check_ins[i]["time"].strftime('%-I:%M %p'))
    for i in range(len(check_outs)):
        workday.set(f"check_out_{i+1}", check_outs[i]["time"].strftime('%-I:%M %p'))

    # save the workday
    workday.save()

    return

def workday_update_total_hours(doc, method=None):
    # calculate the total hours worked
    total_hours = 0
    for i in range(1, 7):
        check_in = doc.get(f"check_in_{i}")
        check_out = doc.get(f"check_out_{i}")
        if check_in and check_out:
            if check_in == '00:00' or check_out == '00:00': break
            if check_in == None or check_out == None: break
            # convert check_in and check_out to datetime.timedelta objects
            check_in_dt = datetime.datetime.strptime(str(check_in), '%I:%M %p')
            check_out_dt = datetime.datetime.strptime(str(check_out), '%I:%M %p')
            total_hours += (check_out_dt - check_in_dt).total_seconds() / 3600

    # set the total hours worked
    doc.total_hours = total_hours

    doc.save()

    return