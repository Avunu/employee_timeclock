// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useToasts } from "../../../public/js/kiosk/Toasts";
import {
	failedStatus,
	getErrorMessage,
	type BackendResult,
	useKioskRequest,
} from "../../../public/js/kiosk/useBackendCall";
import { METHOD, SESSION_KEY, badgeKey, recallEmployee } from "./offline";
import type { ActiveTimer, AuthenticateEmployeeResponse, UserSessionEmployee } from "./types";
import { useFrappeGetCall } from "frappe-react-sdk";
import { useSession } from "../../../public/js/kiosk/session";

/** How long a badge sign-in lasts on a tablet with no server to refresh its token: the token's own
 * 30 minutes, from the last thing the employee did. */
export const OFFLINE_SESSION_MS = 30 * 60 * 1000;

export interface Employee {
	/** Whose work this is on this tablet: their badge's hash, or SESSION_KEY. */
	key: string;
	/** Their Employee, unless an unseen badge was scanned offline. */
	id: string | null;
	/** Their name, or null for an unseen badge the server hasn't confirmed yet. */
	name: string | null;
	/** The scanned badge, for queued events; none for an employee's own login. */
	badge?: string;
	/** Their Employee Groups, as far as this tablet knows. */
	groups: string[];
	/** Their running timer when they were last seen: only set when signed in offline. */
	lastTimer?: ActiveTimer | null;
}

export type TrackerRequest = <T extends object>(
	method: string,
	params: Record<string, unknown>,
	errorTitle: string,
) => Promise<BackendResult<T>>;

/** What useTrackerData needs from the sign-in: reading tokens, and taking what answers say. */
export interface TrackerSession {
	token: () => string | null;
	/** Whether a call to the server can be made for this employee at all. */
	canCall: () => boolean;
	/** Take a new token from an answer; an answer of "error" means the server no longer takes it. */
	accept: (answer: { status?: string; token?: string | null }) => boolean;
	signOut: () => void;
}

interface TokenClaims {
	exp: number;
	employee_id: string;
	employee_name: string;
}

/**
 * Who is at the tablet, and the call every tracker request goes through.
 *
 * A signed-in employee of the page's own user needs nothing more; at a kiosk, a badge scan gets a
 * short token that each answer refreshes, kept in memory only. When the token's time runs out the
 * tablet goes back to waiting for a badge, and a scan always starts over as whoever scanned.
 *
 * Offline the badge can't be checked, so a scan is taken on trust: the tablet shows the employee
 * it remembers for that badge, if any, and the server checks the badge when the events sync.
 */
