/**
 * API Response types for the Job Timeclock backend.
 * These interfaces match the return types from timeclock.www.job_time_tracker
 */

import type { Operation, JobCardTimeLog, ActiveTimer } from './JobCard';
import type { WorkOrder } from './WorkOrder';

/** Base response with status */
interface BaseResponse {
    status: 'success' | 'error' | 'failed' | 'unsuccessful';
}

/** Error response with message */
interface ErrorResponse extends BaseResponse {
    status: 'error';
    message: string;
}

/** authenticate_employee response */
export interface AuthenticateEmployeeResponse extends BaseResponse {
    status: 'success' | 'error';
    message?: string;
    last_checkin: 'IN' | 'OUT' | null;
    token?: string;
}

/** log_in_employee / log_out_employee response */
export interface EmployeeCheckinResponse extends BaseResponse {
    status: 'success' | 'unsuccessful';
    log: unknown; // EmployeeCheckin object
}

/** get_work_orders response */
export interface GetWorkOrdersResponse extends BaseResponse {
    status: 'success' | 'error';
    message?: string;
    token?: string;
    work_orders?: WorkOrder[];
}

/** get_operations response */
export interface GetOperationsResponse extends BaseResponse {
    status: 'success' | 'error';
    message?: string;
    token?: string;
    operations?: Operation[];
}

/** get_active_timer response */
export interface GetActiveTimerResponse extends BaseResponse {
    status: 'success' | 'error';
    message?: string;
    token?: string;
    active_timer?: ActiveTimer | null;
}

/** start_timer response */
export interface StartTimerResponse extends BaseResponse {
    status: 'success' | 'failed';
    error?: string;
}

/** stop_timer response */
export interface StopTimerResponse extends BaseResponse {
    status: 'success' | 'failed';
    error?: string;
}

/** check_for_erp_log_in response */
export interface CheckErpLoginResponse {
    user_id: string;
    employee_id?: string;
}

/** submit_jobcard response */
export interface SubmitJobCardResponse extends BaseResponse {
    status: 'success' | 'failed';
    job_card?: unknown;
    error_message?: string;
}

/** get_workstations response */
export interface GetWorkstationsResponse extends BaseResponse {
    status: 'success';
    workstations: string[];
}

/** get_device_info response */
export interface GetDeviceInfoResponse extends BaseResponse {
    status: 'success';
    ip: string;
    mac: string;
}

/** verify_login response (for LogInModule) */
export interface VerifyLoginResponse extends BaseResponse {
    status: 'success' | 'failed';
}
