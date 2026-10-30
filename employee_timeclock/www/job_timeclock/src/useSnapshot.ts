// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useEffect, useState } from "react";
import { kioskCall } from "../../../public/js/kiosk/call";
import { rememberServerTime } from "../../../public/js/kiosk/clock";
import { METHOD } from "./api";
import { loadSnapshot, saveSnapshot } from "./offlineData";
import type { OfflineSnapshot } from "./types";

/** How often a tablet online refreshes what it would show offline. */
export const SNAPSHOT_INTERVAL_MS = 10 * 60 * 1000;

/**
 * The work as last seen, kept for showing offline. Refreshed when the page loads, when the tablet
 * comes back online, and every ten minutes, whoever is or isn't signed in: the next thing that
 * happens may be the network going away. A refresh that fails just leaves the last one in place.
 */
export function useSnapshot(online: boolean): OfflineSnapshot | undefined {
	const [snapshot, setSnapshot] = useState<OfflineSnapshot>();

	useEffect(() => {
		let current = true;
		void loadSnapshot().then((kept) => {
			if (current && kept) setSnapshot((latest) => latest ?? kept);
		});
		return () => {
			current = false;
		};
	}, []);

	useEffect(() => {
		if (!online) return undefined;
		const refresh = async () => {
			try {
				const fresh = await kioskCall<OfflineSnapshot>(`${METHOD}.get_offline_snapshot`);
				rememberServerTime(fresh.server_time);
				await saveSnapshot(fresh);
				setSnapshot(fresh);
			} catch {
				// Kept as it was, until the next refresh.
			}
		};
		void refresh();
		const interval = window.setInterval(() => void refresh(), SNAPSHOT_INTERVAL_MS);
		return () => window.clearInterval(interval);
	}, [online]);

	return snapshot;
}
