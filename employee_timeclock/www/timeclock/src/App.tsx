// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@carbon/react";
import { Time } from "@carbon/react/icons";
import { rememberServerTime, serverNow } from "../../shared/clock";
import { KioskHeader } from "../../shared/KioskHeader";
import { KioskStatus } from "../../shared/KioskHeader";
import { reloadPage } from "../../shared/navigate";
import { useBackendCall } from "../../shared/useBackendCall";
import { useKeyboardWedge } from "../../shared/useKeyboardWedge";
import { usePunchSync } from "./usePunchSync";
import { Clock } from "./components/Clock";
import { ManualPunchModal } from "./components/ManualPunchModal";
import { PunchResult, SavedPunch } from "./components/PunchResult";
import type { KioskPunch, KioskPunchAnswer, ManualPunch } from "./types";

/** How long a punch's result stays up before the kiosk is ready for the next person. */
const RESULT_MS = 7000;

/** Reload hourly, so the kiosk session stays active and a stale page never lingers. */
const RELOAD_INTERVAL_MS = 60 * 60 * 1000;

/** The old Employee Clock-in/out web form, while the two are tried side by side. */
const OLD_TIMECLOCK = "/employee-timeclock?new=1";

export function App() {
	const { call: punch } = useBackendCall<KioskPunchAnswer>(
		"employee_timeclock.www.timeclock.punch",
		"The punch wasn't recorded. Please scan again.",
	);
	const { online, waiting, keep } = usePunchSync();
	// The punch just recorded, or "saved" for one kept on the tablet to send later.
	const [result, setResult] = useState<KioskPunch | "saved" | null>(null);
	const [manualOpen, setManualOpen] = useState(false);
	const [armed, setArmed] = useState<ManualPunch | null>(null);
	// A scanner that fires twice sends the same badge again before the first punch is saved.
	const pendingScans = useRef(new Set<string>());

	const closeManual = useCallback(() => {
		setManualOpen(false);
		setArmed(null);
	}, []);

	const recordScan = useCallback(
		async (badge: string) => {
			if (!badge || pendingScans.current.has(badge)) return;
			// While a forgotten punch is still being filled in, a scan has nothing to record yet.
			if (manualOpen && !armed) return;
			pendingScans.current.add(badge);
			// The punch's own id, so the server records it once however often it is sent; and the
			// time of the scan, should it have to wait on the tablet.
			const id = crypto.randomUUID();
			const time = armed ? armed.time : serverNow();
			const choice = armed ? { log_type: armed.log_type } : {};
			try {
				// Offline, there's no point waiting for the network to fail first.
				const recorded = navigator.onLine
					? await punch({ badge, punch_id: id, ...(armed && { time, ...choice }) })
					: ({ ok: false, offline: true } as const);
				if (recorded.ok) {
					rememberServerTime(recorded.data.server_time);
					setResult(recorded.data);
				} else if (recorded.offline) {
					await keep({ id, badge, time, ...choice, ...(armed && { manual: 1 as const }) });
					setResult("saved");
				}
				if (armed && (recorded.ok || recorded.offline)) closeManual();
			} finally {
				pendingScans.current.delete(badge);
			}
		},
		[armed, manualOpen, punch, keep, closeManual],
	);

	useKeyboardWedge((badge) => void recordScan(badge));

	useEffect(() => {
		if (!result) return undefined;
		const timeout = window.setTimeout(() => setResult(null), RESULT_MS);
		return () => window.clearTimeout(timeout);
	}, [result]);

	useEffect(() => {
		const interval = window.setInterval(reloadPage, RELOAD_INTERVAL_MS);
		return () => window.clearInterval(interval);
	}, []);

	return (
		<>
			<KioskHeader name="Timeclock">
				<KioskStatus online={online} waiting={waiting} />
				<Button kind="ghost" href={OLD_TIMECLOCK}>
					Use old timeclock
				</Button>
			</KioskHeader>
			<main className="tc-kiosk">
				<Clock />
				{result === "saved" ? (
					<SavedPunch />
				) : result ? (
					<PunchResult punch={result} />
				) : (
					<p className="tc-prompt">Scan your badge to clock in or out.</p>
				)}
				<Button kind="tertiary" size="xl" renderIcon={Time} onClick={() => setManualOpen(true)}>
					Forgot to punch?
				</Button>
			</main>
			{manualOpen && <ManualPunchModal onArm={setArmed} onClose={closeManual} />}
		</>
	);
}
