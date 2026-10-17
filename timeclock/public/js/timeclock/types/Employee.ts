// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/**
 * Employee from the Frappe backend.
 * Represents an authenticated employee using the timeclock.
 */
export interface Employee {
	name: string;
	id: string;
	/** RFID scanner code for authentication */
	sCode: string;
}
