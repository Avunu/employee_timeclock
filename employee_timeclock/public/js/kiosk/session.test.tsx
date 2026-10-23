// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, render, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { goTo } from "./navigate";
import { parseSessionExpiry, SessionProvider, useSession } from "./session";

vi.mock("./navigate", () => ({ goTo: vi.fn(), reloadPage: vi.fn() }));

const HOUR = 60 * 60 * 1000;

describe("parseSessionExpiry", () => {
	it.each([
		[undefined, 240 * HOUR],
		["", 240 * HOUR],
		["240:00", 240 * HOUR],
		["1:30", 1.5 * HOUR],
		["0:00:45", 45 * 1000],
		["6", 6 * HOUR],
	])("reads %j as its length in milliseconds", (value, ms) => {
		expect(parseSessionExpiry(value)).toBe(ms);
	});
});

describe("SessionProvider", () => {
	beforeEach(() => {
		vi.mocked(goTo).mockClear();
		vi.useFakeTimers();
		window.kiosk_boot = { session_expiry: "0:01" }; // a minute
	});

	function session() {
		return renderHook(() => useSession(), { wrapper: SessionProvider }).result;
	}

	it("reloads the page, without its query string, once the session has run out", () => {
		session();

		act(() => vi.advanceTimersByTime(55 * 1000));
		expect(goTo).not.toHaveBeenCalled();
		act(() => vi.advanceTimersByTime(5 * 1000));
		expect(goTo).toHaveBeenCalledExactlyOnceWith("/timeclock");
	});

	it("restarts the timer on every successful call", () => {
		const result = session();

		act(() => vi.advanceTimersByTime(50 * 1000));
		act(() => result.current.recordActivity());
		act(() => vi.advanceTimersByTime(50 * 1000));
		expect(goTo).not.toHaveBeenCalled();
		act(() => vi.advanceTimersByTime(10 * 1000));
		expect(goTo).toHaveBeenCalledOnce();
	});

	it("reloads at once on a 403, and only once however many come back", () => {
		const result = session();

		act(() => {
			result.current.reportForbidden();
			result.current.reportForbidden();
		});
		act(() => vi.advanceTimersByTime(2 * 60 * 1000));

		expect(goTo).toHaveBeenCalledOnce();
	});

	it("waits the System Settings default when the page sent no expiry", () => {
		delete window.kiosk_boot;
		session();

		act(() => vi.advanceTimersByTime(239 * HOUR));
		expect(goTo).not.toHaveBeenCalled();
	});

	it("stops its timer when the page goes", () => {
		const { unmount } = render(<SessionProvider>page</SessionProvider>);

		unmount();
		act(() => vi.advanceTimersByTime(2 * 60 * 1000));

		expect(goTo).not.toHaveBeenCalled();
	});

	it("does nothing outside a SessionProvider", () => {
		const result = renderHook(() => useSession()).result;

		expect(() => {
			result.current.recordActivity();
			result.current.reportForbidden();
		}).not.toThrow();
		expect(goTo).not.toHaveBeenCalled();
	});
});
