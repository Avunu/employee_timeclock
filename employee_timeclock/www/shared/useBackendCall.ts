// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useContext, useState } from "react";
import { type FrappeConfig, FrappeContext, type FrappeError } from "frappe-react-sdk";
import { useSession } from "./session";
import { useToasts } from "./Toasts";

/** A call's answer, or that it failed: `offline` when it never reached the server. */
export type BackendResult<T> = { ok: true; data: T } | { ok: false; offline: boolean; status?: number };

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

/** JSON.parse that answers undefined for text that isn't JSON. */
function parseJson(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
}

/** The status of what the SDK threw: 0 when there was no response at all. */
export function failedStatus(error: unknown): number {
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	return (error as FrappeError).httpStatus;
}

/**
 * The text of a failed call: frappe.throw()'s message is in `_server_messages`, a JSON list of
 * JSON-encoded `{message}` objects that may hold HTML. The SDK's own `message` is generic.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
	const raw = isRecord(error) ? error["_server_messages"] : undefined;
	const entries = typeof raw === "string" ? parseJson(raw) : undefined;
	if (!Array.isArray(entries)) return fallback;
	const messages = entries.map((entry: unknown) => {
		const parsed = typeof entry === "string" ? parseJson(entry) : undefined;
		return isRecord(parsed) && typeof parsed["message"] === "string" ? parsed["message"] : "";
	});
	return new DOMParser().parseFromString(messages.join(" "), "text/html").body.textContent.trim() || fallback;
}

/** The SDK's client. Every kiosk page mounts inside FrappeProvider (mount.tsx). */
function useFrappe(): FrappeConfig {
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	return useContext(FrappeContext) as FrappeConfig;
}

export const useFrappeCall = (): FrappeConfig["call"] => useFrappe().call;

/** The realtime socket, on a page mounted with `realtime`. */
export const useFrappeSocket = (): FrappeConfig["socket"] => useFrappe().socket;

/**
 * The SDK's POST plus the plumbing every kiosk call site needs: restarts the session timer on
 * success, reloads the page on a 403 (see SessionProvider), and shows any other answer from the
 * server as an error toast. A call that never reached the server gets no toast: it comes back
 * `offline`, for the caller to keep for later. Callers get a result instead of an exception, so a
 * fire-and-forget call can't leak an unhandled rejection.
 *
 * `quiet` lists statuses the caller handles itself, with no toast.
 */
export function useKioskRequest() {
	const call = useFrappeCall();
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
				const { message } = await call.post<{ message: T }>(method, params);
				recordActivity();
				return { ok: true, data: message };
			} catch (error) {
				const status = failedStatus(error);
				if (status === 0) return { ok: false, offline: true };
				if (status === 403) reportForbidden();
				else if (!quiet.includes(status)) {
					showToast({ kind: "error", title: getErrorMessage(error, errorTitle) });
				}
				return { ok: false, offline: false, status };
			}
		},
		[call, recordActivity, reportForbidden, showToast],
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
