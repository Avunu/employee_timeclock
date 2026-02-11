import calendar
import datetime
import json
import time

import frappe


@frappe.whitelist(allow_guest=True)
def get_weekly_hours(employee):

    employee_doc = frappe.get_doc("Employee", employee)
    employee_name = employee_doc.get_title()

    response = frappe.get_all(
        "Employee Checkin",
        filters={
            "employee": employee,
            "time": [">", frappe.utils.get_first_day_of_week(frappe.utils.today())],
        },
        order_by="time asc",
        fields=["time", "log_type"],
    )

    # Create lists for employees checkins and checkouts to be split into
    ints = []
    outts = []

    for i in response:
        if i["log_type"] == "IN":
            ints.append(i["time"])
        else:
            outts.append(i["time"])

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

    # Get the checkins and checkouts of the employee for the current day
    response = frappe.get_all(
        "Employee Checkin",
        filters={"employee": employee, "time": [">", frappe.utils.today()]},
        order_by="time asc",
        fields=["time", "log_type"],
    )

    # if response is empty then the employee has not checked in yet
    if response == []:
        next_log_type = "IN"
    else:
        # if the last log type is in then the next log type is out
        if response[-1]["log_type"] == "IN":
            next_log_type = "OUT"
        else:
            next_log_type = "IN"

    # Return "IN" or "OUT" based on last checkin or out
    return next_log_type


@frappe.whitelist(allow_guest=True)
def update_workday_from_checkin(doc, method=None):
    # if the checkin was just updated (from the workday form) then don't do anything
    # this is to prevent an infinite loop
    # get the time of the last update
    if doc.time_of_override == datetime.datetime.now().strftime("%Y-%m-%d %H:%M") or doc.workday_override:
        return
    # get the employee, date, and time from from Employee Checkin doc
    employee = doc.employee
    # convert the time to a datetime object
    checkin_dt = datetime.datetime.strptime(str(doc.time), "%Y-%m-%d %H:%M:%S")
    # get the date from time
    date = checkin_dt.date()
    time = checkin_dt.time()

    # check to see if an existing workday exists for the employee and date
    existing_workday = frappe.get_all("Workday", filters={"employee": employee, "date": date})

    # if the workday exists, update it
    if existing_workday:
        # get the workday name, load it as a object
        workday_name = existing_workday[0]["name"]
        workday = frappe.get_doc("Workday", workday_name)

    # if the workday does not exist, create it
    else:
        # create a new workday
        workday = frappe.new_doc("Workday")
        workday.employee = employee
        workday.date = date
        workday.day_of_week = checkin_dt.strftime("%A")

    # get all checkins for the employee and date
    check_ins = frappe.get_all(
        "Employee Checkin",
        filters={"employee": employee, "time": ["between", [date, date]], "log_type": "IN"},
        fields=["time"],
        order_by="time asc",
    )

    # get all checkins for the employee and date
    check_outs = frappe.get_all(
        "Employee Checkin",
        filters={"employee": employee, "time": ["between", [date, date]], "log_type": "OUT"},
        fields=["time"],
        order_by="time asc",
    )

    # assign the checkins and checkouts to the correct in and out fields (AM/PM format)
    for i in range(len(check_ins)):
        workday.set(f"check_in_{i + 1}", check_ins[i]["time"].strftime("%-I:%M %p"))
    for i in range(len(check_outs)):
        workday.set(f"check_out_{i + 1}", check_outs[i]["time"].strftime("%-I:%M %p"))

    # save the workday, without triggering hooks
    workday.save(ignore_permissions=True)
    frappe.db.commit()

    return


# frappe.set_value(doctype, name, fieldname, value)


@frappe.whitelist(allow_guest=True)
def accept(web_form, data):
    """Save the web form"""
    data = frappe._dict(json.loads(data))
    web_form = frappe.get_doc("Web Form", web_form)

    frappe.flags.in_web_form = True
    meta = frappe.get_meta("Employee Checkin")

    checkin = frappe.new_doc("Employee Checkin")

    # set values
    for field in web_form.web_form_fields:
        fieldname = field.fieldname
        df = meta.get_field(fieldname)
        value = data.get(fieldname, None)
        checkin.set(fieldname, value)

    if checkin.name:
        checkin.save(ignore_permissions=True)
    else:
        checkin.insert(ignore_permissions=True, ignore_mandatory=True)

    frappe.flags.web_form_doc = checkin

    # check to see if it's a manual override
    if data.manual_override:
        # grab the log type of the latest checkin, sorted by time
        latest_checkin_name, latest_checkin_log_type = frappe.get_value(
            "Employee Checkin",
            {
                "employee": data.employee,
                "time": [">", frappe.utils.get_first_day_of_week(frappe.utils.today())],
            },
            ["name", "log_type"],
            order_by="time desc",
        )

        # make sure the latest checkin is the opposite of the current checkin
        if latest_checkin_log_type == checkin.log_type:
            # if it is then set the log type to the opposite of the current checkin
            latest_checkin = frappe.get_doc("Employee Checkin", latest_checkin_name)
            latest_checkin.log_type = "IN" if checkin.log_type == "OUT" else "OUT"
            latest_checkin.save(ignore_permissions=True)

    update_workday_from_checkin(checkin, None)

    return


