// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/** An IndexedDB database of a kiosk page's own, for what it keeps while offline. */
export interface OfflineStore {
	/** Run `work` in one transaction on `store`, and answer what its last request returned. */
	run: <T>(
		store: string,
		mode: IDBTransactionMode,
		work: (store: IDBObjectStore) => IDBRequest<T>,
	) => Promise<T>;
}

/**
 * Opens `database` for each transaction, as a kiosk page can sit open for days and an open
 * connection would block a later version. Its stores are keyed on `id`, and what they hold
 * survives the app being closed and the tablet restarting.
 */
export function offlineStore(database: string, stores: string[]): OfflineStore {
	function open(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(database, 1);
			request.addEventListener("upgradeneeded", () => {
				for (const store of stores) request.result.createObjectStore(store, { keyPath: "id" });
			});
			request.addEventListener("success", () => resolve(request.result));
			request.addEventListener("error", () => reject(request.error));
		});
	}

	return {
		async run(store, mode, work) {
			const connection = await open();
			return new Promise((resolve, reject) => {
				const transaction = connection.transaction(store, mode);
				const request = work(transaction.objectStore(store));
				transaction.addEventListener("complete", () => {
					connection.close();
					resolve(request.result);
				});
				transaction.addEventListener("error", () => {
					connection.close();
					reject(transaction.error);
				});
			});
		},
	};
}
