import frappe


@frappe.whitelist()
def manage_job_card_time_logs(job_card, operator=None, employee=None):
    try:
        if employee:
            # check if there is a job card time log that has no end time for this employee
            time_log = frappe.get_list('Job Card Time Log', filters={'to_time': None, 'employee': employee}, fields=['name', 'from_time', 'to_time'])
            if time_log:
                # update the time log with the end time
                time_log = frappe.get_doc('Job Card Time Log', time_log[0].name)
                time_log.to_time = frappe.utils.now_datetime()
                time_log.save()
            else:
                # the job card was marked as complete when another user submitted it for completion. Get the time log for the job card and employee with the most recent modified date
                time_log = frappe.get_list('Job Card Time Log', filters={'parent': job_card, 'employee': employee}, fields=['name', 'from_time', 'to_time'], order_by='modified desc', limit=1)
                time_log = frappe.get_doc('Job Card Time Log', time_log[0].name)
            if operator == 'Start':
                # add a new job card time log to the time log table on the job card
                time_log = frappe.new_doc('Job Card Time Log')
                # parent, parentfield, parenttype
                time_log.parent = job_card
                time_log.parentfield = 'time_logs'
                time_log.parenttype = 'Job Card'
                time_log.employee = employee
                time_log.from_time = frappe.utils.now_datetime()
                time_log.to_time = None
                time_log.idx = len(frappe.get_list('Job Card Time Log', filters={'parent': job_card, 'employee': employee}, fields=['name'])) + 1
                time_log.save()
            frappe.db.commit()
            return {
                'from_time': time_log.from_time,
                'to_time': time_log.to_time
            }
        else:
            # look for all time logs that have no end time for this job card, regardless of employee, and close them
            time_logs = frappe.get_list('Job Card Time Log', filters={'to_time': None, 'parent': job_card}, fields=['name', 'from_time', 'to_time'])
            for time_log in time_logs:
                time_log = frappe.get_doc('Job Card Time Log', time_log.name)
                time_log.to_time = frappe.utils.now_datetime()
                time_log.save()
            frappe.db.commit()
            return 'Success'
    except Exception as e:
        frappe.throw(f"Error in manage_job_card_time_logs: {str(e)}")