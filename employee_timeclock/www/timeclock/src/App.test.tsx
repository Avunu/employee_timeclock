// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reloadPage } from "../../../public/js/kiosk/navigate";
import { SessionProvider } from "../../../public/js/kiosk/session";
import { respond, stubFetch, thrown } from "../../../public/js/kiosk/test/server";
import { ToastProvider } from "../../../public/js/kiosk/Toasts";
import { App } from "./App";

vi.mock("../../../public/js/kiosk/navigate", () => ({ goTo: vi.fn(), reloadPage: vi.fn() }));

const PUNCH = "employee_timeclock.www.timeclock.punch";

/** The server: every punch is Jane's, IN unless the employee chose OUT by hand. */
function server() {
	return stubFetch(async (_method, args) => {
		if (args["badge"] === "UNKNOWN1") return respond(401, thrown("Badge not recognised."));
		return respond(200, {
			message: { log_type: args["log_type"] ?? "IN", employee_name: "Jane Doe", weekly_hours: 12.5 },
		});
	});
}

function renderApp() {
	return render(
		<SessionProvider>
			<ToastProvider>
				<App />
			</ToastProvider>
		</SessionProvider>,
	);
}

/** A badge scan, as the scanner's onscan.js listener hears it. */
async function scan(badge: string): Promise<void> {
	await act(async () => {
		window.onScan!.simulate(document, badge);
	});
}

const result = () => screen.queryByRole("status", { name: "" })?.closest(".tc-result") ?? null;

describe("App", () => {
	beforeEach(() => {
		vi.mocked(reloadPage).mockClear();
		vi.useFakeTimers({ now: new Date(2026, 9, 23, 14, 0), shouldAdvanceTime: true });
	});

	it("asks for a badge, and links back to the old timeclock", () => {
		renderApp();

		expect(screen.getByText("Scan your badge to clock in or out.")).toBeTruthy();
		expect(screen.getByRole("link", { name: "Use old timeclock" }).getAttribute("href")).toBe(
			"/employee-timeclock?new=1",
		);
	});

	it("records a scan and shows the punch, then clears it for the next person", async () => {
		const fetch = server();
		renderApp();

		await scan("RFID1234");

		expect(fetch).toHaveBeenCalledOnce();
		expect(fetch.mock.calls[0]![0]).toBe(`/api/method/${PUNCH}`);
		expect(JSON.parse(String(fetch.mock.calls[0]![1].body))).toEqual({ badge: "RFID1234" });
		expect(result()?.textContent).toContain("Jane Doe");
		expect(screen.queryByText("Scan your badge to clock in or out.")).toBeNull();

		act(() => vi.advanceTimersByTime(7000));
		expect(result()).toBeNull();
		expect(screen.getByText("Scan your badge to clock in or out.")).toBeTruthy();
	});

	it("records a scanner's double fire once", async () => {
		let answer: (response: Response) => void = () => {};
		const fetch = stubFetch(() => new Promise((resolve) => (answer = resolve)));
		renderApp();

		await scan("RFID1234");
		await scan("RFID1234");
		expect(fetch).toHaveBeenCalledOnce();

		await act(async () =>
			answer(respond(200, { message: { log_type: "IN", employee_name: "Jane Doe", weekly_hours: 1 } })),
		);
		await scan("RFID1234");
		expect(fetch).toHaveBeenCalledTimes(2);
	});

	it("ignores a scan that is only blanks", async () => {
		const fetch = server();
		renderApp();

		await scan("        ");

		expect(fetch).not.toHaveBeenCalled();
	});

	it("shows an unknown badge as an error, not a punch", async () => {
		server();
		renderApp();

		await scan("UNKNOWN1");

		expect(screen.getByText("Badge not recognised.")).toBeTruthy();
		expect(result()).toBeNull();
	});

	it("records a forgotten punch with the time and IN/OUT the employee entered", async () => {
		const fetch = server();
		renderApp();

		fireEvent.click(screen.getByRole("button", { name: "Forgot to punch?" }));
		await scan("RFID1234");
		expect(fetch).not.toHaveBeenCalled(); // still entering it

		fireEvent.change(screen.getByLabelText("Time"), { target: { value: "7:30" } });
		fireEvent.change(screen.getByLabelText("AM or PM"), { target: { value: "AM" } });
		fireEvent.click(screen.getByLabelText("Clock out"));
		fireEvent.click(screen.getByRole("button", { name: "Next: scan your badge" }));
		expect(screen.getByText(/Clock out at 7:30/)).toBeTruthy();

		await scan("RFID1234");

		expect(JSON.parse(String(fetch.mock.calls[0]![1].body))).toEqual({
			badge: "RFID1234",
			time: "2026-10-23 07:30:00",
			log_type: "OUT",
		});
		expect(screen.queryByText(/Waiting for your badge/)).toBeNull();
		expect(result()?.textContent).toContain("Clocked out");
	});

	it("keeps a forgotten punch waiting when the server refuses it", async () => {
		server();
		renderApp();
		fireEvent.click(screen.getByRole("button", { name: "Forgot to punch?" }));
		fireEvent.change(screen.getByLabelText("Time"), { target: { value: "7:30" } });
		fireEvent.change(screen.getByLabelText("AM or PM"), { target: { value: "AM" } });
		fireEvent.click(screen.getByLabelText("Clock in"));
		fireEvent.click(screen.getByRole("button", { name: "Next: scan your badge" }));

		await scan("UNKNOWN1");

		expect(screen.getByText("Badge not recognised.")).toBeTruthy();
		expect(screen.getByText(/Waiting for your badge/)).toBeTruthy();
	});

	it("goes back from waiting for the badge to the entered punch", () => {
		renderApp();
		fireEvent.click(screen.getByRole("button", { name: "Forgot to punch?" }));
		fireEvent.change(screen.getByLabelText("Time"), { target: { value: "7:30" } });
		fireEvent.change(screen.getByLabelText("AM or PM"), { target: { value: "AM" } });
		fireEvent.click(screen.getByLabelText("Clock in"));
		fireEvent.click(screen.getByRole("button", { name: "Next: scan your badge" }));

		fireEvent.click(screen.getByRole("button", { name: "Back" }));

		expect(screen.getByLabelText("Time")).toBeTruthy();
	});

	it("goes back to ordinary punches when the forgotten one is cancelled", async () => {
		const fetch = server();
		renderApp();
		fireEvent.click(screen.getByRole("button", { name: "Forgot to punch?" }));

		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		await scan("RFID1234");

		expect(screen.queryByLabelText("Time")).toBeNull();
		expect(JSON.parse(String(fetch.mock.calls[0]![1].body))).toEqual({ badge: "RFID1234" });
	});

	it("reloads every hour", () => {
		renderApp();

		act(() => vi.advanceTimersByTime(60 * 60 * 1000));

		expect(reloadPage).toHaveBeenCalledOnce();
	});

	it("stops its timers when it goes", async () => {
		server();
		const { unmount } = renderApp();
		await scan("RFID1234");

		unmount();
		act(() => vi.advanceTimersByTime(2 * 60 * 60 * 1000));

		expect(reloadPage).not.toHaveBeenCalled();
	});
});
