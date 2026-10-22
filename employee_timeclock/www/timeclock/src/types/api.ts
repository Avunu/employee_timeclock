// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/**
 * API Response types for the Timeclock backend.
 * These interfaces match the return types from employee_timeclock.www.timeclock
 */

/** punch response: the punch recorded and the employee's hours this week */
export interface KioskPunch {
	log_type: "IN" | "OUT";
	employee_name: string;
	weekly_hours: number;
}
