// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ManualPunch } from "../types";
import { ManualPunchModal } from "./ManualPunchModal";

// Mid-afternoon on Friday 23 October 2026, on the tablet's clock.
const NOW = new Date(2026, 9, 23, 14, 0, 0);

const onArm = vi.fn();
const onBack = vi.fn();
const onClose = vi.fn();

function open(armed: ManualPunch | null = null) {
	return render(<ManualPunchModal armed={armed} onArm={onArm} onBack={onBack} onClose={onClose} />);
}

const next = () => screen.getByRole("button", { name: "Next: scan your badge" }) as HTMLButtonElement;
const timeField = () => screen.getByLabelText("Time") as HTMLInputElement;
/** `time` is what the time input holds: HH:MM on a 24-hour clock, whatever the tablet shows. */
function enter(time: string, logType: "Clock in" | "Clock out") {
	fireEvent.change(timeField(), { target: { value: time } });
	fireEvent.click(screen.getByLabelText(logType));
}

describe("ManualPunchModal", () => {
	beforeEach(() => {
		vi.useFakeTimers({ now: NOW, toFake: ["Date", "setTimeout", "clearTimeout"] });
		for (const spy of [onArm, onBack, onClose]) spy.mockClear();
	});

	it("starts on today, with nothing chosen", () => {
		open();

		expect((screen.getByLabelText("Date") as HTMLInputElement).value).toBe("10/23/2026");
		expect(timeField().value).toBe("");
		expect(next().disabled).toBe(true);
	});

	it("takes the time in a time input, with hours and minutes to step through", () => {
		open();

		expect(timeField().type).toBe("time");
	});

	it("arms a punch once it has a past time and IN or OUT", () => {
		open();

		enter("07:30", "Clock in");
		expect(next().disabled).toBe(false);
		fireEvent.click(next());

		expect(onArm).toHaveBeenCalledExactlyOnceWith({
			time: "2026-10-23 07:30:00",
			log_type: "IN",
			label: expect.stringMatching(/7:30.*AM.*Fri.*Oct.*23/),
		});
	});

	it("reads midnight, noon and afternoon times", () => {
		open();

		enter("00:05", "Clock out");
		fireEvent.click(next());
		enter("12:05", "Clock out");
		fireEvent.click(next());
		enter("13:45", "Clock in");
		fireEvent.click(next());

		expect(onArm.mock.calls.map(([punch]) => [punch.time, punch.log_type])).toEqual([
			["2026-10-23 00:05:00", "OUT"],
			["2026-10-23 12:05:00", "OUT"],
			["2026-10-23 13:45:00", "IN"],
		]);
	});

	it("waits for the time to be filled in", () => {
		open();

		enter("", "Clock in");

		expect(next().disabled).toBe(true);
	});

	it("refuses a time that hasn't happened yet", () => {
		open();

		enter("15:00", "Clock out");

		expect(screen.getByText("That time hasn't happened yet.")).toBeTruthy();
		expect(next().disabled).toBe(true);
	});

	it("waits for IN or OUT", () => {
		open();

		fireEvent.change(timeField(), { target: { value: "07:30" } });

		expect(next().disabled).toBe(true);
	});

	it("takes another day from the date picker", () => {
		open();
		const date = screen.getByLabelText("Date") as HTMLInputElement;

		fireEvent.change(date, { target: { value: "10/21/2026" } });
		fireEvent.blur(date);
		enter("21:00", "Clock out");
		fireEvent.click(next());

		expect(onArm.mock.calls[0]![0].time).toBe("2026-10-21 21:00:00");
	});

	it("keeps the day it had when the date is cleared", () => {
		open();
		const date = screen.getByLabelText("Date") as HTMLInputElement;

		fireEvent.change(date, { target: { value: "" } });
		fireEvent.blur(date);
		enter("07:30", "Clock in");
		fireEvent.click(next());

		expect(onArm.mock.calls[0]![0].time).toBe("2026-10-23 07:30:00");
	});

	it("lets go of the field it was typed into, so the badge scan is heard", () => {
		open();
		enter("07:30", "Clock in");
		timeField().focus();

		fireEvent.click(next());

		expect(document.activeElement).not.toBe(timeField());
	});

	it("waits for the badge once armed, and goes back to the form", async () => {
		vi.useRealTimers();
		open({ time: "2026-10-23 07:30:00", log_type: "IN", label: "7:30 AM, Fri, Oct 23" });

		expect(screen.getByText("Clock in at 7:30 AM, Fri, Oct 23")).toBeTruthy();
		expect(
			(screen.getByRole("button", { name: "Waiting for your badge…" }) as HTMLButtonElement).disabled,
		).toBe(true);
		await userEvent.click(screen.getByRole("button", { name: "Back" }));

		expect(onBack).toHaveBeenCalledOnce();
	});

	it("names a clock-out when armed with one", () => {
		open({ time: "2026-10-23 16:00:00", log_type: "OUT", label: "4:00 PM, Fri, Oct 23" });

		expect(screen.getByText("Clock out at 4:00 PM, Fri, Oct 23")).toBeTruthy();
	});

	it("closes on Cancel", async () => {
		vi.useRealTimers();
		open();

		await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

		expect(onClose).toHaveBeenCalled();
	});

	it("closes by itself after two idle minutes, counted from the last change", () => {
		open();

		act(() => vi.advanceTimersByTime(90 * 1000));
		fireEvent.change(timeField(), { target: { value: "07:00" } });
		act(() => vi.advanceTimersByTime(90 * 1000));
		expect(onClose).not.toHaveBeenCalled();
		act(() => vi.advanceTimersByTime(30 * 1000));

		expect(onClose).toHaveBeenCalledOnce();
	});
});
