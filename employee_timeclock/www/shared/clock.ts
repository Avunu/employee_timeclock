// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/**
 * The server's clock, as the tablet keeps track of it. Every punch and sync answer carries the
 * server's time; the gap between it and the tablet's clock is kept, so a punch made offline is
 * stamped with the server's time, right even when the tablet's clock drifts or is in the wrong
 * time zone.
 */

const OFFSET_KEY = "employee-timeclock-kiosk:clock-offset";

const SERVER_TIME = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

const pad = (value: number): string => String(value).padStart(2, "0");

/** Remember how far the server's clock (`YYYY-MM-DD HH:MM:SS`) is from the tablet's. */
export function rememberServerTime(serverTime: string, deviceNow: number = Date.now()): void {
	const parts = SERVER_TIME.exec(serverTime);
	if (!parts) return;
	const [year, month, day, hours, minutes, seconds] = parts.slice(1).map(Number) as [
		number,
		number,
		number,
		number,
		number,
		number,
	];
	// Read as if it were the tablet's local time: the offset then also covers a time zone mismatch.
	const server = new Date(year, month - 1, day, hours, minutes, seconds).getTime();
	window.localStorage.setItem(OFFSET_KEY, String(server - deviceNow));
}

/** The server's time now, as the milliseconds a Date read from its local time would hold. */
export function serverMillis(deviceNow: number = Date.now()): number {
	const offset = Number(window.localStorage.getItem(OFFSET_KEY));
	return deviceNow + (Number.isFinite(offset) ? offset : 0);
}

/** The server's time now, as `YYYY-MM-DD HH:MM:SS`, by the tablet's clock and the kept offset. */
export function serverNow(deviceNow: number = Date.now()): string {
	const at = new Date(serverMillis(deviceNow));
	return (
		`${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())} ` +
		`${pad(at.getHours())}:${pad(at.getMinutes())}:${pad(at.getSeconds())}`
	);
}
