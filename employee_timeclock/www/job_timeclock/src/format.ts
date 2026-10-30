// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { serverMillis } from "../../../public/js/kiosk/clock";

/** Minutes as the tracker shows them: 45m, 2h, 2h 30m. */
export function formatMins(mins: number): string {
	if (mins <= 0) return "0m";
	const hours = Math.floor(mins / 60);
	const minutes = Math.round(mins % 60);
	if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
	if (hours > 0) return `${hours}h`;
	return `${minutes}m`;
}

const pad = (value: number): string => String(value).padStart(2, "0");

/** How long ago a server time was (`YYYY-MM-DD HH:MM:SS`, with or without a `T`), as HH:MM:SS. */
export function elapsedSince(serverTime: string, deviceNow: number): string {
	const started = new Date(serverTime.replace(" ", "T")).getTime();
	const seconds = Math.max(0, Math.floor((serverMillis(deviceNow) - started) / 1000));
	return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
}
