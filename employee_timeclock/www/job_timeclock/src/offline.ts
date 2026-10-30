// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { offlineStore, useQueueSync } from "../../../public/js/kiosk/useQueueSync";
import type { ActiveTimer, MachineTimer, OfflineSnapshot, SyncTimerEventsResponse } from "./types";
import { useCallback, useEffect, useState } from "react";
import { rememberServerTime } from "../../../public/js/kiosk/clock";
import { useFrappeCall } from "../../../public/js/kiosk/useBackendCall";
import { useFrappeGetCall } from "frappe-react-sdk";

/** Where the tracker's backend lives. */
export const METHOD = "employee_timeclock.www.job_timeclock.job_timeclock";

/**
 * What the tablet keeps so the tracker works offline, in IndexedDB: the timer events waiting to be
 * sent (useTimerSync), the last snapshot of the work, and the employees it has seen.
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
	/** Whose event it is on this tablet (EmployeeRecord's id), and what replay needs to show
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

export interface TimerState {
	activeTimer: ActiveTimer | null;
	machineTimers: MachineTimer[];
}

const sameTimer = (timer: MachineTimer, workOrder?: string, operation?: string): boolean =>
	timer.work_order === workOrder && timer.operation === operation;

/**
 * What the screen shows: the last state the server gave, with the events still waiting on the
 * tablet applied on top, the way the server will apply them at sync. `who` is the employee at the
 * tablet: other employees' events change only the machine timers, which everyone shares.
 */
export function replay(state: TimerState, events: TimerEvent[], who: string): TimerState {
	let { activeTimer, machineTimers } = state;
	for (const event of events) {
		const { action, work_order: workOrder = "", operation = "" } = event;
		if (action === "stop_machine") {
			machineTimers = machineTimers.filter((timer) => !sameTimer(timer, workOrder, operation));
		} else if (action === "start" && event.machine_group !== undefined) {
			// Starting a machine timer closes whatever ran on that operation, on any work order.
			machineTimers = [
				...machineTimers.filter((timer) => timer.operation !== operation),
				{
					work_order: workOrder,
					operation,
					from_time: event.time,
					employee_group: event.machine_group,
					is_corrective: Boolean(event.is_corrective),
				},
			];
		} else if (event.who === who) {
			// A start closes the employee's previous timer, as the server does.
			activeTimer =
				action === "start"
					? {
							work_order: workOrder,
							operation,
							from_time: event.time,
							is_corrective: Boolean(event.is_corrective),
						}
					: null;
		}
	}
	return { activeTimer, machineTimers };
}

/** Events per sync_timer_events call: the server takes at most 100. */
const BATCH = 100;

/** Sends the timer events queued on the tablet, and holds them for replay to show until then. */
export function useTimerSync() {
	const call = useFrappeCall();
	const [events, setEvents] = useState<TimerEvent[]>([]);

	const pending = useCallback(async () => {
		const queued = await queuedEvents();
		setEvents(queued);
		return queued;
	}, []);

	// One batch at a time, oldest first. Every event the server has dealt with, recorded or not,
	// leaves the queue: one it refused is in its Error Log for HR.
	const send = useCallback(
		async (queued: TimerEvent[]) => {
			/* oxlint-disable no-await-in-loop -- in order, on purpose */
			for (let start = 0; start === 0 || start < queued.length; start += BATCH) {
				const { message } = await call.post<{ message: SyncTimerEventsResponse }>(
					`${METHOD}.sync_timer_events`,
					{ events: queued.slice(start, start + BATCH) },
				);
				rememberServerTime(message.server_time);
				await forgetEvents(message.results.map((result) => result.id));
			}
			/* oxlint-enable no-await-in-loop */
		},
		[call],
	);

	const { online, waiting, sync, kept } = useQueueSync({ pending, send });

	const keep = useCallback(
		async (event: TimerEvent) => {
			await queueEvent(event);
			await kept();
			if (navigator.onLine) await sync();
		},
		[kept, sync],
	);

	return { online, waiting, events, keep };
}

/** How often a tablet online refreshes what it would show offline. */
const SNAPSHOT_INTERVAL_MS = 10 * 60 * 1000;

/**
 * Every open work order and its operations, for whoever signs in, and for showing offline. It is
 * fetched with nobody signed in too: the next thing that happens may be the network going away.
 * The copy kept in IndexedDB shows until the first answer, and for as long as there isn't one.
 */
export function useSnapshot() {
	const [kept, setKept] = useState<OfflineSnapshot>();

	useEffect(() => {
		void loadSnapshot().then(setKept);
	}, []);

	const { data, mutate } = useFrappeGetCall<{ message: OfflineSnapshot }>(
		`${METHOD}.get_offline_snapshot`,
		undefined,
		"offline-snapshot",
		{
			isPaused: () => !navigator.onLine,
			refreshInterval: SNAPSHOT_INTERVAL_MS,
			shouldRetryOnError: false,
			onSuccess: ({ message }) => {
				rememberServerTime(message.server_time);
				void saveSnapshot(message);
			},
		},
	);

	return { snapshot: data?.message ?? kept, refreshSnapshot: mutate };
}
