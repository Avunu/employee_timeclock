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
export type FrappeDateTimeString = string & { readonly __brand: 'FrappeDateTimeString' };

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
 * Adjusts for timezone offset (default -5 hours for EST)
 * 
 * @param date - Date object to convert
 * @param timezoneOffset - Hours to subtract from UTC (default: 5 for EST)
 * @returns Formatted FrappeDateTimeString
 */
export function dateToFrappeDateTimeString(date: Date, timezoneOffset: number = 5): FrappeDateTimeString {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // Months are zero-based
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  
  const pad = (num: number): string => (num < 10 ? '0' + num : num.toString());
  
  const formatted = `${year}-${pad(month)}-${pad(day)} ${pad(hour - timezoneOffset)}:${pad(minute)}:${pad(second)}`;
  
  return formatted as FrappeDateTimeString;
}
