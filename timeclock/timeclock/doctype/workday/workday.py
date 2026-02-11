# Copyright (c) 2022, Avunu LLC and contributors
# For license information, please see license.txt

import datetime
import json

import frappe
from frappe import publish_realtime, session
from frappe.model.document import Document
from frappe.utils import random_string


class Workday(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        check_in_10: DF.Data | None
        check_in_10_dt: DF.Datetime | None
        check_in_11: DF.Data | None
        check_in_11_dt: DF.Datetime | None
        check_in_12: DF.Data | None
        check_in_12_dt: DF.Datetime | None
        check_in_1: DF.Data | None
        check_in_1_dt: DF.Datetime | None
        check_in_2: DF.Data | None
        check_in_2_dt: DF.Datetime | None
        check_in_3: DF.Data | None
        check_in_3_dt: DF.Datetime | None
        check_in_4: DF.Data | None
        check_in_4_dt: DF.Datetime | None
        check_in_5: DF.Data | None
        check_in_5_dt: DF.Datetime | None
        check_in_6: DF.Data | None
        check_in_6_dt: DF.Datetime | None
        check_in_7: DF.Data | None
        check_in_7_dt: DF.Datetime | None
        check_in_8: DF.Data | None
        check_in_8_dt: DF.Datetime | None
        check_in_9: DF.Data | None
        check_in_9_dt: DF.Datetime | None
        check_out_10: DF.Data | None
        check_out_10_dt: DF.Datetime | None
        check_out_11: DF.Data | None
        check_out_11_dt: DF.Datetime | None
        check_out_12: DF.Data | None
        check_out_12_dt: DF.Datetime | None
        check_out_1: DF.Data | None
        check_out_1_dt: DF.Datetime | None
        check_out_2: DF.Data | None
        check_out_2_dt: DF.Datetime | None
        check_out_3: DF.Data | None
        check_out_3_dt: DF.Datetime | None
        check_out_4: DF.Data | None
        check_out_4_dt: DF.Datetime | None
        check_out_5: DF.Data | None
        check_out_5_dt: DF.Datetime | None
        check_out_6: DF.Data | None
        check_out_6_dt: DF.Datetime | None
        check_out_7: DF.Data | None
        check_out_7_dt: DF.Datetime | None
        check_out_8: DF.Data | None
        check_out_8_dt: DF.Datetime | None
        check_out_9: DF.Data | None
        check_out_9_dt: DF.Datetime | None
        date: DF.Date
        day_of_week: DF.Data | None
        employee: DF.Link
        employee_name: DF.Data | None
        last_modified: DF.Datetime | None
        total_hours: DF.Float
    # end: auto-generated types
    pass


@frappe.whitelist()
def bulk_add_punches(date: str | datetime.datetime, employees: str | list, punches: str | list) -> str:
    if isinstance(date, str):
        date = datetime.datetime.strptime(date, "%Y-%m-%d")
    day_of_week = date.strftime("%A")
    date_str = date.strftime("%Y-%m-%d")
    if isinstance(employees, str):
        employees = json.loads(employees)
    # remove empty rows ("{}") from punches
    if isinstance(punches, str):
        punches = json.loads(punches)
    punches = [punch for punch in punches if punch != {}]
    random_key = random_string(5)
    for employee in employees:
        # remove any leading spaces from employee name
        employee = employee.lstrip()
        employee_name = frappe.db.get_value("Employee", employee, "employee_name")
        workday = Workday(
            {
                "doctype": "Workday",
                "name": f"{employee_name}-{date_str}-{random_key}",
                "employee": employee,
                "employee_name": employee_name,
                "date": date,
                "day_of_week": day_of_week,
            }
        )
        for i in range(len(punches)):
            workday.set(f"check_in_{i + 1}", punches[i]["checkin"])
            workday.set(f"check_out_{i + 1}", punches[i]["checkout"])
        workday.db_insert()
        frappe.db.commit()
        workday = Workday("Workday", workday.name)
        workday.employee = str(employee)
        workday.save()

    return "success"