export function useEmployee() {
	const kioskRequest = useKioskRequest();
	const showToast = useToasts();
	const [employee, setEmployee] = useState<Employee | null>(null);
	// When the sign-in runs out, in ms; 0 for an employee's own login, which has no end.
	const [expiry, setExpiry] = useState(0);
	const token = useRef<string | null>(null);
	const ownLogin = useRef(false);

	const canCall = useCallback(() => token.current !== null || ownLogin.current, []);

	const signOut = useCallback(() => {
		token.current = null;
		ownLogin.current = false;
		setEmployee(null);
		setExpiry(0);
	}, []);

	const takeToken = useCallback((value: string): TokenClaims => {
		token.current = value;
		const claims = jwtDecode<TokenClaims>(value);
		setExpiry(claims.exp * 1000);
		return claims;
	}, []);

	const accept = useCallback<TrackerSession["accept"]>(
		(answer) => {
			// The endpoints answer a dead token this way rather than with an error status.
			if (answer.status === "error") {
				signOut();
				return false;
			}
			if (answer.token) takeToken(answer.token);
			return true;
		},
		[signOut, takeToken],
	);

	const session = useMemo<TrackerSession>(
		() => ({ token: () => token.current, canCall, accept, signOut }),
		[canCall, accept, signOut],
	);

	const request = useCallback<TrackerRequest>(
		async <T extends object>(method: string, params: Record<string, unknown>, errorTitle: string) => {
			const answer = await kioskRequest<T & { token?: string | null; status?: string }>(
				`${METHOD}.${method}`,
				{ ...params, token: token.current },
				errorTitle,
				[401],
			);
			if (!answer.ok) {
				if (answer.status === 401) signOut();
				return answer;
			}
			return accept(answer.data) ? answer : { ok: false, offline: false };
		},
		[kioskRequest, accept, signOut],
	);

	const signInOffline = useCallback(async (key: string, badge?: string) => {
		const known = await recallEmployee(key);
		setEmployee({
			key,
			id: known?.employee_id ?? null,
			name: known?.employee_name ?? null,
			...(badge !== undefined && { badge }),
			groups: known?.employee_groups ?? [],
			lastTimer: known?.active_timer ?? null,
		});
		if (badge !== undefined) setExpiry(Date.now() + OFFLINE_SESSION_MS);
	}, []);

	const scan = useCallback(
		async (badge: string) => {
			signOut();
			const key = await badgeKey(badge);
			if (!navigator.onLine) {
				await signInOffline(key, badge);
				return;
			}
			const answer = await kioskRequest<AuthenticateEmployeeResponse>(
				`${METHOD}.authenticate_employee`,
				{ rfid: badge },
				"That badge couldn't be read. Please scan again.",
			);
			if (!answer.ok) {
				if (answer.offline) await signInOffline(key, badge);
			} else if (answer.data.token) {
				const claims = takeToken(answer.data.token);
				setEmployee({
					key,
					id: claims.employee_id,
					name: claims.employee_name,
					badge,
					groups: [],
				});
			} else {
				showToast({ kind: "error", title: answer.data.message ?? "Badge not recognised." });
			}
		},
		[kioskRequest, showToast, signInOffline, signOut, takeToken],
	);

	/** Keep an offline sign-in alive: each thing the employee does restarts its time. */
	const touch = useCallback(() => {
		if (token.current === null && employee?.badge !== undefined) {
			setExpiry(Date.now() + OFFLINE_SESSION_MS);
		}
	}, [employee]);

	// The page's own user may be an employee; if not, it waits for a badge.
	useEffect(() => {
		void (async () => {
			const answer = await kioskRequest<UserSessionEmployee>(
				`${METHOD}.get_user_session_employee`,
				{},
				"The tracker couldn't check who is signed in.",
			);
			if (answer.ok && answer.data.user_id !== "Guest" && answer.data.employee_id) {
				const { employee_id: id, employee_name: name } = answer.data;
				ownLogin.current = true;
				setEmployee({ key: SESSION_KEY, id, name: name ?? "", groups: [] });
			} else if (!answer.ok && answer.offline && (await recallEmployee(SESSION_KEY))) {
				ownLogin.current = true;
				await signInOffline(SESSION_KEY);
			}
		})();
	}, [kioskRequest, signInOffline]);

	useEffect(() => {
		if (!expiry) return undefined;
		const timeout = window.setTimeout(signOut, expiry - Date.now());
		return () => window.clearTimeout(timeout);
	}, [expiry, signOut]);

	return { employee, expiry, session, request, scan, signOut, canCall, touch };
}

interface TrackerAnswer {
	status?: string;
	token?: string | null;
}

/**
 * What one of the tracker's read methods answers, refetched when the page comes back into view.
 * `key` is the SDK's cache key: null fetches nothing. It is given rather than derived, as the
 * token in `params` changes with each answer. By POST, to keep the token out of URLs and logs.
 * With no way to reach the server, the last answer stays. SWR asks that before each fetch, of the
 * options it was last given, so it reads the state then rather than taking it as an option.
 */
export function useTrackerData<T extends TrackerAnswer>(
	session: TrackerSession,
	method: string,
	key: string | null,
	params: Record<string, unknown> = {},
) {
	const { recordActivity, reportForbidden } = useSession();
	const showToast = useToasts();

	return useFrappeGetCall<{ message: T }>(
		`${METHOD}.${method}`,
		{ ...params, token: session.token() },
		key,
		{
			isPaused: () => !navigator.onLine || !session.canCall(),
			shouldRetryOnError: false,
			onSuccess: ({ message }) => {
				recordActivity();
				session.accept(message);
			},
			onError: (error: unknown) => {
				const status = failedStatus(error);
				if (status === 401) session.signOut();
				else if (status === 403) reportForbidden();
				else if (status !== 0)
					showToast({ kind: "error", title: getErrorMessage(error, `${method} failed.`) });
			},
		},
		"POST",
	);
}
