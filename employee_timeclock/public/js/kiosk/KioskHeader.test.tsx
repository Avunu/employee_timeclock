// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { KioskHeader } from "./KioskHeader";
import { reloadPage } from "./navigate";

vi.mock("./navigate", () => ({ goTo: vi.fn(), reloadPage: vi.fn() }));

describe("KioskHeader", () => {
	it("names the page and shows its own actions before the utility ones", () => {
		render(
			<KioskHeader name="Timeclock">
				<button type="button">Page action</button>
			</KioskHeader>,
		);

		expect(screen.getByRole("banner", { name: "Timeclock" }).textContent).toContain("Timeclock");
		const buttons = screen.getAllByRole("button").map((button) => button.textContent || button.ariaLabel);
		expect(buttons.indexOf("Page action")).toBeLessThan(buttons.indexOf("Reload page"));
	});

	it("reloads the page from its reload action", async () => {
		render(<KioskHeader name="Timeclock" />);

		await userEvent.click(screen.getByRole("button", { name: "Reload page" }));

		expect(reloadPage).toHaveBeenCalledOnce();
	});
});
