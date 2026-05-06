"""Pydantic models for the Job Time Tracker API.

This module is the **single source of truth** for the request/response
contracts shared between the Python backend and the TypeScript frontend.

Run ``generate-types`` (devenv script) to regenerate the corresponding
TypeScript interfaces whenever models change.

IMPORTANT: This module MUST remain free of frappe imports so that the
code-generation script can import it in a plain Python environment.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Shared / entity models
# ---------------------------------------------------------------------------


class ActiveTimer(BaseModel):
	"""Currently running timer for an authenticated employee."""

	work_order: str
	operation: str
	from_time: datetime
	is_corrective: bool


class MachineTimer(BaseModel):
	"""A currently running machine-operation timer visible to an employee group."""

	work_order: str
	operation: str
	from_time: datetime | None = None
	employee_group: str
	is_corrective: bool = False


class JobCardTimeLog(BaseModel):
	"""Single work-session row inside a Job Card."""

	name: str
	from_time: datetime
	to_time: datetime | None = None
	time_in_mins: float
	employee: str


class Operation(BaseModel):
	"""An operation within a work order with aggregated time totals."""

	name: str
	operation: str
	workstation: str
	planned_time_mins: float
	actual_time_mins: float
	employee_time_mins: float
	corrective_total_time_mins: float
	corrective_employee_time_mins: float
	is_submitted: bool
	is_machine_time: bool


class WorkOrder(BaseModel):
	"""Manufacturing work order."""

	name: str
	production_item: str
	status: Literal[
		"Draft",
		"Submitted",
		"Not Started",
		"In Process",
		"Completed",
		"Stopped",
		"Cancelled",
	]
	planned_time_mins: float
	logged_time_mins: float


class Employee(BaseModel):
	"""Authenticated employee using the timeclock."""

	name: str
	employee_name: str
	employee_id: str
	sCode: str


# ---------------------------------------------------------------------------
# API response models
# ---------------------------------------------------------------------------


class AuthenticateEmployeeResponse(BaseModel):
	status: Literal["success", "error"]
	message: str | None = None
	last_checkin: Literal["IN", "OUT"] | None = None
	token: str | None = None


class EmployeeCheckinResponse(BaseModel):
	status: Literal["success", "unsuccessful", "error"]
	message: str | None = None
	log: Any | None = None


class GetWorkOrdersResponse(BaseModel):
	status: Literal["success", "error"]
	message: str | None = None
	token: str | None = None
	work_orders: list[WorkOrder] | None = None


class GetOperationsResponse(BaseModel):
	status: Literal["success", "error"]
	message: str | None = None
	token: str | None = None
	operations: list[Operation] | None = None


class GetActiveTimerResponse(BaseModel):
	status: Literal["success", "error"]
	message: str | None = None
	token: str | None = None
	active_timer: ActiveTimer | None = None


class StartTimerResponse(BaseModel):
	status: Literal["success", "failed"]
	error: str | None = None


class StopTimerResponse(BaseModel):
	status: Literal["success", "failed"]
	error: str | None = None


class UserSessionEmployee(BaseModel):
	user_id: str
	employee_id: str | None = None
	employee_name: str | None = None
	last_checkin: Literal["IN", "OUT"] | None = None


class SubmitJobCardResponse(BaseModel):
	status: Literal["success", "failed"]
	job_card: Any | None = None
	error_message: str | None = None


class GetWorkstationsResponse(BaseModel):
	status: Literal["success"]
	workstations: list[str]


class GetDeviceInfoResponse(BaseModel):
	status: Literal["success"]
	ip: str
	mac: str


class GetMachineTimersResponse(BaseModel):
	status: Literal["success", "error"]
	message: str | None = None
	token: str | None = None
	machine_timers: list[MachineTimer] | None = None


class StopMachineTimerResponse(BaseModel):
	status: Literal["success", "failed"]
	error: str | None = None


class VerifyLoginResponse(BaseModel):
	status: Literal["success", "failed"]
