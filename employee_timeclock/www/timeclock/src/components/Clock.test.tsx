// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Clock } from "./Clock";

describe("Clock", () => {
	it("shows the time and date, and keeps up", () => {
		vi.useFakeTimers({ now: new Date(2026, 9, 23, 7, 59, 30) });
		render(<Clock />);

		expect(screen.getByText(/7:59/)).toBeTruthy();
		expect(screen.getByText(/Friday, October 23/)).toBeTruthy();

		act(() => vi.advanceTimersByTime(30 * 1000));
		expect(screen.getByText(/8:00/)).toBeTruthy();
	});

	it("stops ticking when it goes", () => {
		vi.useFakeTimers();
		const { unmount } = render(<Clock />);

		unmount();

		expect(vi.getTimerCount()).toBe(0);
	});
});
