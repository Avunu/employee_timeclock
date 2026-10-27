// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

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

const DATABASE = "employee-timeclock-kiosk";
const STORE = "punches";

function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DATABASE, 1);
		request.addEventListener("upgradeneeded", () =>
			request.result.createObjectStore(STORE, { keyPath: "id" }),
		);
		request.addEventListener("success", () => resolve(request.result));
		request.addEventListener("error", () => reject(request.error));
	});
}

/** Run `work` in one transaction on the store, and answer what its last request returned. */
async function inStore<T>(
	mode: IDBTransactionMode,
	work: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
	const database = await openDatabase();
	return new Promise((resolve, reject) => {
		const transaction = database.transaction(STORE, mode);
		const request = work(transaction.objectStore(STORE));
		transaction.addEventListener("complete", () => {
			database.close();
			resolve(request.result);
		});
		transaction.addEventListener("error", () => {
			database.close();
			reject(transaction.error);
		});
	});
}

/** Keep a punch until it is synced. */
export async function queuePunch(punch: QueuedPunch): Promise<void> {
	await inStore("readwrite", (store) => store.add(punch));
}

/** Every punch waiting to be sent, oldest first. */
export async function queuedPunches(): Promise<QueuedPunch[]> {
	const punches = await inStore<QueuedPunch[]>("readonly", (store) => store.getAll());
	return punches.sort((a, b) => a.time.localeCompare(b.time));
}

/** Drop punches the server has dealt with. */
export async function forgetPunches(ids: string[]): Promise<void> {
	await inStore("readwrite", (store) => {
		for (const id of ids) store.delete(id);
		return store.count();
	});
}
