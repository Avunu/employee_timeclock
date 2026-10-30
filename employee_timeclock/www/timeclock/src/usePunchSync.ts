// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback } from "react";
import { kioskCall } from "../../../public/js/kiosk/call";
import { rememberServerTime } from "../../../public/js/kiosk/clock";
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

/** One batch at a time, oldest first, so the server pairs each employee's punches in the order
 * they came. Every punch the server has dealt with, recorded or not, leaves the queue. */
async function sendPunches(punches: QueuedPunch[]): Promise<void> {
	/* oxlint-disable no-await-in-loop -- in order, on purpose */
	for (let start = 0; start === 0 || start < punches.length; start += BATCH) {
		const answer = await kioskCall<SyncAnswer>(SYNC, { punches: punches.slice(start, start + BATCH) });
		rememberServerTime(answer.server_time);
		await forgetPunches(answer.results.map((result) => result.id));
	}
	/* oxlint-enable no-await-in-loop */
}

/** Sends the punches queued while the tablet was offline (punchQueue.ts) to sync_punches. */
export function usePunchSync(): PunchSync {
	const { online, waiting, kept } = useQueueSync({ pending: queuedPunches, send: sendPunches });

	const keep = useCallback(
		async (punch: QueuedPunch) => {
			await queuePunch(punch);
			await kept();
		},
		[kept],
	);

	return { online, waiting, keep };
}
