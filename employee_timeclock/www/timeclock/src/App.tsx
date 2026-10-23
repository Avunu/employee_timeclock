// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@carbon/react";
import { Time } from "@carbon/react/icons";
import { KioskHeader } from "../../../public/js/kiosk/KioskHeader";
import { reloadPage } from "../../../public/js/kiosk/navigate";
import { useBackendCall } from "../../../public/js/kiosk/useBackendCall";
import { useKeyboardWedge } from "../../../public/js/kiosk/useKeyboardWedge";
import { Clock } from "./components/Clock";
import { ManualPunchModal } from "./components/ManualPunchModal";
import { PunchResult } from "./components/PunchResult";
import type { KioskPunch, ManualPunch } from "./types";

/** How long a punch's result stays up before the kiosk is ready for the next person. */
const RESULT_MS = 7000;

/** Reload hourly, so the kiosk session stays active and a stale page never lingers. */
const RELOAD_INTERVAL_MS = 60 * 60 * 1000;

/** The old Employee Clock-in/out web form, while the two are tried side by side. */
const OLD_TIMECLOCK = "/employee-timeclock?new=1";

export function App() {
	const { call: punch } = useBackendCall<KioskPunch>(
		"employee_timeclock.www.timeclock.punch",
		"The punch wasn't recorded. Please scan again.",
	);
	const [result, setResult] = useState<KioskPunch | null>(null);
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
			// While a forgotten punch is still being entered, a scan isn't the employee's to record yet.
			if (manualOpen && !armed) return;
			pendingScans.current.add(badge);
			try {
				const recorded = await punch(
					armed ? { badge, time: armed.time, log_type: armed.log_type } : { badge },
				);
				if (recorded.ok) {
					setResult(recorded.data);
					if (armed) closeManual();
				}
			} finally {
				pendingScans.current.delete(badge);
			}
		},
		[armed, manualOpen, punch, closeManual],
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
				<Button kind="ghost" href={OLD_TIMECLOCK}>
					Use old timeclock
				</Button>
			</KioskHeader>
			<main className="tc-kiosk">
				<Clock />
				{result ? (
					<PunchResult punch={result} />
				) : (
					<p className="tc-prompt">Scan your badge to clock in or out.</p>
				)}
				<Button kind="tertiary" size="xl" renderIcon={Time} onClick={() => setManualOpen(true)}>
					Forgot to punch?
				</Button>
			</main>
			{manualOpen && (
				<ManualPunchModal
					armed={armed}
					onArm={setArmed}
					onBack={() => setArmed(null)}
					onClose={closeManual}
				/>
			)}
		</>
	);
}
