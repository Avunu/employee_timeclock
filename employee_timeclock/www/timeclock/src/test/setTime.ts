// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { fireEvent, screen } from "@testing-library/react";

const shown = (name: string) => screen.getByLabelText(name).textContent;

/** Minutes since midnight the time spinner shows. */
export function shownTime(): number {
	const hour = (Number(shown("Hour")) % 12) + (shown("AM or PM") === "PM" ? 12 : 0);
	return hour * 60 + Number(shown("Minute"));
}

/** Set the time spinner to `time` (HH:MM on a 24-hour clock) by tapping its arrows, as an
 * employee would. */
export function setTime(time: string): void {
	const [hour = 0, minute = 0] = time.split(":").map(Number);
	// Each arrow is found once and then tapped: a role query is slow in jsdom, and one per tap
	// took a test past vitest's timeout on a busy CI runner.
	const tap = (name: string, times = 1) => {
		const arrow = screen.getByRole("button", { name });
		for (; times > 0; times--) fireEvent.click(arrow);
	};
	if (Math.floor(shownTime() / 60) >= 12 !== hour >= 12) tap("AM or PM up");
	// The shorter way round, as each part wraps.
	const stepTo = (part: "Hour" | "Minute", up: number, size: number) => {
		const name = up <= size / 2 ? `${part} up` : `${part} down`;
		const taps = Math.min(up, size - up);
		if (taps > 0) tap(name, taps);
	};
	stepTo("Hour", (hour - Math.floor(shownTime() / 60) + 12) % 12, 12);
	stepTo("Minute", (minute - (shownTime() % 60) + 60) % 60, 60);
}
