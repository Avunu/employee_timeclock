// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reloadPage } from "../../../public/js/kiosk/navigate";
import { queuedPunches } from "../../../public/js/kiosk/punchQueue";
import { SessionProvider } from "../../../public/js/kiosk/session";
import { respond, stubFetch, thrown } from "../../../public/js/kiosk/test/server";
import { ToastProvider } from "../../../public/js/kiosk/Toasts";
import { App } from "./App";

vi.mock("../../../public/js/kiosk/navigate", () => ({ goTo: vi.fn(), reloadPage: vi.fn() }));

const PUNCH = "employee_timeclock.www.timeclock.punch";
const SYNC = "employee_timeclock.www.timeclock.sync_punches";

/** The server's clock in these tests: five minutes ahead of the tablet's. */
const SERVER_TIME = "2026-10-23 14:05:00";

type Fetch = ReturnType<typeof stubFetch>;

/**
 * The server: every punch is Jane's, IN unless the employee chose OUT by hand, and every synced
 * punch is recorded. With `reachable` false, nothing gets through (fetch's TypeError).
 */
function server(reachable = { value: true }): Fetch {
	return stubFetch(async (method, args) => {
		if (!reachable.value) throw new TypeError("Failed to fetch");
		if (method === SYNC) {
			const punches = args["punches"] as { id: string }[];
			return respond(200, {
				message: { results: punches.map(({ id }) => ({ id, status: "recorded" })), server_time: SERVER_TIME },
			});
		}
		if (args["badge"] === "UNKNOWN1") return respond(401, thrown("Badge not recognised."));
		return respond(200, {
			message: {
				log_type: args["log_type"] ?? "IN",
				employee_name: "Jane Doe",
				weekly_hours: 12.5,
				server_time: SERVER_TIME,
			},
		});
	});
}

/** The args of every call to `method`, in order. */
function callsTo(fetch: Fetch, method: string): Record<string, unknown>[] {
	return fetch.mock.calls
		.filter(([url]) => url === `/api/method/${method}`)
		.map(([, init]) => JSON.parse(String(init.body)) as Record<string, unknown>);
}

