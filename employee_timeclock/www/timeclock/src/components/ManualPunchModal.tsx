// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useEffect, useState } from "react";
import {
	DatePicker,
	DatePickerInput,
	Modal,
	RadioButton,
	RadioButtonGroup,
	SelectItem,
	TimePicker,
	TimePickerSelect,
} from "@carbon/react";
import type { LogType, ManualPunch } from "../types";

/** A forgotten punch nobody finishes is dropped after this long, so the next person's scan is
 * an ordinary punch again. */
const IDLE_MS = 2 * 60 * 1000;

/** h:mm on a 12-hour clock: 7:30, 07:30, 12:05. */
const TIME_TEXT = /^(1[0-2]|0?[1-9]):([0-5]\d)$/;

type Period = "AM" | "PM";

const pad = (value: number): string => String(value).padStart(2, "0");

/** The entered day and time as one Date, or null while the time isn't h:mm. */
function enteredAt(day: Date, text: string, period: Period): Date | null {
	const match = TIME_TEXT.exec(text.trim());
	if (!match) return null;
	const at = new Date(day);
	at.setHours((Number(match[1]) % 12) + (period === "PM" ? 12 : 0), Number(match[2]), 0, 0);
	return at;
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
	/** The punch waiting for a badge, once the employee has entered it. */
	armed: ManualPunch | null;
	onArm: (punch: ManualPunch) => void;
	/** Back from waiting for the badge to the entered punch. */
	onBack: () => void;
	onClose: () => void;
}

/**
 * A punch the employee forgot: they enter its date, time and IN/OUT, then scan their badge to
 * record it (the scan itself is handled by App, which sends `armed` along with the badge).
 * Mounted fresh each time it opens, so it always starts empty.
 */
export function ManualPunchModal({ armed, onArm, onBack, onClose }: ManualPunchModalProps) {
	const [day, setDay] = useState(startOfToday);
	const [timeText, setTimeText] = useState("");
	const [period, setPeriod] = useState<Period>(() => (new Date().getHours() < 12 ? "AM" : "PM"));
	const [logType, setLogType] = useState<LogType | null>(null);

	// Restarted by every change, so it only runs out while nobody is using the form.
	useEffect(() => {
		const timeout = window.setTimeout(onClose, IDLE_MS);
		return () => window.clearTimeout(timeout);
	}, [day, timeText, period, logType, armed, onClose]);

	if (armed) {
		return (
			<Modal
				open
				size="sm"
				modalHeading="Scan your badge"
				primaryButtonText="Waiting for your badge…"
				primaryButtonDisabled
				secondaryButtonText="Back"
				onSecondarySubmit={onBack}
				onRequestClose={onClose}
				preventCloseOnClickOutside
			>
				<p className="tc-manual-armed">
					{armed.log_type === "IN" ? "Clock in" : "Clock out"} at {armed.label}
				</p>
			</Modal>
		);
	}

	const at = enteredAt(day, timeText, period);
	const inFuture = at !== null && at.getTime() > Date.now();
	const timeError =
		timeText.trim() && !at
			? "Enter the time as h:mm, like 7:30."
			: inFuture
				? "That time hasn't happened yet."
				: "";
	// The punch to arm, once the form holds one.
	const entered = at && !inFuture && logType ? toManualPunch(at, logType) : null;

	return (
		<Modal
			open
			size="sm"
			modalHeading="Forgot to punch?"
			primaryButtonText="Next: scan your badge"
			primaryButtonDisabled={!entered}
			secondaryButtonText="Cancel"
			{...(entered && {
				onRequestSubmit: () => {
					// The badge scan comes next, and onscan.js ignores keystrokes into a focused field.
					for (const element of document.querySelectorAll<HTMLElement>(":focus")) element.blur();
					onArm(entered);
				},
			})}
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
				<TimePicker
					id="tc-manual-time"
					labelText="Time"
					placeholder="hh:mm"
					value={timeText}
					onChange={(event) => setTimeText(event.target.value)}
					invalid={Boolean(timeError)}
					invalidText={timeError}
				>
					<TimePickerSelect
						id="tc-manual-period"
						aria-label="AM or PM"
						value={period}
						onChange={(event) => setPeriod(event.target.value === "PM" ? "PM" : "AM")}
					>
						<SelectItem value="AM" text="AM" />
						<SelectItem value="PM" text="PM" />
					</TimePickerSelect>
				</TimePicker>
				<RadioButtonGroup
					legendText="Clock in or out"
					name="tc-manual-log-type"
					valueSelected={logType ?? ""}
					onChange={(value) => setLogType(value === "OUT" ? "OUT" : "IN")}
				>
					<RadioButton id="tc-manual-in" labelText="Clock in" value="IN" />
					<RadioButton id="tc-manual-out" labelText="Clock out" value="OUT" />
				</RadioButtonGroup>
			</div>
		</Modal>
	);
}
