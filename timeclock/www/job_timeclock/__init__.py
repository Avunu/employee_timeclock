import datetime
import time
from operator import attrgetter, itemgetter
from typing import Any, Dict, List, Optional, Tuple, Union

import frappe
import getmac
import hrms
import jwt
from erpnext.manufacturing.doctype.job_card.job_card import JobCard
from erpnext.manufacturing.doctype.job_card_time_log.job_card_time_log import \
    JobCardTimeLog
from frappe import _
from frappe.query_builder import DocType
from frappe.rate_limiter import rate_limit
from frappe.utils.data import format_datetime, get_datetime, now_datetime
from timeclock.timeclock.custom.employee_checkin import EmployeeCheckin

# import secret key from site_config.json
SECRET_KEY = frappe.get_site_config().get("encryption_key")

# List of "Machine employees" to be able to run machines same time as other processes.
MACHINE_OPERATIONS: Dict[str, str] = {
    'Machine Staining Hours': 'HR-MACH-ST-00052', 
    'Sanding Machine Hours':'HR-MACH-SA-00053', 
    'CNC Machine Time':'HR-MACH-CNC-00051',
    'Planing Machine Time':'HR-MACH-PL-00054'
}

@frappe.whitelist(allow_guest=True)
@rate_limit(limit=1, seconds=1)
def authenticate_employee(rfid: str) -> Dict[str, Any]:
    """
    Authenticate an employee using their RFID badge.
    
    Validates the RFID against the database and generates a JWT token for the employee.
    Also retrieves the last check-in status to determine if the employee is clocked in or out.
    
    Args:
        rfid: The RFID identifier from the employee's badge
    
    Returns:
        Dict containing:
            - status: "success" or "error"
            - message: Error message if authentication failed
            - last_checkin: The last check-in type ("IN" or "OUT") if successful
            - token: JWT authentication token if successful
    
    Raises:
        None: Returns error dict instead of raising exceptions
    """
	# mac_address = getmac.get_mac_address()
    # Validate the RFID against the database
    employee_id = frappe.get_value(
        "Attendance Device ID", {"id": rfid}, "parent")

    if not employee_id:
        return {"status": "error", "message": ("Invalid RFID")}

    # If valid, generate a JWT
    token = refresh_token(str(employee_id))

    # get the last employee checkin to see if the employee is clocked in or out
    last_checkin: List[str] = frappe.get_list("Employee Checkin",
                                   filters={"employee": employee_id},
                                   order_by="modified desc",
                                   limit=1,
                                   ignore_permissions=True,
                                   pluck="log_type")

    # get the last Job Card Time Log where there is no to_time to see if a timer is running
    # open_job_card_time_log = frappe.get_list("Job Card Time Log",
    #                                             filters={"employee": employee_id,
    #                                                      "to_time": None},
    #                                             order_by="modified desc",
    #                                             limit=1,
    #                                             ignore_permissions=True,
    #                                             pluck="name")
    
    # if (open_job_card_time_log):
    #     open_job_card_name = frappe.get_value("Job Card Time Log", open_job_card_time_log, "parent")
    #     open_job_card = frappe.get_doc("Job Card", open_job_card_name)
    
    # check to see if there is any Job Card Time Log that was started but not ended

    return {
        "status": "success",
        "last_checkin": last_checkin[0] if last_checkin else None,
        "token": token}


    # return {
    #     "status": "success",
    #     "last_checkin": last_checkin[0] if last_checkin else None,
    #     "open_job_card": open_job_card.name if open_job_card_time_log else None,
    #     "token": token}

@frappe.whitelist(allow_guest=True)
def log_in_employee(token: str, time: str) -> Dict[str, Any]:
    """
    Log an employee's clock-in (IN) time.
    
    Creates a new Employee Checkin record with log_type "IN" for the authenticated employee.
    The checkin is created from the Job Timeclock Scanner device.
    
    Args:
        token: JWT authentication token for the employee
        time: Timestamp string for the check-in time
    
    Returns:
        Dict containing:
            - status: "success" or "unsuccessful"
            - log: The created EmployeeCheckin object
    
    Raises:
        None: Catches exceptions and returns unsuccessful status
    """
    
    employee_id, token = extract_employee_from_token(token)
    
    new_log = EmployeeCheckin("Employee Checkin", {})
    new_log.employee = employee_id
    new_log.time= time
    new_log.log_type = "IN"
    new_log.manual_override = False
    new_log.device_id = 'Job Timeclock Scanner'
    try:
        new_log.insert(ignore_permissions=True)
    except:
        pass
    if new_log:
        return {"status":"success", "log": new_log}
    else:
        return {"status":"unsuccessful", "log": new_log}

    # try:
    #     new_log.insert(ignore_permissions= True)
    #     return {"status":"success", "log": new_log}
    # except:
    #     return {"status":"unsuccessful", "log": new_log}

