import jwt
import datetime
import time

import frappe
from frappe.rate_limiter import rate_limit
from frappe.utils.data import now_datetime, format_datetime

# import secret key from site_config.json
SECRET_KEY = frappe.get_site_config().get("encryption_key")


@frappe.whitelist()
@rate_limit(limit=1, seconds=1)
def authenticate_employee(rfid):
    # Validate the RFID against the database
    employee = frappe.get_value(
        "Employee", {"attendance_device_id": rfid}, "name")
    employee_name = frappe.get_value(
        "Employee", {"attendance_device_id": rfid}, "employee_name")

    if not employee:
        return {"status": "error", "message": _("Invalid RFID")}

    # If valid, generate a JWT
    expires = (datetime.datetime.now() + datetime.timedelta(minutes=30)).timestamp()
    token = jwt.encode(
        payload={"employee_id": employee, "exp": expires},
        key=SECRET_KEY,
        algorithm='HS256')

    return {
        "status": "success",
        "employee_name": employee_name,
        "token": token}


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=1, seconds=1)
def get_work_orders(token):
    try:
        employee_id = extract_employee_from_token(token)
    except frappe.AuthenticationError:
        return {"status": "error", "message": _("Invalid token")}
    except Exception as e:
        return {"status": "error", "message": _("Unknown error")}
    
    # Get the employee's work orders
    # work order status can be Submitted, Not Started, or In Process
    work_orders = frappe.get_list("Work Order",
                                  filters={"status": [
                                      "in", ["Submitted", "Not Started", "In Process"]]},
                                  fields=["name", "production_item", "status"])
    return {"status": "success", "work_orders": work_orders}


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=10, seconds=1)
def get_job_cards(token, work_order):
    try:
        employee_id = extract_employee_from_token(token)
    except frappe.AuthenticationError:
        return {"status": "error", "message": _("Invalid token")}
    except Exception as e:
        return {"status": "error", "message": _("Unknown error")}
    
    # Get the employee's job cards
    job_cards = frappe.get_list("Job Card",
                                  filters={"work_order": work_order},
                                  fields=["name", "operation", "status"])
    return {"status": "success", "job_cards": job_cards}


def extract_employee_from_token(token):
    try:
        # Decode the JWT using the same secret key
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        employee_id = payload.get("employee_id")

        if not employee_id:
            raise jwt.InvalidTokenError

        return employee_id

    except jwt.ExpiredSignatureError:
        # The token has expired
        frappe.throw(_("Token has expired. Please re-authenticate."),
                     exc=frappe.AuthenticationError)

    except jwt.InvalidTokenError:
        # The token is invalid for some other reason
        frappe.throw(_("Invalid token. Please re-authenticate."),
                     exc=frappe.AuthenticationError)
