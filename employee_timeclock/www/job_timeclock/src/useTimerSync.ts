// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useState } from "react";
import { rememberServerTime } from "../../../public/js/kiosk/clock";
import { useFrappeCall } from "../../../public/js/kiosk/useBackendCall";
import { useQueueSync } from "../../../public/js/kiosk/useQueueSync";
import { METHOD } from "./api";
import { forgetEvents, queuedEvents, queueEvent, type TimerEvent } from "./offlineData";
import type { SyncTimerEventsResponse } from "./types";

/** Events per sync_timer_events call: the server takes at most 100. */
const BATCH = 100;

/** Sends the timer events queued on the tablet, and holds them for replay.ts to show until then. */
export function useTimerSync() {
	const call = useFrappeCall();
	const [events, setEvents] = useState<TimerEvent[]>([]);

	const pending = useCallback(async () => {
		const queued = await queuedEvents();
		setEvents(queued);
		return queued;
	}, []);

	// One batch at a time, oldest first. Every event the server has dealt with, recorded or not,
	// leaves the queue: one it refused is in its Error Log for HR.
	const send = useCallback(
		async (queued: TimerEvent[]) => {
			/* oxlint-disable no-await-in-loop -- in order, on purpose */
			for (let start = 0; start === 0 || start < queued.length; start += BATCH) {
				const { message } = await call.post<{ message: SyncTimerEventsResponse }>(
					`${METHOD}.sync_timer_events`,
					{ events: queued.slice(start, start + BATCH) },
				);
				rememberServerTime(message.server_time);
				await forgetEvents(message.results.map((result) => result.id));
			}
			/* oxlint-enable no-await-in-loop */
		},
		[call],
	);

	const { online, waiting, sync, kept } = useQueueSync({ pending, send });

	const keep = useCallback(
		async (event: TimerEvent) => {
			await queueEvent(event);
			await kept();
			if (navigator.onLine) await sync();
		},
		[kept, sync],
	);

	return { online, waiting, events, keep };
}