# Issue with logout. The log is made but _unsaved = True. so its not passing to workday management 
@frappe.whitelist(allow_guest=True)  
def log_out_employee(token: str, time: str) -> Dict[str, Any]:
    """
    Log an employee's clock-out (OUT) time.
    
    Creates a new Employee Checkin record with log_type "OUT" for the authenticated employee.
    The checkin is created from the Job Timeclock Scanner device.
    
    Args:
        token: JWT authentication token for the employee
        time: Timestamp string for the check-out time
    
    Returns:
        Dict containing:
            - status: "success" or "unsuccessful"
            - log: The created EmployeeCheckin object
    
    Raises:
        None: Catches exceptions and returns unsuccessful status
    """
    employee_id, token = extract_employee_from_token(token)
    
    new_log = EmployeeCheckin("Employee Checkin", {})
    new_log.employee = employee_id
    new_log.time= time
    new_log.log_type = "OUT"
    new_log.manual_override = False
    new_log.device_id = 'Job Timeclock Scanner'
    try:
        new_log.insert(ignore_permissions=True)
        new_log.save()
    except:
        pass
    if new_log:
        return {"status":"success", "log": new_log}
    else:
        return {"status":"unsuccessful", "log": new_log}
    

@frappe.whitelist(allow_guest=True)
@rate_limit(limit=1, seconds=1)
def get_work_orders(token: str) -> Dict[str, Any]:
    """
    Retrieve all active work orders for display in the job timeclock.
    
    Fetches work orders with status of "Submitted", "Not Started", or "In Process".
    Authenticates the employee via JWT token before retrieving work orders.
    
    Args:
        token: JWT authentication token for the employee
    
    Returns:
        Dict containing:
            - status: "success" or "error"
            - token: Refreshed JWT token
            - work_orders: List of work order dicts with name, production_item, and status
            - message: Error message if authentication failed
    
    Raises:
        None: Returns error dict on exception
    """
    frappe.publish_realtime('test','aye yooooo')
    
    try:
        employee_id, token = extract_employee_from_token(token)
    except Exception as e:
        return {"status": "error", "message": str(e)}

    # Get the employee's work orders
    # work order status can be Submitted, Not Started, or In Process
    work_orders: List[Dict[str, Any]] = frappe.get_list("Work Order",
                                  filters={"status": [
                                      "in", ["Submitted", "Not Started", "In Process"]]},
                                  fields=["name", "production_item", "status"], ignore_permissions=True)
    return {"status": "success", "token": token, "work_orders": work_orders}


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=4, seconds=1)
def get_job_cards(token: str, work_order: str) -> Dict[str, Any]:
    """
    Retrieve all job cards for a specific work order.
    
    Fetches job cards filtered by work order, enriches them with time log information,
    and determines which cards are currently active for the authenticated employee.
    Handles both regular employee operations and machine operations.
    
    Args:
        token: JWT authentication token for the employee
        work_order: Name/ID of the work order to fetch job cards for
    
    Returns:
        Dict containing:
            - status: "success" or error message
            - token: Refreshed JWT token
            - job_cards: List of job cards sorted by sequence_id with time log info
            - time_logs: All time logs for the job cards
            - active_cards: List of booleans indicating which cards are active
    
    Raises:
        None: Returns error dict on exception
    """
    # authenticate the employee
    try:
        employee_id, token = extract_employee_from_token(token)
    except Exception as e:
        return {"status": "error", "message": str(e)}

    # Get the employee's job cards
    job_cards: List[Any] = frappe.get_list("Job Card",
                                filters={"work_order": work_order},
                                fields=["name", "operation", "status","sequence_id"], ignore_permissions=True)
    
    if job_cards == []:
        return {"status": "success", "token": token, "job_cards": job_cards, "time_logs":''  }
    else:
        job_cards, time_logs = update_job_cards_with_time_log(job_cards, employee_id)
        job_cards = sorted(job_cards, key=attrgetter('sequence_id'))
        active_cards: List[bool] = check_jobcard_active(job_cards)
        return {"status": "success", "token": token, "job_cards": job_cards, "time_logs": time_logs, "active_cards":active_cards  }


