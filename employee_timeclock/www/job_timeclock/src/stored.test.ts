// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it } from "vitest";
import { readStored, writeStored } from "./stored";

describe("stored values", () => {
	it("reads back what was written", () => {
		writeStored("key", ["a"]);

		expect(readStored("key", [])).toEqual(["a"]);
	});

	it("falls back when nothing is kept", () => {
		expect(readStored("key", "fallback")).toBe("fallback");
	});

	it("falls back when what is kept can't be read", () => {
		window.localStorage.setItem("key", "{not json");

		expect(readStored("key", "fallback")).toBe("fallback");
	});
});
