// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

export type LogType = "IN" | "OUT";

/** What employee_timeclock.www.timeclock.punch returns: the punch recorded and the employee's
 * hours this week. */
export interface KioskPunch {
	log_type: LogType;
	employee_name: string;
	weekly_hours: number;
}

/** What punch() answers: the punch, and the server's clock for the kiosk to keep in step with. */
export interface KioskPunchAnswer extends KioskPunch {
	server_time: string;
}

/** A forgotten punch, entered by hand and waiting for the employee's badge. */
export interface ManualPunch {
	/** `YYYY-MM-DD HH:MM:SS`, as punch() takes it. */
	time: string;
	log_type: LogType;
	/** The entered time as the employee reads it, e.g. "7:30 AM, Thu Oct 23". */
	label: string;
}
