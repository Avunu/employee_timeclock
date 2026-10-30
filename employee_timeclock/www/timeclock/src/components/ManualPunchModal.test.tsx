// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setTime, shownTime } from "../test/setTime";
import { useKeyboardWedge } from "../../../shared/useKeyboardWedge";
import { ManualPunchModal } from "./ManualPunchModal";

// Mid-afternoon on Friday 23 October 2026, on the tablet's clock.
const NOW = new Date(2026, 9, 23, 14, 0, 0);

const onArm = vi.fn();
const onClose = vi.fn();

function open() {
	return render(<ManualPunchModal onArm={onArm} onClose={onClose} />);
}

/** The punch the form last armed: what a scan would record now. */
const armed = () => onArm.mock.lastCall?.[0];

/** `time` is HH:MM on a 24-hour clock, set by tapping the spinner's arrows. */
function enter(time: string, logType: "Clock in" | "Clock out") {
	setTime(time);
	fireEvent.click(screen.getByLabelText(logType));
}

describe("ManualPunchModal", () => {
	beforeEach(() => {
		vi.useFakeTimers({ now: NOW, toFake: ["Date", "setTimeout", "clearTimeout"] });
		for (const spy of [onArm, onClose]) spy.mockClear();
	});

	it("starts on today and the time now, with IN or OUT still to choose", () => {
		vi.setSystemTime(new Date(2026, 9, 23, 13, 47));
		open();

		expect((screen.getByLabelText("Date") as HTMLInputElement).value).toBe("10/23/2026");
		expect(shownTime()).toBe(13 * 60 + 47);
		expect(armed()).toBeNull();
		expect(screen.getByText("Enter the time and choose clock in or out, then scan your badge.")).toBeTruthy();
	});

	it("arms the time now once IN or OUT is chosen", () => {
		open();

		fireEvent.click(screen.getByLabelText("Clock out"));

		expect(armed()?.time).toBe("2026-10-23 14:00:00");
	});

	it("arms a punch once it has a past time and IN or OUT, and asks for the badge", () => {
		open();

		enter("07:30", "Clock in");

		expect(armed()).toEqual({
			time: "2026-10-23 07:30:00",
			log_type: "IN",
			label: expect.stringMatching(/7:30.*AM.*Fri.*Oct.*23/),
		});
		expect(screen.getByText(/Scan your badge to clock in at 7:30/)).toBeTruthy();
	});

	it("has no button to press: the badge scan records the punch", () => {
		open();

		enter("07:30", "Clock in");

		expect(screen.queryByRole("button", { name: /scan your badge/i })).toBeNull();
	});

	it("reads midnight, noon and afternoon times", () => {
		open();

		enter("00:05", "Clock out");
		expect(armed()?.time).toBe("2026-10-23 00:05:00");
		enter("12:05", "Clock out");
		expect(armed()?.time).toBe("2026-10-23 12:05:00");
		enter("13:45", "Clock in");
		expect([armed()?.time, armed()?.log_type]).toEqual(["2026-10-23 13:45:00", "IN"]);
	});

	it("follows a change to the punch, and disarms when it's in the future", () => {
		open();

		enter("07:30", "Clock in");
		fireEvent.click(screen.getByLabelText("Clock out"));
		expect(armed()?.log_type).toBe("OUT");
		fireEvent.click(screen.getByRole("button", { name: "Minute up" }));
		expect(armed()?.time).toBe("2026-10-23 07:31:00");
		fireEvent.click(screen.getByRole("button", { name: "AM or PM up" }));

		expect(armed()).toBeNull();
	});

	it("refuses a time that hasn't happened yet", () => {
		open();

		enter("15:00", "Clock out");

		expect(screen.getByText("That time hasn't happened yet.")).toBeTruthy();
		expect(armed()).toBeNull();
	});

	it("waits for IN or OUT", () => {
		open();

		setTime("07:30");

		expect(armed()).toBeNull();
	});

	it("takes another day from the calendar, and never opens the keyboard", () => {
		open();
		const date = screen.getByLabelText("Date") as HTMLInputElement;

		expect(date.inputMode).toBe("none");

		const days = [...document.querySelectorAll(".flatpickr-day:not(.prevMonthDay, .nextMonthDay)")];
		fireEvent.click(days.find((day) => day.textContent === "21")!);
		enter("21:00", "Clock out");

		expect(armed()?.time).toBe("2026-10-21 21:00:00");
	});

	it("keeps its day if the picker's date is cleared", () => {
		open();
		const date = screen.getByLabelText("Date") as HTMLInputElement & {
			_flatpickr: { clear: () => void };
		};

		act(() => date._flatpickr.clear());
		enter("07:30", "Clock in");

		expect(armed()?.time).toBe("2026-10-23 07:30:00");
	});

	it("hears a real scan after a date is picked, with In/Out chosen first", () => {
		const onScan = vi.fn();
		function WithScanner() {
			useKeyboardWedge(onScan);
			return <ManualPunchModal onArm={onArm} onClose={onClose} />;
		}
		render(<WithScanner />);
		fireEvent.click(screen.getByLabelText("Clock in"));
		const date = screen.getByLabelText("Date");
		date.focus();
		fireEvent.click(date);
		const days = [...document.querySelectorAll(".flatpickr-day:not(.prevMonthDay, .nextMonthDay)")];
		fireEvent.click(days.find((day) => day.textContent === "21")!);
		act(() => vi.advanceTimersByTime(10));

		expect(document.activeElement).not.toBe(date);
		const target = document.activeElement!;
		for (const key of [..."ABC123", "Enter"]) {
			fireEvent.keyDown(target, { key, keyCode: key === "Enter" ? 13 : 65, which: 65 });
		}
		act(() => vi.advanceTimersByTime(200));

		expect(onScan).toHaveBeenCalledExactlyOnceWith("ABC123");
	});

	it("closes on its close button", async () => {
		vi.useRealTimers();
		open();

		await userEvent.click(screen.getByRole("button", { name: "Close" }));

		expect(onClose).toHaveBeenCalled();
	});

	it("closes by itself after two idle minutes, counted from the last change", () => {
		open();

		act(() => vi.advanceTimersByTime(90 * 1000));
		fireEvent.click(screen.getByRole("button", { name: "Hour down" }));
		act(() => vi.advanceTimersByTime(90 * 1000));
		expect(onClose).not.toHaveBeenCalled();
		act(() => vi.advanceTimersByTime(30 * 1000));

		expect(onClose).toHaveBeenCalledOnce();
	});
});
