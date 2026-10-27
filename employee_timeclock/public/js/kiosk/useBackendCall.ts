// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useState } from "react";
import { KioskCallError, kioskCall } from "./call";
import { useSession } from "./session";
import { useToasts } from "./Toasts";

/** A call's answer, or that it failed: `offline` when it never reached the server. */
export type BackendResult<T> = { ok: true; data: T } | { ok: false; offline: boolean };

/**
 * The human-readable text of a failed call: kioskCall has already read
 * frappe.throw()'s message out of `_server_messages` into the error.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof KioskCallError) return error.message || fallback;
	return fallback;
}

/**
 * kioskCall plus the plumbing every kiosk call site needs: restarts the
 * session timer on success, reloads the page on a 403 (see SessionProvider),
 * and shows any other answer from the server as an error toast. A call that
 * never reached the server (fetch's TypeError) gets no toast: it comes back
 * `offline`, for the caller to keep for later. Callers get a result instead
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
				const offline = error instanceof TypeError;
				if (error instanceof KioskCallError && error.status === 403) {
					reportForbidden();
				} else if (!offline) {
					showToast({ kind: "error", title: getErrorMessage(error, errorTitle) });
				}
				return { ok: false, offline };
			} finally {
				setLoading(false);
			}
		},
		[method, errorTitle, recordActivity, reportForbidden, showToast],
	);

	return { call: run, loading };
}
