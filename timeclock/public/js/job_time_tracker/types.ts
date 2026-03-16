/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

/**
 * Currently running timer for an authenticated employee.
 */
export interface ActiveTimer {
  work_order: string;
  operation: string;
  from_time: string;
  is_corrective: boolean;
}
export interface AuthenticateEmployeeResponse {
  status: "success" | "error";
  message?: string | null;
  last_checkin?: ("IN" | "OUT") | null;
  token?: string | null;
}
export interface CheckErpLoginResponse {
  user_id: string;
  employee_id?: string | null;
}
/**
 * Authenticated employee using the timeclock.
 */
export interface Employee {
  name: string;
  employee_name: string;
  employee_id: string;
  sCode: string;
}
export interface EmployeeCheckinResponse {
  status: "success" | "unsuccessful" | "error";
  message?: string | null;
  log?: unknown;
}
export interface GetActiveTimerResponse {
  status: "success" | "error";
  message?: string | null;
  token?: string | null;
  active_timer?: ActiveTimer | null;
}
export interface GetDeviceInfoResponse {
  status: "success";
  ip: string;
  mac: string;
}
export interface GetOperationsResponse {
  status: "success" | "error";
  message?: string | null;
  token?: string | null;
  operations?: Operation[] | null;
}
/**
 * An operation within a work order with aggregated time totals.
 */
export interface Operation {
  name: string;
  operation: string;
  workstation: string;
  planned_time_mins: number;
  actual_time_mins: number;
  employee_time_mins: number;
  corrective_total_time_mins: number;
  corrective_employee_time_mins: number;
  is_submitted: boolean;
}
export interface GetWorkOrdersResponse {
  status: "success" | "error";
  message?: string | null;
  token?: string | null;
  work_orders?: WorkOrder[] | null;
}
/**
 * Manufacturing work order.
 */
export interface WorkOrder {
  name: string;
  production_item: string;
  status: "Draft" | "Submitted" | "Not Started" | "In Process" | "Completed" | "Stopped" | "Cancelled";
  planned_time_mins: number;
  logged_time_mins: number;
}
export interface GetWorkstationsResponse {
  status: "success";
  workstations: string[];
}
/**
 * Single work-session row inside a Job Card.
 */
export interface JobCardTimeLog {
  name: string;
  from_time: string;
  to_time?: string | null;
  time_in_mins: number;
  employee: string;
}
export interface StartTimerResponse {
  status: "success" | "failed";
  error?: string | null;
}
export interface StopTimerResponse {
  status: "success" | "failed";
  error?: string | null;
}
export interface SubmitJobCardResponse {
  status: "success" | "failed";
  job_card?: unknown;
  error_message?: string | null;
}
export interface VerifyLoginResponse {
  status: "success" | "failed";
}
