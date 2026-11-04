// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import { Button } from "@carbon/react";
import { ChevronDown, ChevronUp } from "@carbon/react/icons";

const DAY_MINUTES = 24 * 60;

/** Held down, an arrow steps once, waits this long, then keeps stepping every REPEAT_MS. */
const HOLD_MS = 400;
const REPEAT_MS = 150;

/** Held down, the minutes step one at a time this many times, then jump to the next five: :05, :10. */
const MINUTES_BEFORE_FIVES = 5;

const pad = (value: number): string => String(value).padStart(2, "0");

type Part = "hour" | "minute" | "period";

/**
 * Minutes since midnight after one step of `part`. Each part wraps on its own, as a native time
 * input's do: 59 minutes up is 00 of the same hour, 12 up is 1 of the same half of the day.
 * `held` is how many steps an arrow held down has taken, 0 for a tap: held long enough, the
 * minutes jump to the next multiple of five instead of the next minute.
 */
function stepped(minutes: number, part: Part, by: 1 | -1, held: number): number {
	const hour = Math.floor(minutes / 60);
	const minute = minutes % 60;
	switch (part) {
		case "hour":
			// Within its half of the day, so AM stays AM.
			return (Math.floor(hour / 12) * 12 + (((hour % 12) + by + 12) % 12)) * 60 + minute;
		case "minute": {
			// To the next five up, or the last one down: 7:47 goes to 7:50 or 7:45.
			const step = held > MINUTES_BEFORE_FIVES ? (by > 0 ? 5 - (minute % 5) : -(minute % 5 || 5)) : by;
			return hour * 60 + ((minute + step + 60) % 60);
		}
		case "period":
			return (minutes + DAY_MINUTES / 2) % DAY_MINUTES;
	}
}

/** Click handlers for an arrow that steps once on a tap and keeps stepping while held. `step` is
 * given how many steps the hold has taken so far, counting this one, or 0 for a tap. */
function useHoldToRepeat(step: (held: number) => void) {
	const timer = useRef<number | undefined>(undefined);
	// The steps taken by holding, so the click that ends the hold doesn't step again.
	const held = useRef(0);
	const stepRef = useRef(step);
	useEffect(() => {
		stepRef.current = step;
	});

	const stop = () => {
		window.clearTimeout(timer.current);
		window.clearInterval(timer.current);
		timer.current = undefined;
	};
	useEffect(() => stop, []);

	return {
		onPointerDown: () => {
			stop();
			held.current = 0;
			const holdStep = () => stepRef.current(++held.current);
			timer.current = window.setTimeout(() => {
				holdStep();
				timer.current = window.setInterval(holdStep, REPEAT_MS);
			}, HOLD_MS);
		},
		onPointerUp: stop,
		onPointerLeave: stop,
		onPointerCancel: stop,
		// A tap, or Enter or Space on the focused arrow.
		onClick: () => {
			if (held.current) held.current = 0;
			else stepRef.current(0);
		},
		// A long press on a tablet would otherwise open the browser's context menu.
		onContextMenu: (event: { preventDefault: () => void }) => event.preventDefault(),
	};
}

interface ColumnProps {
	name: string;
	text: string;
	onStep: (by: 1 | -1, held: number) => void;
}

function Column({ name, text, onStep }: ColumnProps) {
	const up = useHoldToRepeat((held) => onStep(1, held));
	const down = useHoldToRepeat((held) => onStep(-1, held));
	return (
		<div className="tc-spinner-column">
			<Button
				kind="ghost"
				size="lg"
				className="tc-spinner-arrow"
				hasIconOnly
				renderIcon={ChevronUp}
				iconDescription={`${name} up`}
				{...up}
			/>
			<output className="tc-spinner-value" aria-label={name}>
				{text}
			</output>
			<Button
				kind="ghost"
				size="lg"
				className="tc-spinner-arrow"
				hasIconOnly
				renderIcon={ChevronDown}
				iconDescription={`${name} down`}
				{...down}
			/>
		</div>
	);
}

interface TimeSpinnerProps {
	/** The time as minutes since midnight. */
	value: number;
	onChange: Dispatch<SetStateAction<number>>;
}

/**
 * A time on a 12-hour clock, set with big up and down arrows for a finger on a tablet: hours,
 * minutes and AM/PM each step on their own, and keep stepping while an arrow is held (the minutes
 * a minute at a time, then by fives, so a tap still reaches any minute). It has no
 * field to type into, so a badge scanned while the form is open never lands in it.
 */
export function TimeSpinner({ value, onChange }: TimeSpinnerProps) {
	const hour = Math.floor(value / 60);
	// Functional updates, so steps repeated while an arrow is held each build on the last.
	const step = (part: Part) => (by: 1 | -1, held: number) =>
		onChange((minutes) => stepped(minutes, part, by, held));
	return (
		<fieldset className="tc-spinner">
			<legend className="cds--label">Time</legend>
			<div className="tc-spinner-columns">
				<Column name="Hour" text={String(hour % 12 || 12)} onStep={step("hour")} />
				<span className="tc-spinner-colon" aria-hidden="true">
					:
				</span>
				<Column name="Minute" text={pad(value % 60)} onStep={step("minute")} />
				<Column name="AM or PM" text={hour < 12 ? "AM" : "PM"} onStep={step("period")} />
			</div>
		</fieldset>
	);
}