function setOnline(online: boolean): void {
	Object.defineProperty(navigator, "onLine", { value: online, configurable: true });
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

/** Render the app and let its first sync finish. */
async function openApp(fetch: Fetch) {
	const rendered = renderApp();
	await waitFor(() => expect(callsTo(fetch, SYNC).length).toBeGreaterThan(0));
	await act(async () => {});
	return rendered;
}

/** A badge scan, as the scanner's onscan.js listener hears it. */
async function scan(badge: string): Promise<void> {
	await act(async () => {
		window.onScan!.simulate(document, badge);
	});
}

/** A scan the tablet keeps, waiting until it's in the queue (IndexedDB answers asynchronously). */
async function scanOffline(badge: string): Promise<void> {
	const before = (await queuedPunches()).length;
	await scan(badge);
	await waitFor(async () => expect(await queuedPunches()).toHaveLength(before + 1));
	await waitFor(() => expect(result()?.textContent).toContain("Punch saved"));
}

function enterForgottenPunch(clock: string, ampm: "AM" | "PM", choice: "Clock in" | "Clock out"): void {
	fireEvent.click(screen.getByRole("button", { name: "Forgot to punch?" }));
	fireEvent.change(screen.getByLabelText("Time"), { target: { value: clock } });
	fireEvent.change(screen.getByLabelText("AM or PM"), { target: { value: ampm } });
	fireEvent.click(screen.getByLabelText(choice));
	fireEvent.click(screen.getByRole("button", { name: "Next: scan your badge" }));
}

const result = () => document.querySelector(".tc-result");

describe("App", () => {
	beforeEach(() => {
		vi.mocked(reloadPage).mockClear();
		vi.useFakeTimers({
			now: new Date(2026, 9, 23, 14, 0),
			toFake: ["Date", "setTimeout", "clearTimeout", "setInterval", "clearInterval"],
			shouldAdvanceTime: true,
		});
	});

	afterEach(() => {
		setOnline(true);
	});

	it("asks for a badge, and links back to the old timeclock", async () => {
		await openApp(server());

		expect(screen.getByText("Scan your badge to clock in or out.")).toBeTruthy();
		expect(screen.getByRole("link", { name: "Use old timeclock" }).getAttribute("href")).toBe(
			"/employee-timeclock?new=1",
		);
		expect(screen.queryByText("Offline")).toBeNull();
	});

	it("records a scan with its own id and shows the punch, then clears it for the next person", async () => {
		const fetch = server();
		await openApp(fetch);

		await scan("RFID1234");

		const [sent] = callsTo(fetch, PUNCH);
		expect(sent).toEqual({ badge: "RFID1234", punch_id: expect.stringMatching(/^[\da-f-]{36}$/) });
		expect(result()?.textContent).toContain("Jane Doe");
		expect(screen.queryByText("Scan your badge to clock in or out.")).toBeNull();

		act(() => vi.advanceTimersByTime(7000));
		expect(result()).toBeNull();
		expect(screen.getByText("Scan your badge to clock in or out.")).toBeTruthy();
	});

	it("records a scanner's double fire once", async () => {
		let answer: (response: Response) => void = () => {};
		const fetch = stubFetch((method) =>
			method === SYNC
				? Promise.resolve(respond(200, { message: { results: [], server_time: SERVER_TIME } }))
				: new Promise((resolve) => (answer = resolve)),
		);
		await openApp(fetch);

		await scan("RFID1234");
		await scan("RFID1234");
		expect(callsTo(fetch, PUNCH)).toHaveLength(1);

		await act(async () =>
			answer(
				respond(200, {
					message: { log_type: "IN", employee_name: "Jane Doe", weekly_hours: 1, server_time: SERVER_TIME },
				}),
			),
		);
		await scan("RFID1234");
		expect(callsTo(fetch, PUNCH)).toHaveLength(2);
	});

	it("ignores a scan that is only blanks", async () => {
		const fetch = server();
		await openApp(fetch);

		await scan("        ");

		expect(callsTo(fetch, PUNCH)).toEqual([]);
	});

	it("shows an unknown badge as an error, not a punch, and doesn't keep it", async () => {
		const fetch = server();
		await openApp(fetch);

		await scan("UNKNOWN1");

		expect(screen.getByText("Badge not recognised.")).toBeTruthy();
		expect(result()).toBeNull();
		expect(await queuedPunches()).toEqual([]);
		expect(callsTo(fetch, PUNCH)).toHaveLength(1);
	});

	it("records a forgotten punch with the time and IN/OUT the employee entered", async () => {
		const fetch = server();
		await openApp(fetch);

		fireEvent.click(screen.getByRole("button", { name: "Forgot to punch?" }));
		await scan("RFID1234");
		expect(callsTo(fetch, PUNCH)).toEqual([]); // still entering it
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

		enterForgottenPunch("7:30", "AM", "Clock out");
		expect(screen.getByText(/Clock out at 7:30/)).toBeTruthy();
		await scan("RFID1234");

		expect(callsTo(fetch, PUNCH)).toEqual([
			{ badge: "RFID1234", punch_id: expect.any(String), time: "2026-10-23 07:30:00", log_type: "OUT" },
		]);
		expect(screen.queryByText(/Waiting for your badge/)).toBeNull();
		expect(result()?.textContent).toContain("Clocked out");
	});

	it("keeps a forgotten punch waiting when the server refuses it", async () => {
		await openApp(server());
		enterForgottenPunch("7:30", "AM", "Clock in");

		await scan("UNKNOWN1");

		expect(screen.getByText("Badge not recognised.")).toBeTruthy();
		expect(screen.getByText(/Waiting for your badge/)).toBeTruthy();
	});

	it("goes back from waiting for the badge to the entered punch", async () => {
		await openApp(server());
		enterForgottenPunch("7:30", "AM", "Clock in");

		fireEvent.click(screen.getByRole("button", { name: "Back" }));

		expect(screen.getByLabelText("Time")).toBeTruthy();
	});

	describe("offline", () => {
		it("keeps a scan on the tablet, at the server's time, and says so", async () => {
			const reachable = { value: true };
			const fetch = server(reachable);
			await openApp(fetch); // learns the server's clock: five minutes ahead
			setOnline(false);
			reachable.value = false;

			await scanOffline("RFID1234");

			expect(callsTo(fetch, PUNCH)).toEqual([]); // no point trying
			expect(result()?.textContent).toContain("Punch saved");
			expect(screen.getByText("Offline")).toBeTruthy();
			await waitFor(() => expect(screen.getByText("1 punch waiting")).toBeTruthy());
			expect(await queuedPunches()).toEqual([
				{ id: expect.stringMatching(/^[\da-f-]{36}$/), badge: "RFID1234", time: "2026-10-23 14:05:00" },
			]);
		});

		it("keeps a scan whose call never reached the server", async () => {
			const reachable = { value: true };
			const fetch = server(reachable);
			await openApp(fetch);
			reachable.value = false; // the browser still thinks it's online

			await scanOffline("RFID1234");

			expect(callsTo(fetch, PUNCH)).toHaveLength(1);
			const [kept] = await queuedPunches();
			expect(kept?.id).toBe(callsTo(fetch, PUNCH)[0]!["punch_id"]); // the same punch, if it did arrive
			expect(screen.queryByText(/Couldn't reach/)).toBeNull();
			expect(result()?.textContent).toContain("Punch saved");
		});

		it("keeps a forgotten punch with its time and IN/OUT, and closes the form", async () => {
			const reachable = { value: true };
			await openApp(server(reachable));
			setOnline(false);
			reachable.value = false;
			enterForgottenPunch("7:30", "AM", "Clock in");

			await scanOffline("RFID1234");

			expect(await queuedPunches()).toEqual([
				{ id: expect.any(String), badge: "RFID1234", time: "2026-10-23 07:30:00", log_type: "IN", manual: 1 },
			]);
			expect(screen.queryByText(/Waiting for your badge/)).toBeNull();
		});

		it("sends what it kept once it's back online", async () => {
			const reachable = { value: true };
			const fetch = server(reachable);
			await openApp(fetch);
			setOnline(false);
			reachable.value = false;
			await scanOffline("RFID1234");
			act(() => vi.advanceTimersByTime(5000)); // the next person, a few seconds later
			await scanOffline("RFID5678");
			await waitFor(() => expect(screen.getByText("2 punches waiting")).toBeTruthy());

			setOnline(true);
			reachable.value = true;
			await act(async () => {
				window.dispatchEvent(new Event("online"));
			});

			await waitFor(() => expect(screen.queryByText(/waiting/)).toBeNull());
			const synced = callsTo(fetch, SYNC).at(-1)!["punches"] as { badge: string }[];
			expect(synced.map((punch) => punch.badge)).toEqual(["RFID1234", "RFID5678"]);
			expect(screen.queryByText("Offline")).toBeNull();
			expect(await queuedPunches()).toEqual([]);
		});
	});

	it("reloads every hour", async () => {
		await openApp(server());

		act(() => vi.advanceTimersByTime(60 * 60 * 1000));

		expect(reloadPage).toHaveBeenCalledOnce();
	});

	it("stops its timers when it goes", async () => {
		const { unmount } = await openApp(server());
		await scan("RFID1234");

		unmount();
		act(() => vi.advanceTimersByTime(2 * 60 * 60 * 1000));

		expect(reloadPage).not.toHaveBeenCalled();
	});
});
