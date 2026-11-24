// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it } from "vitest";
import { elapsedSince, formatMins } from "./format";

describe("formatMins", () => {
	it.each([
		[0, "0m"],
		[-5, "0m"],
		[45, "45m"],
		[120, "2h"],
		[150, "2h 30m"],
	])("%d minutes is %s", (mins, text) => {
		expect(formatMins(mins)).toBe(text);
	});
});

describe("elapsedSince", () => {
	const now = new Date(2026, 9, 23, 14, 0, 0).getTime();

	it("reads a server time with a space or a T", () => {
		expect(elapsedSince("2026-10-23 12:58:55", now)).toBe("01:01:05");
		expect(elapsedSince("2026-10-23T13:59:00", now)).toBe("00:01:00");
	});

	it("never counts below zero", () => {
		expect(elapsedSince("2026-10-23 15:00:00", now)).toBe("00:00:00");
	});
});