@frappe.whitelist(allow_guest=True)
def workday_update_total_hours(doc, method=None):
    # set invalid values for the time fields
    invalid_values = ["00:00", "undefined", None]
    # calculate the total hours worked
    total_hours = 0
    for i in range(1, 13):
        check_in = doc.get(f"check_in_{i}")
        check_out = doc.get(f"check_out_{i}")
        # clear invalid values
        if check_in in invalid_values or check_out in invalid_values:
            if check_in in invalid_values:
                doc.set(f"check_in_{i}", None)
            if check_out in invalid_values:
                doc.set(f"check_out_{i}", None)
            break
        if check_in and check_out:
            # convert check_in and check_out to datetime.timedelta objects
            check_in_dt = datetime.datetime.strptime(str(check_in), "%I:%M %p")
            check_out_dt = datetime.datetime.strptime(str(check_out), "%I:%M %p")
            total_hours += (check_out_dt - check_in_dt).total_seconds() / 3600

    # if the total hours is negative, swap the checkins and checkouts
    if total_hours < 0:
        for i in range(1, 13):
            check_in = doc.get(f"check_in_{i}")
            check_out = doc.get(f"check_out_{i}")
            if check_in and check_out:
                if check_in in invalid_values or check_out in invalid_values:
                    break
                doc.set(f"check_in_{i}", check_out)
                doc.set(f"check_out_{i}", check_in)

        # recalculate the total hours
        total_hours = 0
        for i in range(1, 13):
            check_in = doc.get(f"check_in_{i}")
            check_out = doc.get(f"check_out_{i}")
            if check_in and check_out:
                if check_in in invalid_values or check_out in invalid_values:
                    break
                # convert check_in and check_out to datetime.timedelta objects
                check_in_dt = datetime.datetime.strptime(str(check_in), "%I:%M %p")
                check_out_dt = datetime.datetime.strptime(str(check_out), "%I:%M %p")
                total_hours += (check_out_dt - check_in_dt).total_seconds() / 3600

    # set the total hours worked
    doc.total_hours = total_hours

    return doc


# update employee checkins using the workday check_in and check_out fields


@frappe.whitelist(allow_guest=True)
def update_checkins_from_workday(workday, method=None):
    # get the employee, date, and time from from Employee Checkin doc
    employee = workday.employee
    date = workday.date

    # get all checkins for the employee and date
    check_ins = frappe.get_all(
        "Employee Checkin",
        filters={"employee": employee, "time": ["between", [date, date]], "log_type": "IN"},
        fields=["name", "time"],
        order_by="time asc",
    )

    # get all checkins for the employee and date
    check_outs = frappe.get_all(
        "Employee Checkin",
        filters={"employee": employee, "time": ["between", [date, date]], "log_type": "OUT"},
        fields=["name", "time"],
        order_by="time asc",
    )

    # cycle through the checkins and checkouts, updating the Employee Checkin docs
    for i in range(1, 13):
        check_in = workday.get(f"check_in_{i}")
        check_out = workday.get(f"check_out_{i}")
        if check_in and check_out:
            # convert check_in and check_out to datetime objects
            check_in_dt = datetime.datetime.strptime(str(date) + " " + str(check_in), "%Y-%m-%d %I:%M %p")
            check_out_dt = datetime.datetime.strptime(str(date) + " " + str(check_out), "%Y-%m-%d %I:%M %p")
            # check if the checkin exists
            if len(check_ins) > i - 1:
                # update the checkin
                checkin = frappe.get_doc("Employee Checkin", check_ins[i - 1]["name"])
                if checkin.time != check_in_dt:
                    if checkin.workday_override == 0:
                        checkin.workday_override = 1
                        checkin.overridden_time = checkin.time
                        # set the datetime of override to now
                        checkin.time_of_override = datetime.datetime.now()
                    checkin.time = check_in_dt
                    checkin.save(ignore_permissions=True)
                    frappe.db.commit()
            else:
                # create a new checkin
                checkin = frappe.new_doc("Employee Checkin")
                checkin.employee = employee
                checkin.time = check_in_dt
                checkin.log_type = "IN"
                checkin.device_id = "Workday Management"
                checkin.save(ignore_permissions=True)
                frappe.db.commit()
            # check if the checkout exists
            if len(check_outs) > i - 1:
                # update the checkout
                checkout = frappe.get_doc("Employee Checkin", check_outs[i - 1]["name"])
                if checkout.time != check_out_dt:
                    if checkout.workday_override == 0:
                        checkout.workday_override = 1
                        checkout.overridden_time = checkout.time
                        # set the datetime of override to now
                        checkout.time_of_override = datetime.datetime.now()
                    checkout.time = check_out_dt
                    checkout.save(ignore_permissions=True)
                    frappe.db.commit()
            else:
                # create a new checkout
                checkout = frappe.new_doc("Employee Checkin")
                checkout.employee = employee
                checkout.time = check_out_dt
                checkout.log_type = "OUT"
                checkout.device_id = "Workday Management"
                checkout.save(ignore_permissions=True)
                frappe.db.commit()
        else:
            # if the checkin or checkout is blank, delete the checkin and checkout
            if len(check_ins) > i - 1 and check_in == None:
                checkin = frappe.get_doc("Employee Checkin", check_ins[i - 1]["name"])
                checkin.delete(ignore_permissions=True)
                frappe.db.commit()
            if len(check_outs) > i - 1 and check_out == None:
                checkout = frappe.get_doc("Employee Checkin", check_outs[i - 1]["name"])
                checkout.delete(ignore_permissions=True)
                frappe.db.commit()
    return


# get the sum of the total_hours Workday field of an entire week
def get_total_hours(employee, date):
    # get the start and end dates of the week
    start_date = date - datetime.timedelta(days=date.weekday())
    end_date = start_date + datetime.timedelta(days=6)
    # get the total hours for the week
    total_hours = frappe.db.sql(
        """
        SELECT SUM(total_hours)
        FROM `tabWorkday`
        WHERE employee = %s
        AND date BETWEEN %s AND %s
        """,
        (employee, start_date, end_date),
    )
    frappe.get_value("Workday", {"employee": employee, "date": date}, "total_hours")
    return total_hours[0][0]
