// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useEffect, useState } from "react";
import {
	DatePicker,
	DatePickerInput,
	InlineNotification,
	Modal,
	RadioButton,
	RadioButtonGroup,
} from "@carbon/react";
import type { LogType, ManualPunch } from "../types";
import { TimeSpinner } from "./TimeSpinner";

/** A forgotten punch nobody finishes is dropped after this long, so the next person's scan is
 * an ordinary punch again. */
const IDLE_MS = 2 * 60 * 1000;

const pad = (value: number): string => String(value).padStart(2, "0");

/** The entered day and time, in minutes since midnight, as one Date. */
function enteredAt(day: Date, minutes: number): Date {
	const at = new Date(day);
	at.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
	return at;
}

function minutesNow(): number {
	const now = new Date();
	return now.getHours() * 60 + now.getMinutes();
}

function toManualPunch(at: Date, logType: LogType): ManualPunch {
	const date = `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}`;
	const time = `${pad(at.getHours())}:${pad(at.getMinutes())}:00`;
	const label = `${at.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}, ${at.toLocaleDateString(
		[],
		{ weekday: "short", month: "short", day: "numeric" },
	)}`;
	return { time: `${date} ${time}`, log_type: logType, label };
}

function startOfToday(): Date {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
}

interface ManualPunchModalProps {
	/** The punch the form holds, once its time and IN/OUT are filled in; null until then. */
	onArm: (punch: ManualPunch | null) => void;
	onClose: () => void;
}

/**
 * A punch the employee forgot: they enter its date, time and IN/OUT, then scan their badge to
 * record it. The scan itself is handled by App, which sends the punch this form last armed along
 * with the badge. Mounted fresh each time it opens, so it always starts on today and the time now.
 */
export function ManualPunchModal({ onArm, onClose }: ManualPunchModalProps) {
	const [day, setDay] = useState(startOfToday);
	// Minutes since midnight, starting at the time now: a forgotten punch is stepped back from it.
	const [time, setTime] = useState(minutesNow);
	const [logType, setLogType] = useState<LogType | null>(null);

	// Restarted by every change, so it only runs out while nobody is using the form.
	useEffect(() => {
		const timeout = window.setTimeout(onClose, IDLE_MS);
		return () => window.clearTimeout(timeout);
	}, [day, time, logType, onClose]);

	const at = enteredAt(day, time);
	const inFuture = at.getTime() > Date.now();
	// The punch a scan records, once the form holds one.
	const entered = !inFuture && logType ? toManualPunch(at, logType) : null;

	// Keyed on what the punch is, as `entered` is a new object every render.
	const armedTime = entered?.time;
	const armedLabel = entered?.label;
	useEffect(() => {
		onArm(
			armedTime && armedLabel && logType ? { time: armedTime, log_type: logType, label: armedLabel } : null,
		);
	}, [armedTime, armedLabel, logType, onArm]);

	return (
		<Modal
			open
			passiveModal
			size="sm"
			modalHeading="Forgot to punch?"
			onRequestClose={onClose}
			preventCloseOnClickOutside
		>
			<div className="tc-manual">
				<DatePicker
					datePickerType="single"
					dateFormat="m/d/Y"
					maxDate={new Date().toLocaleDateString("en-US")}
					value={day}
					onChange={([picked]) => {
						if (picked) setDay(picked);
					}}
				>
					<DatePickerInput id="tc-manual-date" labelText="Date" placeholder="mm/dd/yyyy" />
				</DatePicker>
				<TimeSpinner value={time} onChange={setTime} />
				{inFuture && (
					<InlineNotification
						kind="error"
						lowContrast
						hideCloseButton
						title="That time hasn't happened yet."
					/>
				)}
				<RadioButtonGroup
					legendText="Clock in or out"
					name="tc-manual-log-type"
					valueSelected={logType ?? ""}
					onChange={(value) => setLogType(value === "OUT" ? "OUT" : "IN")}
				>
					<RadioButton id="tc-manual-in" labelText="Clock in" value="IN" />
					<RadioButton id="tc-manual-out" labelText="Clock out" value="OUT" />
				</RadioButtonGroup>
				<p className="tc-manual-armed" role="status">
					{entered
						? `Scan your badge to ${entered.log_type === "IN" ? "clock in" : "clock out"} at ${entered.label}.`
						: "Enter the time and choose clock in or out, then scan your badge."}
				</p>
			</div>
		</Modal>
	);
}
