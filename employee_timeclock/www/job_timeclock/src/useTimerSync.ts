// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useState } from "react";
import { kioskCall } from "../../../public/js/kiosk/call";
import { rememberServerTime } from "../../../public/js/kiosk/clock";
import { useQueueSync } from "../../../public/js/kiosk/useQueueSync";
import { METHOD } from "./api";
import { forgetEvents, queuedEvents, queueEvent, type TimerEvent } from "./offlineData";
import type { SyncTimerEventsResponse } from "./types";

/** Events per sync_timer_events call: the server takes at most 100. */
const BATCH = 100;

/** One batch at a time, oldest first. Every event the server has dealt with, recorded or not,
 * leaves the queue: one it refused is in its Error Log for HR. */
async function sendEvents(events: TimerEvent[]): Promise<void> {
	/* oxlint-disable no-await-in-loop -- in order, on purpose */
	for (let start = 0; start === 0 || start < events.length; start += BATCH) {
		const answer = await kioskCall<SyncTimerEventsResponse>(`${METHOD}.sync_timer_events`, {
			events: events.slice(start, start + BATCH),
		});
		rememberServerTime(answer.server_time);
		await forgetEvents(answer.results.map((result) => result.id));
	}
	/* oxlint-enable no-await-in-loop */
}

/** Sends the timer events queued on the tablet, and holds them for replay.ts to show until then. */
export function useTimerSync() {
	const [events, setEvents] = useState<TimerEvent[]>([]);

	const pending = useCallback(async () => {
		const queued = await queuedEvents();
		setEvents(queued);
		return queued;
	}, []);

	const { online, waiting, sync, kept } = useQueueSync({ pending, send: sendEvents });

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
