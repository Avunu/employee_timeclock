// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/**
 * API Response types for the Timeclock backend.
 * These interfaces match the return types from employee_timeclock.www.timeclock
 */

/** Base response with status */
interface BaseResponse {
	status: "success" | "error" | "unsuccessful";
}

/** authenticate_employee response */
export interface AuthenticateEmployeeResponse extends BaseResponse {
	status: "success" | "error";
	message?: string;
	last_checkin: "IN" | "OUT" | null;
	token?: string;
}

/** log_in_employee / log_out_employee response */
export interface EmployeeCheckinResponse extends BaseResponse {
	status: "success" | "unsuccessful";
	log: unknown; // EmployeeCheckin object
}
