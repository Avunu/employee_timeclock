import frappe


@frappe.whitelist()
def manage_job_card_time_logs(job_card, operator, employee=None):
    try:
        if operator == 'Start':
            # add a new job card time log to the time log table on the job card
            time_log = frappe.new_doc('Job Card Time Log')
            # parent, parentfield, parenttype
            time_log.parent = job_card
            time_log.parentfield = 'time_logs'
            time_log.parenttype = 'Job Card'
            time_log.employee = employee
            time_log.from_time = frappe.utils.now_datetime()
            time_log.idx = len(frappe.get_list('Job Card Time Log', filters={'parent': job_card, 'employee': employee}, fields=['name'])) + 1
            time_log.save()
            frappe.db.commit()
            return
        else:
            # get the job card time log that has no end time
            time_log = frappe.get_list('Job Card Time Log', filters={'parent': job_card, 'to_time': None, 'employee': employee}, fields=['name', 'from_time'])
            # update the time log with the end time
            time_log = frappe.get_doc('Job Card Time Log', time_log[0].name)
            time_log.to_time = frappe.utils.now_datetime()
            time_log.save()            
            frappe.db.commit()
            return
    except Exception as e:
        frappe.throw(f"Error in manage_job_card_time_logs: {str(e)}")