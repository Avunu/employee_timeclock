// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/** A value kept in localStorage as JSON, or `fallback` if there is none, or it can't be read. */
export function readStored<T>(key: string, fallback: T): T {
	try {
		const kept = window.localStorage.getItem(key);
		// What this page wrote itself.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion
		return kept === null ? fallback : (JSON.parse(kept) as T);
	} catch {
		return fallback;
	}
}

export function writeStored(key: string, value: unknown): void {
	window.localStorage.setItem(key, JSON.stringify(value));
}
