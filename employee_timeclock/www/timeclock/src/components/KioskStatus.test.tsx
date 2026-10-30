// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KioskStatus } from "./KioskStatus";

describe("KioskStatus", () => {
	it("shows nothing while online with nothing waiting", () => {
		render(<KioskStatus online waiting={0} />);

		expect(screen.getByRole("status").textContent).toBe("");
	});

	it("says when the kiosk is offline", () => {
		render(<KioskStatus online={false} waiting={0} />);

		expect(screen.getByRole("status").textContent).toBe("Offline");
	});

	it.each([
		[1, "1 punch waiting"],
		[3, "3 punches waiting"],
	])("counts %i punch(es) waiting", (waiting, text) => {
		render(<KioskStatus online={false} waiting={waiting} />);

		expect(screen.getByRole("status").textContent).toBe(`Offline${text}`);
	});
});
