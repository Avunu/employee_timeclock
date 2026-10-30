// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useRef, useState } from "react";
import { KioskCallError } from "./call";
import { reloadPage } from "./navigate";
import { useSession } from "./session";

/** How often a kiosk sends what it has queued, and keeps its clock in step with the server's. */
export const SYNC_INTERVAL_MS = 60 * 1000;

interface QueueSyncOptions<T> {
	/** What is waiting to be sent, oldest first. */
	pending: () => Promise<T[]>;
	/** Send everything, and forget what the server dealt with. Throws what kioskCall throws. */
	send: (items: T[]) => Promise<void>;
}

export interface QueueSync {
	/** Whether the server could be reached the last time the kiosk tried. */
	online: boolean;
	/** Items kept on the tablet, waiting to be sent. */
	waiting: number;
	/** Send what is waiting now. */
	sync: () => Promise<void>;
	/** After keeping an item the server couldn't be reached for. */
	kept: () => Promise<void>;
}

/**
 * Sends what a kiosk queued while the tablet was offline: when the page loads, when the browser
 * comes back online, and every minute. Even with nothing queued it goes, as each answer keeps the
 * tablet's clock in step (clock.ts) and the session alive. `pending` and `send` must be stable.
 *
 * A 400 or 403 means the page's session or CSRF token is stale (the page was opened offline, from
 * the service worker's copy), so the page reloads for fresh ones.
 */
export function useQueueSync<T>({ pending, send }: QueueSyncOptions<T>): QueueSync {
	const [online, setOnline] = useState(() => navigator.onLine);
	const [waiting, setWaiting] = useState(0);
	const syncing = useRef(false);
	const { recordActivity } = useSession();

	const sync = useCallback(async () => {
		if (syncing.current) return;
		syncing.current = true;
		try {
			const items = await pending();
			setWaiting(items.length);
			await send(items);
			recordActivity();
			setOnline(true);
		} catch (error) {
			if (error instanceof KioskCallError && (error.status === 400 || error.status === 403)) reloadPage();
			else if (error instanceof TypeError) setOnline(false);
			// Anything else (the rate limit, a server error) is tried again at the next sync.
		} finally {
			setWaiting((await pending()).length);
			syncing.current = false;
		}
	}, [pending, send, recordActivity]);

	const kept = useCallback(async () => {
		setOnline(false);
		setWaiting((await pending()).length);
	}, [pending]);

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

	return { online, waiting, sync, kept };
}
