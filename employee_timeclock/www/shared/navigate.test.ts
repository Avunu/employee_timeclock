// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it } from "vitest";
import { goTo, reloadPage } from "./navigate";

describe("navigate", () => {
	it("goes to the address it's given", () => {
		// jsdom can follow a link within the page, and nothing further.
		goTo("#arrived");

		expect(window.location.hash).toBe("#arrived");
	});

	it("asks the browser to reload", () => {
		// jsdom can't reload; it reports that to its own console rather than throwing.
		expect(reloadPage).not.toThrow();
	});
});