def update_job_cards_with_time_log(job_cards: List[Any], employee_id: str) -> Tuple[List[Any], List[Any]]:
    """
    Enrich job cards with their latest time log information for a specific employee.
    
    For each job card, fetches all time logs and filters them by employee ID.
    For machine operations, filters by machine employee ID instead.
    Attaches the most recent time log to each job card object.
    
    Args:
        job_cards: List of job card objects to enrich
        employee_id: The employee ID to filter time logs for
    
    Returns:
        Tuple containing:
            - new_job_cards: List of job cards with latest time_logs attached
            - all_logs: List of all time logs from all job cards
    
    Raises:
        None
    """
    new_job_cards: List[Any] = []
    all_logs: List[Any] = []
    for card in job_cards:
        full: JobCard = JobCard("Job Card", card.name)
        
        #get all the time Logs
        time_logs: List[JobCardTimeLog] = full.time_logs
        all_logs.append(time_logs)

        # filter for machine.
        if card.operation in MACHINE_OPERATIONS.keys():
            for key,machine_id in MACHINE_OPERATIONS.items():
                if key == card.operation:
                    employee_logs: List[JobCardTimeLog] = []
                    for log in time_logs:
                        if log.employee == machine_id:
                            employee_logs.append(log)
                    break
        # filter by employee.
        else:
            employee_logs: List[JobCardTimeLog] = []
            for log in time_logs:
                if log.employee == employee_id:
                    employee_logs.append(log)

        if employee_logs != []:
            latest_time_log: JobCardTimeLog = max(employee_logs, key=lambda log: log.from_time or datetime.datetime.min)
            card.time_logs = latest_time_log
            new_job_cards.append(card)
        else:
            card.time_logs = time_logs
            new_job_cards.append(card)

    

    return new_job_cards, all_logs

def check_jobcard_active(employee_job_cards: List[Any]) -> List[bool]:
    """
    Determine which job cards have active (running) timers.
    
    A job card is considered active if it has a time log with time_in_mins equal to 0,
    indicating the timer is still running (no end time set).
    
    Args:
        employee_job_cards: List of job card objects already filtered by employee
    
    Returns:
        List of booleans corresponding to each job card indicating if it's active
    
    Raises:
        None
    """
    # Job cards coming in are already filtered by the employee clocked into system.

    active: int = 0
    active_cards: List[bool] = []
    for card in employee_job_cards:
        if card.time_logs:
            try:
                if card.time_logs.time_in_mins == 0:
                    active += 1
                else:
                    pass
            except:
                pass
            if active > 0:
                # card["is_active"] = True
                active_cards.append(True)
            else:
                # card["is_active"] = False
                active_cards.append(False)
            active = 0
        else:
            active_cards.append(False)
    
    # if len(active_cards) != len(employee_job_cards):
    #     return 

    return active_cards

@frappe.whitelist(allow_guest=True)
def sort_jobcard_by_workstation(jobCards: List[Dict[str, Any]], workstation: str) -> Dict[str, Any]:
    """
    Sort job cards to prioritize operations relevant to a specific workstation.
    
    Moves job cards with operations matching the specified workstation to the top of the list,
    making it easier for employees to find relevant work at their current workstation.
    
    Args:
        jobCards: List of job card dictionaries to sort
        workstation: Name of the workstation (e.g., "Planer", "CNC", "Hand Sanding")
    
    Returns:
        Dict containing:
            - status: "success"
            - sorted_job_cards: Reordered list with relevant operations at the top
    
    Raises:
        None
    """
    operation_workstation: List[Dict[str, Any]] = [{"workstation":"Planer", "operation":["Planing Machine Time","Pulling & Planing"]},
                             {"workstation":"CNC", "operation":["CNC Labor", "CNC Machine Time"]},
                             {"workstation":"Hand Sanding", "operation":["Hand Sanding"]},
                             {"workstation":"Sander/Stainer", "operation":["Sanding Machine Labor", "Sanding Machine Hours","Machine Staining Labor","Machine Staining Hours"]},
                             {"workstation":"Truss Assembly", "operation":["Truss Assembly", "Hardware Packing Labor","Packing Labor"]},
                             {"workstation":"T&G Cutting", "operation":["T&G Cutting"]}
                            ]

    for entry in operation_workstation:
        if entry['workstation'] == workstation:
            operations: List[str] = entry["operation"]
    
    top_index: List[Dict[str, Any]] = []
    new_jobCards: List[Dict[str, Any]] = []
    waste: List[Dict[str, Any]] = []
    for card in jobCards:
        for station_operation in operations:
            if card["operation"] == station_operation and card not in waste:
                top_index.append(card)
                waste.append(card)
            elif card not in new_jobCards and card not in waste:
                new_jobCards.append(card)
                waste.append(card)
  
    if len(top_index)==0:
        return {'status':'success', 'sorted_job_cards':jobCards}
    

    i: int = 0
    for index in top_index:
        new_jobCards.insert(i,index)
        i+=1
    
    return {'status':'success', 'sorted_job_cards':new_jobCards}


