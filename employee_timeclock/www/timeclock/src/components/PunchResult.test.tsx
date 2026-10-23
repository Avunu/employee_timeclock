// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PunchResult } from "./PunchResult";

describe("PunchResult", () => {
	it("shows who clocked in and their hours this week", () => {
		render(<PunchResult punch={{ log_type: "IN", employee_name: "Jane Doe", weekly_hours: 12.5 }} />);

		const result = screen.getByRole("status");
		expect(result.textContent).toContain("Clocked in");
		expect(result.textContent).toContain("Jane Doe");
		expect(result.textContent).toContain("12.5 hours this week");
		expect(result.querySelector(".cds--tag--green")).not.toBeNull();
	});

	it("shows a clock-out in red", () => {
		render(<PunchResult punch={{ log_type: "OUT", employee_name: "Sam Roe", weekly_hours: 40 }} />);

		expect(screen.getByRole("status").textContent).toContain("Clocked out");
		expect(screen.getByRole("status").querySelector(".cds--tag--red")).not.toBeNull();
	});
});
