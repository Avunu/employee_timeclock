// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { offlineStore, useQueueSync } from "../../shared/useQueueSync";
import { useCallback } from "react";
import { rememberServerTime } from "../../shared/clock";
import { useFrappeCall } from "../../shared/useBackendCall";

/**
 * The punches the tablet couldn't send, kept in IndexedDB until they are synced
 * (usePunchSync.ts). They survive the app being closed and the tablet restarting.
 */

/** A punch waiting to be sent, as employee_timeclock.www.timeclock.sync_punches takes it. */
export interface QueuedPunch {
	/** The kiosk's id for the punch, so the server records it once however often it is sent. */
	id: string;
	badge: string;
	/** When it was scanned, on the server's clock (clock.ts): `YYYY-MM-DD HH:MM:SS`. */
	time: string;
	/** A forgotten punch's IN or OUT, entered by hand. */
	log_type?: "IN" | "OUT";
	manual?: 1;
}

const STORE = "punches";

const database = offlineStore("employee-timeclock-kiosk", [STORE]);

/** Keep a punch until it is synced. */
export async function queuePunch(punch: QueuedPunch): Promise<void> {
	await database.run(STORE, "readwrite", (store) => store.add(punch));
}

/** Every punch waiting to be sent, oldest first. */
export async function queuedPunches(): Promise<QueuedPunch[]> {
	const punches = await database.run<QueuedPunch[]>(STORE, "readonly", (store) => store.getAll());
	return punches.sort((a, b) => a.time.localeCompare(b.time));
}

/** Drop punches the server has dealt with. */
export async function forgetPunches(ids: string[]): Promise<void> {
	await database.run(STORE, "readwrite", (store) => {
		for (const id of ids) store.delete(id);
		return store.count();
	});
}

/** Punches per sync_punches call: the server takes at most 100. */
const BATCH = 100;

const SYNC = "employee_timeclock.www.timeclock.sync_punches";

/** What employee_timeclock.www.timeclock.sync_punches answers. */
interface SyncAnswer {
	results: { id: string; status: "recorded" | "duplicate" | "rejected" }[];
	server_time: string;
}

export interface PunchSync {
	/** Whether the server could be reached the last time the kiosk tried. */
	online: boolean;
	/** Punches kept on the tablet, waiting to be sent. */
	waiting: number;
	/** Keep a punch the kiosk couldn't send, to go with the next sync. */
	keep: (punch: QueuedPunch) => Promise<void>;
}

/** Sends the punches queued while the tablet was offline (below) to sync_punches. */
export function usePunchSync(): PunchSync {
	const call = useFrappeCall();

	// One batch at a time, oldest first, so the server pairs each employee's punches in the order
	// they came. Every punch the server has dealt with, recorded or not, leaves the queue.
	const send = useCallback(
		async (punches: QueuedPunch[]) => {
			/* oxlint-disable no-await-in-loop -- in order, on purpose */
			for (let start = 0; start === 0 || start < punches.length; start += BATCH) {
				const { message } = await call.post<{ message: SyncAnswer }>(SYNC, {
					punches: punches.slice(start, start + BATCH),
				});
				rememberServerTime(message.server_time);
				await forgetPunches(message.results.map((result) => result.id));
			}
			/* oxlint-enable no-await-in-loop */
		},
		[call],
	);

	const { online, waiting, kept } = useQueueSync({ pending: queuedPunches, send });

	const keep = useCallback(
		async (punch: QueuedPunch) => {
			await queuePunch(punch);
			await kept();
		},
		[kept],
	);

	return { online, waiting, keep };
}
