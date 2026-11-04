// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it } from "vitest";
import { rememberServerTime, serverNow } from "./clock";

const TABLET_NOW = new Date(2026, 9, 27, 8, 0, 0).getTime();

describe("the kiosk's clock", () => {
	it("is the tablet's own clock until it has heard from the server", () => {
		expect(serverNow(TABLET_NOW)).toBe("2026-10-27 08:00:00");
	});

	it("keeps the server's time, however far the tablet's clock has drifted", () => {
		rememberServerTime("2026-10-27 08:10:30", TABLET_NOW);

		expect(serverNow(TABLET_NOW)).toBe("2026-10-27 08:10:30");
		expect(serverNow(TABLET_NOW + 60 * 60 * 1000)).toBe("2026-10-27 09:10:30");
	});

	it("covers a tablet set to the wrong time zone, as if its clock were hours off", () => {
		rememberServerTime("2026-10-27 13:00:00", TABLET_NOW);

		expect(serverNow(TABLET_NOW)).toBe("2026-10-27 13:00:00");
	});

	it("carries the date over midnight", () => {
		rememberServerTime("2026-10-26 23:59:50", TABLET_NOW);

		expect(serverNow(TABLET_NOW + 20 * 1000)).toBe("2026-10-27 00:00:10");
	});

	it("ignores a server time it can't read", () => {
		rememberServerTime("2026-10-27 08:10:30", TABLET_NOW);

		rememberServerTime("not a time", TABLET_NOW);

		expect(serverNow(TABLET_NOW)).toBe("2026-10-27 08:10:30");
	});

	it("falls back to the tablet's clock when what it kept is unreadable", () => {
		window.localStorage.setItem("employee-timeclock-kiosk:clock-offset", "garbage");

		expect(serverNow(TABLET_NOW)).toBe("2026-10-27 08:00:00");
	});

	it("uses the time now when not told otherwise", () => {
		rememberServerTime(serverNow());

		expect(serverNow()).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
	});
});