def extract_employee_from_token(token: str) -> Tuple[str, str]:
    """
    Extract and validate employee ID from JWT token.
    
    Decodes the JWT token using the secret key, validates the employee ID,
    and generates a refreshed token with extended expiration time.
    
    Args:
        token: JWT token string to decode
    
    Returns:
        Tuple containing:
            - employee_id: The authenticated employee's ID
            - refreshed_token: New JWT token with extended expiration
    
    Raises:
        frappe.AuthenticationError: If token is expired or invalid
    """
    try:
        # Decode the JWT using the same secret key
        payload: Dict[str, Any] = jwt.decode(token, SECRET_KEY or "", algorithms=['HS256'])
        employee_id: Optional[str] = payload.get("employee_id")

        if not employee_id:
            raise jwt.InvalidTokenError

        # refresh the token
        refreshed_token: str = refresh_token(employee_id)

        return employee_id, refreshed_token

    except jwt.ExpiredSignatureError:
        # The token has expired
        frappe.throw(_("Token has expired. Please re-authenticate."),
                     exc=frappe.AuthenticationError)
        raise  # This line will never be reached but satisfies type checker

    except jwt.InvalidTokenError:
        # The token is invalid for some other reason
        frappe.throw(_("Invalid token. Please re-authenticate."),
                     exc=frappe.AuthenticationError)
        raise  # This line will never be reached but satisfies type checker


def refresh_token(employee_id: str) -> str:
    """
    Generate a new JWT token for an employee with 30-minute expiration.
    
    Creates a fresh JWT token containing the employee ID, name, and expiration timestamp.
    Used to maintain authentication sessions and extend login time.
    
    Args:
        employee_id: The employee's unique identifier
    
    Returns:
        Encoded JWT token string valid for 30 minutes
    
    Raises:
        None
    """
    employee_name = frappe.get_value(
        "Employee", {"employee": employee_id}, "employee_name")
    # If valid, generate a JWT
    expires: float = (datetime.datetime.now() +
               datetime.timedelta(minutes=30)).timestamp()
    token: str = jwt.encode(
        payload={"employee_id": employee_id,
                 "employee_name": employee_name, "exp": expires},
        key=SECRET_KEY or "",
        algorithm='HS256')

    return token

