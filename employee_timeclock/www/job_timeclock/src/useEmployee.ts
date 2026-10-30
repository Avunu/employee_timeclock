// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useToasts } from "../../../public/js/kiosk/Toasts";
import { type BackendResult, useKioskRequest } from "../../../public/js/kiosk/useBackendCall";
import { METHOD } from "./api";
import { badgeKey, recallEmployee, SESSION_KEY } from "./offlineData";
import type { ActiveTimer, AuthenticateEmployeeResponse, UserSessionEmployee } from "./types";

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
	const [wakes, setWakes] = useState(0);
	const token = useRef<string | null>(null);

	const signOut = useCallback(() => {
		token.current = null;
		setEmployee(null);
		setExpiry(0);
	}, []);

	const takeToken = useCallback((value: string): TokenClaims => {
		token.current = value;
		const claims = jwtDecode<TokenClaims>(value);
		setExpiry(claims.exp * 1000);
		return claims;
	}, []);

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
			// The endpoints answer a dead token this way rather than with an error status.
			if (answer.data.status === "error") {
				signOut();
				return { ok: false, offline: false };
			}
			if (answer.data.token) takeToken(answer.data.token);
			return answer;
		},
		[kioskRequest, signOut, takeToken],
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

	/** Whether a call to the server can be made for this employee at all. */
	const canCall = useCallback(() => token.current !== null || employee?.key === SESSION_KEY, [employee]);

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
				setEmployee({ key: SESSION_KEY, id, name: name ?? "", groups: [] });
			} else if (!answer.ok && answer.offline && (await recallEmployee(SESSION_KEY))) {
				await signInOffline(SESSION_KEY);
			}
		})();
	}, [kioskRequest, signInOffline]);

	useEffect(() => {
		if (!expiry) return undefined;
		const timeout = window.setTimeout(signOut, expiry - Date.now());
		return () => window.clearTimeout(timeout);
	}, [expiry, signOut]);

	// A tablet asleep past the end of the sign-in may not have run the timeout above; one still
	// signed in has missed whatever happened in the meantime.
	useEffect(() => {
		const onVisible = () => {
			if (document.visibilityState !== "visible") return;
			if (expiry && Date.now() >= expiry) signOut();
			else setWakes((count) => count + 1);
		};
		document.addEventListener("visibilitychange", onVisible);
		return () => document.removeEventListener("visibilitychange", onVisible);
	}, [expiry, signOut]);

	return { employee, expiry, wakes, request, scan, signOut, canCall, touch };
}
