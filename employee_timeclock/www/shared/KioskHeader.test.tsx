// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KioskHeader, KioskStatus } from "./KioskHeader";
import userEvent from "@testing-library/user-event";
import { reloadPage } from "./navigate";

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

	it("names what is waiting, when it isn't punches", () => {
		render(<KioskStatus online waiting={2} noun={["timer action", "timer actions"]} />);

		expect(screen.getByText("2 timer actions waiting")).toBeTruthy();
	});
});

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
