// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useEffect, useState } from "react";
import { useFrappeGetCall } from "frappe-react-sdk";
import { rememberServerTime } from "../../../public/js/kiosk/clock";
import { METHOD } from "./api";
import { loadSnapshot, saveSnapshot } from "./offlineData";
import type { OfflineSnapshot } from "./types";

/** How often a tablet online refreshes what it would show offline. */
const SNAPSHOT_INTERVAL_MS = 10 * 60 * 1000;

/**
 * Every open work order and its operations, for whoever signs in, and for showing offline. It is
 * fetched with nobody signed in too: the next thing that happens may be the network going away.
 * The copy kept in IndexedDB shows until the first answer, and for as long as there isn't one.
 */
export function useSnapshot() {
	const [kept, setKept] = useState<OfflineSnapshot>();

	useEffect(() => {
		void loadSnapshot().then(setKept);
	}, []);

	const { data, mutate } = useFrappeGetCall<{ message: OfflineSnapshot }>(
		`${METHOD}.get_offline_snapshot`,
		undefined,
		"offline-snapshot",
		{
			isPaused: () => !navigator.onLine,
			refreshInterval: SNAPSHOT_INTERVAL_MS,
			shouldRetryOnError: false,
			onSuccess: ({ message }) => {
				rememberServerTime(message.server_time);
				void saveSnapshot(message);
			},
		},
	);

	return { snapshot: data?.message ?? kept, refreshSnapshot: mutate };
}
