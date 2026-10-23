// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useState } from "react";
import { KioskCallError, kioskCall } from "./call";
import { useSession } from "./session";
import { useToasts } from "./Toasts";

export type BackendResult<T> = { ok: true; data: T } | { ok: false };

/**
 * The human-readable text of a failed call. kioskCall already reads
 * frappe.throw()'s message out of `_server_messages` into the error; with no
 * HTTP response at all (offline, the server down) fetch throws a TypeError,
 * which gets a message of our own.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof KioskCallError) return error.message || fallback;
	if (error instanceof TypeError) return "Couldn't reach the server. Check the tablet's connection.";
	return fallback;
}

/**
 * kioskCall plus the plumbing every kiosk call site needs: restarts the
 * session timer on success, reloads the page on a 403 (see SessionProvider),
 * and shows any other failure as an error toast. Callers get a result instead
 * of an exception, so a fire-and-forget call can't leak an unhandled rejection.
 */
export function useBackendCall<T>(method: string, errorTitle: string) {
	const [loading, setLoading] = useState(false);
	const { recordActivity, reportForbidden } = useSession();
	const showToast = useToasts();

	const run = useCallback(
		async (params: Record<string, unknown> = {}): Promise<BackendResult<T>> => {
			setLoading(true);
			try {
				const data = await kioskCall<T>(method, params);
				recordActivity();
				return { ok: true, data };
			} catch (error) {
				if (error instanceof KioskCallError && error.status === 403) {
					reportForbidden();
				} else {
					showToast({ kind: "error", title: getErrorMessage(error, errorTitle) });
				}
				return { ok: false };
			} finally {
				setLoading(false);
			}
		},
		[method, errorTitle, recordActivity, reportForbidden, showToast],
	);

	return { call: run, loading };
}
