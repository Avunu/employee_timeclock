// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useState } from "react";
import { KioskCallError, kioskCall } from "./call";
import { useSession } from "./session";
import { useToasts } from "./Toasts";

/** A call's answer, or that it failed: `offline` when it never reached the server. */
export type BackendResult<T> = { ok: true; data: T } | { ok: false; offline: boolean; status?: number };

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
 *
 * `quiet` lists statuses the caller handles itself, with no toast: the failed
 * result carries the status.
 */
export function useKioskRequest() {
	const { recordActivity, reportForbidden } = useSession();
	const showToast = useToasts();

	return useCallback(
		async function request<T>(
			method: string,
			params: Record<string, unknown>,
			errorTitle: string,
			quiet: readonly number[] = [],
		): Promise<BackendResult<T>> {
			try {
				const data = await kioskCall<T>(method, params);
				recordActivity();
				return { ok: true, data };
			} catch (error) {
				if (error instanceof TypeError) return { ok: false, offline: true };
				const status = error instanceof KioskCallError ? error.status : undefined;
				if (status === 403) reportForbidden();
				else if (!quiet.includes(status ?? 0)) {
					showToast({ kind: "error", title: getErrorMessage(error, errorTitle) });
				}
				return { ok: false, offline: false, ...(status !== undefined && { status }) };
			}
		},
		[recordActivity, reportForbidden, showToast],
	);
}

/** useKioskRequest for one method, keeping track of whether it is running. */
export function useBackendCall<T>(method: string, errorTitle: string) {
	const [loading, setLoading] = useState(false);
	const request = useKioskRequest();

	const run = useCallback(
		async (params: Record<string, unknown> = {}): Promise<BackendResult<T>> => {
			setLoading(true);
			try {
				return await request<T>(method, params, errorTitle);
			} finally {
				setLoading(false);
			}
		},
		[method, errorTitle, request],
	);

	return { call: run, loading };
}
