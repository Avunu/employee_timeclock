// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/**
 * Branded type for Frappe datetime strings
 * Format: YYYY-MM-DD HH:MM:SS
 *
 * This is a nominal/branded type that provides compile-time safety
 * to ensure datetime strings are properly formatted before being sent to Frappe.
 *
 * @example
 * const dt: FrappeDateTimeString = "2026-01-06 15:30:45" as FrappeDateTimeString;
 */
export type FrappeDateTimeString = string & { readonly __brand: "FrappeDateTimeString" };

/**
 * Type guard to check if a string matches the Frappe datetime format
 * Pattern: YYYY-MM-DD HH:MM:SS
 *
 * @param value - String to validate
 * @returns True if the string matches the expected format
 */
export function isFrappeDateTimeString(value: string): value is FrappeDateTimeString {
	const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
	return pattern.test(value);
}

/**
 * Safely converts a string to FrappeDateTimeString after validation
 *
 * @param value - String to convert
 * @returns FrappeDateTimeString if valid
 * @throws Error if string doesn't match expected format
 */
export function toFrappeDateTimeString(value: string): FrappeDateTimeString {
	if (!isFrappeDateTimeString(value)) {
		throw new Error(`Invalid Frappe datetime format: ${value}. Expected format: YYYY-MM-DD HH:MM:SS`);
	}
	return value as FrappeDateTimeString;
}

/**
 * Converts a Date object to FrappeDateTimeString format
 *
 * Uses the browser's local timezone so that the resulting string matches
 * the Frappe server's naive-datetime convention.  DST transitions and
 * date-boundary rollovers are handled automatically.
 *
 * @param date - Date object to convert
 * @returns Formatted FrappeDateTimeString in local time
 */
export function dateToFrappeDateTimeString(date: Date): FrappeDateTimeString {
	const pad = (num: number): string => String(num).padStart(2, "0");

	const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

	return formatted as FrappeDateTimeString;
}
