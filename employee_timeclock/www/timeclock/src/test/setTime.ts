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
	const tap = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
	if (Math.floor(shownTime() / 60) >= 12 !== hour >= 12) tap("AM or PM up");
	// The shorter way round, as each part wraps.
	const stepTo = (part: "Hour" | "Minute", up: number, size: number) => {
		const name = up <= size / 2 ? `${part} up` : `${part} down`;
		for (let taps = Math.min(up, size - up); taps > 0; taps--) tap(name);
	};
	stepTo("Hour", (hour - Math.floor(shownTime() / 60) + 12) % 12, 12);
	stepTo("Minute", (minute - (shownTime() % 60) + 60) % 60, 60);
}