@frappe.whitelist(allow_guest=True)
def log_start_time_of_jobcard(employee_id: str, start_time: str, jobcard_name: str) -> Dict[str, Any]:
    """
    Start a timer on a job card by logging the start time.
    
    Creates a new Job Card Time Log entry with the start time for the employee.
    For machine operations, uses the machine employee ID instead of the regular employee.
    Automatically clocks out the employee from any other active job cards.
    
    Args:
        employee_id: The employee starting work on the job card
        start_time: Timestamp string for when work begins
        jobcard_name: Name/ID of the job card to start
    
    Returns:
        Dict containing:
            - status: "success" or "failed"
            - job_card: The updated JobCard object
            - updated_log: The complete list of time logs
            - card_logged_out: List of cards the employee was logged out from
            - serverError: True if an exception occurred
    
    Raises:
        None: Catches and logs exceptions
    """

    job_card: JobCard = JobCard("Job Card", jobcard_name, ignore_permissions=True)
    new_time_log: JobCardTimeLog = JobCardTimeLog('Job Card Time Log', {})

    if job_card.operation in MACHINE_OPERATIONS.keys():
        for key,machine_id in MACHINE_OPERATIONS.items():
            if key == job_card.operation:
                # log out other machine times.
                card_logged_out: Union[str, List[Any]] = check_all_job_cards(machine_id, start_time)
                new_time_log.update({
                    'from_time': start_time,
                    'employee': machine_id
                })
                break

    else:
        # here so that machine time won't log employee out
        try:
            card_logged_out = check_all_job_cards(employee_id, start_time)
            new_time_log.update({
                'from_time': start_time,
                'employee': employee_id,
            })
        except:
            new_time_log.update({
                'from_time': start_time,
                'employee': employee_id,
            })

    try:
        job_card.append('time_logs', new_time_log)
        job_card.save(ignore_permissions=True)
        updated_log = job_card.time_logs
        return {"status": "success", "job_card": job_card, "updated_log": updated_log, "card_logged_out": card_logged_out}

    except Exception as e:
        frappe.log_error('Error Saving Log', e)
        # job_card = 'log_start_time_failed.'
        job_card.save(ignore_permissions=True)
        return {"status": "failed", "job_card":job_card, "serverError": True}

@frappe.whitelist(allow_guest=True)
def log_end_time_of_jobcard(employee_id: str, end_time: str, jobcard_name: str) -> Dict[str, Any]:
    """
    Stop a timer on a job card by logging the end time.
    
    Updates the most recent Job Card Time Log entry for the employee by setting the end time.
    For machine operations, uses the machine employee ID to find the correct time log.
    
    Args:
        employee_id: The employee stopping work on the job card
        end_time: Timestamp string for when work ends
        jobcard_name: Name/ID of the job card to stop
    
    Returns:
        Dict containing:
            - status: "success" or "failed"
            - updated_log: The complete list of time logs
            - job_card: The JobCard object if failed
    
    Raises:
        None: Returns failed status on exception
    """

    job_card: JobCard = JobCard("Job Card", jobcard_name, ignore_permissions=True)
    
    if job_card.operation in MACHINE_OPERATIONS.keys():
        for key,machine_id in MACHINE_OPERATIONS.items():
            if key == job_card.operation:
                employee_id = machine_id
                break

    employee_logs: List[JobCardTimeLog] = []
    for log in job_card.time_logs:
        if log.employee == employee_id:
            employee_logs.append(log)

    # last_time_log = job_card.time_logs[-1]
    last_time_log: JobCardTimeLog = employee_logs[-1]

    last_time_log.update({
        'to_time': end_time,
    })

    try:
        job_card.append('time_logs', last_time_log)
        job_card.save(ignore_permissions=True)
        updated_log: List[JobCardTimeLog] = job_card.time_logs
        return {"status": "success", "updated_log": updated_log, }
    except:
        return {"status": "failed", "job_card":job_card}

# Function to check out employee of a job card, when they start a new one. 
@frappe.whitelist(allow_guest=True)
def check_all_job_cards(employee_id: str, time: str) -> Union[str, List[Any]]:
    """
    Clock out an employee from all active job cards across all work orders.
    
    Searches through all active work orders (Not Started or In Process) to find
    job cards where the employee has an open time log (no end time). Automatically
    closes all such time logs with the provided time. Excludes machine operations.
    
    Args:
        employee_id: The employee to clock out from active job cards
        time: Timestamp string to use as the end time for open logs
    
    Returns:
        Union of:
            - String: "no cards logged out" if no active cards found
            - List: List of time log objects that were closed
    
    Raises:
        None
    """
    # work_orders = frappe.db.get_list('Work Order', filters=[{
    #     'status':'Not Started'}, {'status':'In Process'}], pluck='name')
    work_orders: List[Dict[str, Any]] = frappe.db.get_list('Work Order', or_filters=[{
        'status':'Not Started'},{'status':'In Process'}], fields=["name","status"], ignore_permissions=True)

    # Get all job cards and check for employee id
    job_cards_list: List[Any] = []
    for work_order in work_orders:
        
        #get job cards by work
        job_cards: List[Any] = frappe.db.get_list("Job Card", 
                                       filters={"work_order":work_order["name"]}, 
                                       fields=["name"], 
                                       ignore_permissions=True)
        
        if len(job_cards) == 0:
            pass
        else:
            for job_card in job_cards:
                full_job_card: JobCard = JobCard("Job Card", job_card.name, ignore_permissions=True)
                job_card.time_logs = full_job_card.time_logs

                duplicate = []
                for log in job_card.time_logs:
                    if log.employee == employee_id and job_card not in duplicate:
                        job_cards_list.append(job_card)
                        duplicate.append(job_card)
    # Exit if no job cards are found with employee.
    if len(job_cards_list) == 0:
        return 'no cards logged out'
    
    # Go through job cards for employee
    card_logged_out: List[Any] = []
    for card in job_cards_list:
        # job_card = frappe.get_doc('Job Card', card.name, ignore_permissions = True)
        for log in card.time_logs:
            if not log.to_time and card and (card.operation not in MACHINE_OPERATIONS.keys()) and log.employee == employee_id:
                response: Dict[str, Any] = log_end_time_of_jobcard(employee_id, time, card.name)
                card_logged_out.append(log)
            else:
                pass
                
    if len(card_logged_out)==0:
        return 'no cards logged out'
    # return {'card_logged_out':card_logged_out, 'employee':employee_id}
    return card_logged_out

