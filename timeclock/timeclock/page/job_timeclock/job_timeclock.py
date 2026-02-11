import asyncio

import frappe


@frappe.whitelist()
def manage_job_card_time_logs(job_card, operator=None, employee=None):
    try:
        if employee:
            # check if there is a job card time log that has no end time for this employee
            # time_log = frappe.get_list('Job Card Time Log', filters={'to_time': None, 'employee': employee}, fields=['name', 'from_time', 'to_time'])
            time_log = frappe.db.sql(
                """
                SELECT name, from_time, to_time
                FROM `tabJob Card Time Log`
                WHERE to_time IS NULL
                AND employee = %(employee)s
            """,
                {"employee": employee},
                as_dict=True,
            )
            if time_log:
                # update the time log with the end time
                time_log = frappe.get_doc("Job Card Time Log", time_log[0].name)
                time_log.to_time = frappe.utils.now_datetime()
                time_log.save()
            else:
                # the job card was marked as complete when another user submitted it for completion. Get the time log for the job card and employee with the most recent modified date
                # time_log = frappe.get_list('Job Card Time Log', filters={'parent': job_card, 'employee': employee}, fields=['name', 'from_time', 'to_time'], order_by='modified desc', limit=1)
                time_log = frappe.db.sql(
                    """
                    SELECT name, from_time, to_time
                    FROM `tabJob Card Time Log`
                    WHERE parent = %(job_card)s
                    AND employee = %(employee)s
                    ORDER BY modified desc
                    LIMIT 1
                """,
                    {"job_card": job_card, "employee": employee},
                    as_dict=True,
                )
                if time_log:
                    time_log = frappe.get_doc("Job Card Time Log", time_log[0].name)
            if operator == "Start":
                # add a new job card time log to the time log table on the job card
                time_log = frappe.new_doc("Job Card Time Log")
                # parent, parentfield, parenttype
                time_log.parent = job_card
                time_log.parentfield = "time_logs"
                time_log.parenttype = "Job Card"
                time_log.employee = employee
                time_log.from_time = frappe.utils.now_datetime()
                time_log.to_time = None
                # time_log.idx = len(frappe.get_list('Job Card Time Log', filters={'parent': job_card, 'employee': employee}, fields=['name'])) + 1
                time_log.save()
            frappe.db.commit()
            return {"from_time": time_log.from_time, "to_time": time_log.to_time}
        else:
            # look for all time logs that have no end time for this job card, regardless of employee, and close them
            # time_logs = frappe.get_list('Job Card Time Log', filters={'to_time': None, 'parent': job_card}, fields=['name', 'from_time', 'to_time'])
            time_logs = frappe.db.sql(
                """
                SELECT name, from_time, to_time
                FROM `tabJob Card Time Log`
                WHERE to_time IS NULL
                AND parent = %(job_card)s
            """,
                {"job_card": job_card},
                as_dict=True,
            )
            for time_log in time_logs:
                time_log = frappe.get_doc("Job Card Time Log", time_log.name)
                time_log.to_time = frappe.utils.now_datetime()
                time_log.save()
            frappe.db.commit()
            return "Success"
    except Exception as e:
        frappe.throw(f"Error in manage_job_card_time_logs: {str(e)}")


@frappe.whitelist()
def get_job_card_time_logs(employee):
    try:
        # Construct the SQL query string
        sql_query = """
            SELECT parent, from_time
            FROM `tabJob Card Time Log`
            WHERE to_time IS NULL
            AND employee = %(employee)s
        """

        # Execute the SQL query and fetch the results
        time_logs = frappe.db.sql(sql_query, {"employee": employee}, as_dict=True)

        return time_logs
    except Exception as e:
        frappe.throw(f"Error in get_job_card_time_logs: {str(e)}")


@frappe.whitelist()
def finish_job_card(job_card_name):
    try:
        job_card = frappe.get_doc("Job Card", job_card_name)
        # THIS IS VERY HACKY AND SHOULD BE FIXED WITH A BETTER SOLUTION
        # get the last time log for this job card using sql
        if job_card.total_completed_qty != job_card.for_quantity:
            # get the difference between the total_completed_qty and the for_quantity
            difference = job_card.for_quantity - job_card.total_completed_qty
            time_log = frappe.db.sql(
                """
                SELECT name
                FROM `tabJob Card Time Log`
                WHERE parent = %(job_card)s
                ORDER BY modified desc
                LIMIT 1
            """,
                {"job_card": job_card_name},
                as_dict=True,
            )
            if time_log:
                time_log = frappe.get_doc("Job Card Time Log", time_log[0].name)
                # set the completed_qty to the job_card for_quantity
                time_log.completed_qty = difference
                time_log.save()
            job_card.reload()
        job_card.submit()
        frappe.db.commit()
        return "Success"
    except Exception as e:
        frappe.throw(f"Error in finish_job_card: {str(e)}")
