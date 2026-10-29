// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setTime, shownTime } from "../test/setTime";
import { TimeSpinner } from "./TimeSpinner";

function Spinner({ start }: { start: number }) {
	const [value, setValue] = useState(start);
	return <TimeSpinner value={value} onChange={setValue} />;
}

const at = (hour: number, minute: number) => hour * 60 + minute;
const arrow = (name: string) => screen.getByRole("button", { name });
const shown = () => ["Hour", "Minute", "AM or PM"].map((name) => screen.getByLabelText(name).textContent);

describe("TimeSpinner", () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("shows the time on a 12-hour clock", () => {
		const { rerender } = render(<TimeSpinner value={at(14, 5)} onChange={vi.fn()} />);
		expect(shown()).toEqual(["2", "05", "PM"]);

		rerender(<TimeSpinner value={at(0, 30)} onChange={vi.fn()} />);
		expect(shown()).toEqual(["12", "30", "AM"]);

		rerender(<TimeSpinner value={at(12, 0)} onChange={vi.fn()} />);
		expect(shown()).toEqual(["12", "00", "PM"]);
	});

	it("steps hours, minutes and AM/PM on their own", () => {
		render(<Spinner start={at(7, 30)} />);

		fireEvent.click(arrow("Hour up"));
		fireEvent.click(arrow("Minute down"));
		expect(shown()).toEqual(["8", "29", "AM"]);
		fireEvent.click(arrow("AM or PM down"));

		expect(shownTime()).toBe(at(20, 29));
	});

	it("wraps each part without touching the others, as a time input does", () => {
		render(<Spinner start={at(11, 59)} />);

		fireEvent.click(arrow("Minute up"));
		expect(shown()).toEqual(["11", "00", "AM"]);
		fireEvent.click(arrow("Hour up"));
		expect(shown()).toEqual(["12", "00", "AM"]);
		fireEvent.click(arrow("Hour down"));
		fireEvent.click(arrow("Minute down"));
		expect(shown()).toEqual(["11", "59", "AM"]);
		fireEvent.click(arrow("AM or PM up"));

		expect(shownTime()).toBe(at(23, 59));
	});

	it("keeps stepping while an arrow is held, and not once more when it's let go", () => {
		render(<Spinner start={at(7, 0)} />);

		fireEvent.pointerDown(arrow("Hour up"));
		act(() => vi.advanceTimersByTime(399));
		expect(shown()[0]).toBe("7");
		act(() => vi.advanceTimersByTime(1 + 300)); // the first step, then two more
		fireEvent.pointerUp(arrow("Hour up"));
		fireEvent.click(arrow("Hour up"));
		act(() => vi.advanceTimersByTime(1000));

		expect(shown()[0]).toBe("10");
	});

	it("holds the minutes a minute at a time, then jumps by fives", () => {
		render(<Spinner start={at(7, 47)} />);

		fireEvent.pointerDown(arrow("Minute up"));
		act(() => vi.advanceTimersByTime(400 + 4 * 150)); // five single minutes
		expect(shown()[1]).toBe("52");
		act(() => vi.advanceTimersByTime(150)); // to the next five
		expect(shown()[1]).toBe("55");
		act(() => vi.advanceTimersByTime(2 * 150)); // round past the hour, which stays put

		expect(shown().slice(0, 2)).toEqual(["7", "05"]);
	});

	it("jumps down to the last five, and by fives from there", () => {
		render(<Spinner start={at(7, 13)} />);

		fireEvent.pointerDown(arrow("Minute down"));
		act(() => vi.advanceTimersByTime(400 + 4 * 150));
		expect(shown()[1]).toBe("08");
		act(() => vi.advanceTimersByTime(150));
		expect(shown()[1]).toBe("05");
		act(() => vi.advanceTimersByTime(2 * 150));

		expect(shown().slice(0, 2)).toEqual(["7", "55"]);
	});

	it("starts a minute at a time again on the next hold", () => {
		render(<Spinner start={at(7, 0)} />);

		fireEvent.pointerDown(arrow("Minute up"));
		act(() => vi.advanceTimersByTime(400 + 6 * 150)); // 1-5, then 10, 15
		fireEvent.pointerUp(arrow("Minute up"));
		fireEvent.click(arrow("Minute up"));
		expect(shown()[1]).toBe("15");
		fireEvent.pointerDown(arrow("Minute up"));
		act(() => vi.advanceTimersByTime(400));

		expect(shown()[1]).toBe("16");
	});

	it("steps once on a tap", () => {
		render(<Spinner start={at(7, 0)} />);

		fireEvent.pointerDown(arrow("Minute up"));
		fireEvent.pointerUp(arrow("Minute up"));
		fireEvent.click(arrow("Minute up"));
		fireEvent.click(arrow("Minute up")); // Enter or Space, with no pointer

		expect(shown()[1]).toBe("02");
	});

	it.each(["pointerLeave", "pointerCancel"] as const)("stops stepping on %s", (event) => {
		render(<Spinner start={at(7, 0)} />);

		fireEvent.pointerDown(arrow("Hour down"));
		act(() => vi.advanceTimersByTime(400));
		fireEvent[event](arrow("Hour down"));
		act(() => vi.advanceTimersByTime(1000));

		expect(shown()[0]).toBe("6");
	});

	it("stops stepping when it goes away", () => {
		const onChange = vi.fn();
		const { unmount } = render(<TimeSpinner value={at(7, 0)} onChange={onChange} />);

		fireEvent.pointerDown(arrow("Hour up"));
		unmount();
		act(() => vi.advanceTimersByTime(1000));

		expect(onChange).not.toHaveBeenCalled();
	});

	it("keeps a long press from opening the browser's menu", () => {
		render(<Spinner start={at(7, 0)} />);

		expect(fireEvent.contextMenu(arrow("Hour up"))).toBe(false); // prevented
	});

	it("has no field a badge scan could type into", () => {
		render(<Spinner start={at(7, 0)} />);

		expect(screen.queryByRole("textbox")).toBeNull();
		expect(document.querySelector("input")).toBeNull();
	});

	it("reaches any time by tapping", () => {
		render(<Spinner start={at(14, 0)} />);

		setTime("07:30");
		expect(shownTime()).toBe(at(7, 30));
		setTime("21:05");

		expect(shownTime()).toBe(at(21, 5));
	});
});
