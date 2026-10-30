// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useRef, useState } from "react";
import { KioskCallError, kioskCall } from "./call";
import { rememberServerTime } from "./clock";
import { reloadPage } from "./navigate";
import { forgetPunches, type QueuedPunch, queuePunch, queuedPunches } from "./punchQueue";
import { useSession } from "./session";

/** How often the kiosk sends what it has queued, and keeps its clock in step with the server's. */
export const SYNC_INTERVAL_MS = 60 * 1000;

/** Punches per sync_punches call: the server takes at most 100. */
const BATCH = 100;

const SYNC = "employee_timeclock.www.timeclock.sync_punches";

/** What employee_timeclock.www.timeclock.sync_punches answers. */
interface SyncAnswer {
	results: { id: string; status: "recorded" | "duplicate" | "rejected" }[];
	server_time: string;
}

export interface PunchSync {
	/** Whether the server could be reached the last time the kiosk tried. */
	online: boolean;
	/** Punches kept on the tablet, waiting to be sent. */
	waiting: number;
	/** Keep a punch the kiosk couldn't send, to go with the next sync. */
	keep: (punch: QueuedPunch) => Promise<void>;
}

/**
 * Sends the punches queued while the tablet was offline (punchQueue.ts) to sync_punches: when the
 * page loads, when the browser comes back online, and every minute. Every punch the server has
 * dealt with, recorded or not, leaves the queue; whatever didn't get through stays for next time.
 *
 * Each sync also keeps the tablet's clock in step (clock.ts) and the session alive. A 400 or 403
 * means the page's session or CSRF token is stale (the page was opened offline, from the service
 * worker's copy), so the page reloads for fresh ones.
 */
export function usePunchSync(): PunchSync {
	const [online, setOnline] = useState(() => navigator.onLine);
	const [waiting, setWaiting] = useState(0);
	const syncing = useRef(false);
	const { recordActivity } = useSession();

	const sync = useCallback(async () => {
		if (syncing.current) return;
		syncing.current = true;
		try {
			const punches = await queuedPunches();
			setWaiting(punches.length);
			// Even with nothing queued it goes: the answer keeps the clock in step. One batch at a
			// time, oldest first, so the server pairs each employee's punches in the order they came.
			/* oxlint-disable no-await-in-loop -- in order, on purpose */
			for (let start = 0; start === 0 || start < punches.length; start += BATCH) {
				const answer = await kioskCall<SyncAnswer>(SYNC, { punches: punches.slice(start, start + BATCH) });
				rememberServerTime(answer.server_time);
				await forgetPunches(answer.results.map((result) => result.id));
			}
			/* oxlint-enable no-await-in-loop */
			recordActivity();
			setOnline(true);
		} catch (error) {
			if (error instanceof KioskCallError && (error.status === 400 || error.status === 403)) reloadPage();
			else if (error instanceof TypeError) setOnline(false);
			// Anything else (the rate limit, a server error) is tried again at the next sync.
		} finally {
			setWaiting((await queuedPunches()).length);
			syncing.current = false;
		}
	}, [recordActivity]);

	const keep = useCallback(async (punch: QueuedPunch) => {
		await queuePunch(punch);
		setOnline(false);
		setWaiting((await queuedPunches()).length);
	}, []);

	useEffect(() => {
		void sync();
		const interval = window.setInterval(() => void sync(), SYNC_INTERVAL_MS);
		const reconnected = () => void sync();
		const disconnected = () => setOnline(false);
		window.addEventListener("online", reconnected);
		window.addEventListener("offline", disconnected);
		return () => {
			window.clearInterval(interval);
			window.removeEventListener("online", reconnected);
			window.removeEventListener("offline", disconnected);
		};
	}, [sync]);

	return { online, waiting, keep };
}
