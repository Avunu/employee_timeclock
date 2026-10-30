// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { offlineStore } from "../../../public/js/kiosk/offlineStore";

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
