// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback } from "react";
import { rememberServerTime } from "../../../public/js/kiosk/clock";
import { useFrappeCall } from "../../../public/js/kiosk/useBackendCall";
import { useQueueSync } from "../../../public/js/kiosk/useQueueSync";
import { forgetPunches, type QueuedPunch, queuePunch, queuedPunches } from "./punchQueue";

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

/** Sends the punches queued while the tablet was offline (punchQueue.ts) to sync_punches. */
export function usePunchSync(): PunchSync {
	const call = useFrappeCall();

	// One batch at a time, oldest first, so the server pairs each employee's punches in the order
	// they came. Every punch the server has dealt with, recorded or not, leaves the queue.
	const send = useCallback(
		async (punches: QueuedPunch[]) => {
			/* oxlint-disable no-await-in-loop -- in order, on purpose */
			for (let start = 0; start === 0 || start < punches.length; start += BATCH) {
				const { message } = await call.post<{ message: SyncAnswer }>(SYNC, {
					punches: punches.slice(start, start + BATCH),
				});
				rememberServerTime(message.server_time);
				await forgetPunches(message.results.map((result) => result.id));
			}
			/* oxlint-enable no-await-in-loop */
		},
		[call],
	);

	const { online, waiting, kept } = useQueueSync({ pending: queuedPunches, send });

	const keep = useCallback(
		async (punch: QueuedPunch) => {
			await queuePunch(punch);
			await kept();
		},
		[kept],
	);

	return { online, waiting, keep };
}
