// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { offlineStore } from "../../../public/js/kiosk/offlineStore";
import type { ActiveTimer, OfflineSnapshot } from "./types";

/**
 * What the tablet keeps so the tracker works offline, in IndexedDB: the timer events waiting to be
 * sent (useTimerSync.ts), the last snapshot of the work, and the employees it has seen.
 */

/** A timer action waiting to be sent, as sync_timer_events takes it. */
export interface TimerEvent {
	/** Its own id, so the server records it once however often it is sent. */
	id: string;
	action: "start" | "stop" | "stop_machine";
	/** The badge it was made under; none for an employee signed in with their own login. */
	badge?: string;
	work_order?: string;
	operation?: string;
	/** On the server's clock (clock.ts): `YYYY-MM-DD HH:MM:SS`. */
	time: string;
	/** The tablet's clock in ms: what orders two events in the same second. */
	order: number;
	is_corrective?: boolean;
	/** Whose event it is on this tablet (EmployeeRecord's id), and what replay.ts needs to show
	 * it. The server ignores both. */
	who: string;
	machine_group?: string;
}

/** An employee this tablet has seen, keyed by the hash of their badge or SESSION_KEY. */
export interface EmployeeRecord {
	id: string;
	employee_id: string;
	employee_name: string;
	employee_groups: string[];
	active_timer: ActiveTimer | null;
}

/** The record of the employee signed in with their own login. */
export const SESSION_KEY = "session";

const EVENTS = "events";
const SNAPSHOT = "snapshot";
const EMPLOYEES = "employees";
const LATEST = "latest";

const database = offlineStore("employee-timeclock-jobs", [EVENTS, SNAPSHOT, EMPLOYEES]);

/** Keep an event until it is synced. */
export async function queueEvent(event: TimerEvent): Promise<void> {
	await database.run(EVENTS, "readwrite", (store) => store.add(event));
}

/** Every event waiting to be sent, oldest first. */
export async function queuedEvents(): Promise<TimerEvent[]> {
	const events = await database.run<TimerEvent[]>(EVENTS, "readonly", (store) => store.getAll());
	return events.sort((a, b) => a.time.localeCompare(b.time) || a.order - b.order);
}

/** Drop events the server has dealt with. */
export async function forgetEvents(ids: string[]): Promise<void> {
	await database.run(EVENTS, "readwrite", (store) => {
		for (const id of ids) store.delete(id);
		return store.count();
	});
}

export async function saveSnapshot(snapshot: OfflineSnapshot): Promise<void> {
	await database.run(SNAPSHOT, "readwrite", (store) => store.put({ ...snapshot, id: LATEST }));
}

export function loadSnapshot(): Promise<OfflineSnapshot | undefined> {
	return database.run<OfflineSnapshot | undefined>(SNAPSHOT, "readonly", (store) => store.get(LATEST));
}

export async function rememberEmployee(record: EmployeeRecord): Promise<void> {
	await database.run(EMPLOYEES, "readwrite", (store) => store.put(record));
}

export function recallEmployee(key: string): Promise<EmployeeRecord | undefined> {
	return database.run<EmployeeRecord | undefined>(EMPLOYEES, "readonly", (store) => store.get(key));
}

/** The key a badge is remembered under: the badge itself stays out of what is kept for good. */
export async function badgeKey(badge: string): Promise<string> {
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(badge));
	return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
