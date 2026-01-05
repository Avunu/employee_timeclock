from hrms.hr.doctype.employee_checkin.employee_checkin import EmployeeCheckin as BaseEmployeeCheckin
from frappe.types import DF


class EmployeeCheckin(BaseEmployeeCheckin):
    """EmployeeCheckin override for type annotations"""

    attendance: DF.Link | None
    device_id: DF.Data | None
    employee: DF.Link
    employee_name: DF.Data | None
    latitude: DF.Float
    log_type: DF.Literal["", "IN", "OUT"]
    longitude: DF.Float
    offshift: DF.Check
    shift: DF.Link | None
    shift_actual_end: DF.Datetime | None
    shift_actual_start: DF.Datetime | None
    shift_end: DF.Datetime | None
    shift_start: DF.Datetime | None
    skip_auto_attendance: DF.Check
    time: DF.Datetime
    manual_override: DF.Check
    manual_override_date: DF.Date | None
    manual_override_time: DF.Time | None
    workday_override: DF.Check
    overridden_time: DF.Datetime | None
    workday: DF.Link | None
    workday_modified: DF.Datetime | None
