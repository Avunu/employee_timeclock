/**
 * API Response types for the Job Timeclock backend.
 * These interfaces match the return types from timeclock.www.job_timeclock
 */

import type { JobCard, JobCardTimeLog, ActiveLog } from './JobCard';
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

/** get_job_cards response */
export interface GetJobCardsResponse extends BaseResponse {
    status: 'success' | 'error';
    message?: string;
    token?: string;
    job_cards?: JobCard[];
    active_log?: ActiveLog | null;
}

/** sort_jobcard_by_workstation response */
export interface SortJobCardsResponse extends BaseResponse {
    status: 'success';
    sorted_job_cards: JobCard[];
}

/** log_start_time_of_jobcard response */
export interface LogStartTimeResponse extends BaseResponse {
    status: 'success' | 'failed';
    job_card?: unknown;
    updated_log?: JobCardTimeLog[];
    card_logged_out?: 'no cards logged out' | JobCardTimeLog[];
    serverError?: boolean;
}

/** log_end_time_of_jobcard response */
export interface LogEndTimeResponse extends BaseResponse {
    status: 'success' | 'failed';
    updated_log?: JobCardTimeLog[];
    job_card?: unknown;
    error?: string;
}

/** check_for_erp_log_in response */
export interface CheckErpLoginResponse {
    user_id: string;
}

/** submit_jobcard response */
export interface SubmitJobCardResponse extends BaseResponse {
    status: 'success' | 'failed';
    job_card?: unknown;
    error_message?: string;
}

/** log_rework_start_time response */
export interface LogReworkStartResponse extends BaseResponse {
    status: 'success' | 'failed';
    job_card?: unknown;
    updated_log?: JobCardTimeLog[];
    serverError?: boolean;
    error?: string;
}

/** log_rework_end_time response */
export interface LogReworkEndResponse extends BaseResponse {
    status: 'success' | 'failed';
    updated_log?: JobCardTimeLog[];
    error?: string;
    job_card?: unknown;
}

/** verify_login response (for LogInModule) */
export interface VerifyLoginResponse extends BaseResponse {
    status: 'success' | 'failed';
}

/** get_job_card_time_totals response */
export interface GetJobCardTimeTotalsResponse extends BaseResponse {
    status: 'success';
    all_regular_mins: number;
    all_rework_mins: number;
    employee_regular_mins: number;
    employee_rework_mins: number;
}