@frappe.whitelist(allow_guest=True)
def get_employees() -> Dict[str, Any]:
    """
    Get a list of test employees for development/testing purposes.
    
    Returns hardcoded employee data including ID, name, and security code.
    This appears to be a mock/test function rather than pulling from the database.
    
    Args:
        None
    
    Returns:
        Dict containing:
            - status: "success"
            - employees: List of employee dicts with id, name, and sCode
    
    Raises:
        None
    """
    employees: List[Dict[str, Any]] = [
        {'id':1, 'name':'Nick Alzamora', 'sCode':'1234512345' },
        {'id':2, 'name':'Sammy Glick', 'sCode':'2013620484'},
        {'id':3, 'name':'Alan Mendoza','sCode':'3234512345'},
        {'id':4, 'name':'Elmer Sol','sCode':'4234512345'},
        {'id':5, 'name':'Nate Stoltzfus','sCode':'5234512345'},
        {'id':6, 'name':'Nate Vasquez','sCode':'6234512345'},
        {'id':7, 'name':'Levi Fisher','sCode':'7234512345'},
        {'id':8, 'name':'Sylvan Jr.','sCode':'9234512345'},
        {'id':9, 'name':'Omar Blank.','sCode':'10234512345'},
        {'id':10, 'name':'Mannie Fisher.','sCode':'11234512345'},
        {'id':10, 'name':'Tester Testing McTesterson','sCode':'1939516420'},
    ]

    return {'status': 'success', 'employees': employees}


@frappe.whitelist(allow_guest=True)
def check_for_erp_log_in() -> Dict[str, Any]:
    """
    Check if a user is logged into the ERP system.
    
    Determines whether the current session belongs to an authenticated user
    or a guest visitor by examining the frappe session.
    
    Args:
        None
    
    Returns:
        Dict containing:
            - user_id: The current user's ID or "Guest" if not logged in
    
    Raises:
        None
    """
    if frappe.session.user != 'Guest':
        return {'user_id': frappe.session.user}
    else:
        return {'user_id': frappe.session.user}

@frappe.whitelist(allow_guest=True)
def submit_jobcard(jobCard: Dict[str, Any], complete_time: str, employee_id: str) -> Dict[str, Any]:
    """
    Complete and submit a job card by closing all open time logs.
    
    Closes any open time logs on the job card by setting their end time,
    marks them as completed, and updates the job card status to "Completed".
    
    Args:
        jobCard: Dictionary containing job card data including name and operation
        complete_time: Timestamp string for when the job was completed
        employee_id: The employee completing the job card
    
    Returns:
        Dict containing:
            - status: "success" or "failed"
            - job_card: The completed JobCard object if successful
            - error_message: Description of the error if failed
    
    Raises:
        None: Returns failed status with error message
    """
    completed_qty: int = 1
    status: str = 'Submitted'
    doc: JobCard = JobCard("Job Card", jobCard["name"], ignore_permissions=True)
    
    if doc.time_logs and len(doc.time_logs) > 0:
        last_row: JobCardTimeLog = doc.time_logs[-1]
    
    if last_row and complete_time:

        for row in doc.time_logs:
            # return {'status':'success', 'job_card':row}
            if not row.to_time:
                row.update(
                    {
                        "to_time": get_datetime(complete_time),
                        "operation": jobCard["operation"],
                        "completed_qty": 1.0,
                    }
                )
        
        doc.status = "Completed"
        doc.save(ignore_permission=True)
        return {'status':'success', 'job_card':doc}
       
    else:
        error_message: str = 'Log has unfinished times.'
        return {'status':'failed','error_message':error_message}

@frappe.whitelist(allow_guest=True)
def log_rework_start_time(employee_id: str, start_time: str, jobcard_name: str) -> Dict[str, Any]:
    """
    Start a rework timer on a job card for corrective work.
    
    Creates a Job Card Time Log entry marked as corrective (is_corrective_job_card=True)
    to track rework time separately from normal production time. This is used when
    quality issues require additional work on a previously completed job.
    
    Args:
        employee_id: The employee performing the rework
        start_time: Timestamp string for when rework begins
        jobcard_name: Name/ID of the job card requiring rework
    
    Returns:
        Dict containing:
            - status: "success" or "failed"
            - job_card: The updated JobCard object
            - updated_log: The complete list of time logs
            - serverError: True if an exception occurred
            - error: Error message string if exception occurred
    
    Raises:
        None: Catches and logs exceptions
    """
    job_card: JobCard = JobCard("Job Card", jobcard_name, ignore_permissions=True)
    new_time_log: JobCardTimeLog = JobCardTimeLog('Job Card Time Log', {})

    if job_card.operation in MACHINE_OPERATIONS.keys():
        for key,machine_id in MACHINE_OPERATIONS.items():
            if key == job_card.operation:
                new_time_log.update({
                    'from_time': start_time,
                    'employee': machine_id,
                    'is_corrective_job_card': True,
                    'for_job_card': jobcard_name
                })
                break
    else:
        new_time_log.update({
            'from_time': start_time,
            'employee': employee_id,
            'is_corrective_job_card': True,
            'for_job_card': jobcard_name
        })

    try:
        job_card.append('time_logs', new_time_log)
        job_card.save(ignore_permissions=True)
        updated_log: List[JobCardTimeLog] = job_card.time_logs
        return {"status": "success", "job_card": job_card, "updated_log": updated_log}

    except Exception as e:
        frappe.log_error('Error Saving Rework Log', e)
        job_card.save(ignore_permissions=True)
        return {"status": "failed", "job_card":job_card, "serverError": True, "error": str(e)}

@frappe.whitelist(allow_guest=True)
def log_rework_end_time(employee_id: str, end_time: str, jobcard_name: str) -> Dict[str, Any]:
    """
    Stop a rework timer on a job card by logging the end time.
    
    Updates the most recent corrective Job Card Time Log entry for the employee
    by setting the end time. Only affects logs marked with is_corrective_job_card=True.
    For machine operations, uses the machine employee ID.
    
    Args:
        employee_id: The employee stopping the rework
        end_time: Timestamp string for when rework ends
        jobcard_name: Name/ID of the job card to stop rework on
    
    Returns:
        Dict containing:
            - status: "success" or "failed"
            - updated_log: The complete list of time logs if successful
            - error: Error message string if failed
            - job_card: The JobCard object if failed
    
    Raises:
        None: Catches and logs exceptions, returns error in dict
    """
    job_card: JobCard = JobCard("Job Card", jobcard_name, ignore_permissions=True)
    
    if job_card.operation in MACHINE_OPERATIONS.keys():
        for key,machine_id in MACHINE_OPERATIONS.items():
            if key == job_card.operation:
                employee_id = machine_id
                break

    # Find the last corrective time log for this employee
    employee_logs: List[JobCardTimeLog] = []
    for log in job_card.time_logs:
        if log.employee == employee_id and getattr(log, 'is_corrective_job_card', False):
            employee_logs.append(log)

    if not employee_logs:
        return {"status": "failed", "error": "No active rework time log found"}

    last_time_log: JobCardTimeLog = employee_logs[-1]

    last_time_log.update({
        'to_time': end_time,
    })

    try:
        job_card.save(ignore_permissions=True)
        updated_log: List[JobCardTimeLog] = job_card.time_logs
        return {"status": "success", "updated_log": updated_log}
    except Exception as e:
        frappe.log_error('Error Ending Rework Log', e)
        return {"status": "failed", "job_card":job_card, "error": str(e)}