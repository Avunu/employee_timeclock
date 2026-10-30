// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { goTo } from "../../shared/navigate";
import { SessionProvider } from "../../shared/session";
import { Frappe } from "../../shared/test/Frappe";
import { ToastProvider } from "../../shared/Toasts";
import { App } from "./App";
import { queuedEvents, recallEmployee, SESSION_KEY } from "./offline";
import { BADGE, operation, trackerServer, type TrackerServer, workOrder } from "./test/tracker";

vi.mock("../../shared/navigate", () => ({ goTo: vi.fn(), reloadPage: vi.fn() }));

const socket = { on: vi.fn(), off: vi.fn() };

function setOnline(online: boolean): void {
	vi.spyOn(navigator, "onLine", "get").mockReturnValue(online);
}

/** Let what's in flight land. IndexedDB's stand-in runs on real immediates, not the fake timers. */
async function settle(): Promise<void> {
	await act(async () => {
		for (let turn = 0; turn < 12; turn++) {
			await vi.advanceTimersByTimeAsync(1);
			await new Promise((resolve) => {
				(globalThis as unknown as { setImmediate: (run: (value?: unknown) => void) => void }).setImmediate(
					resolve,
				);
			});
		}
	});
}

const Page = () => (
	<Frappe socket={socket}>
		<SessionProvider>
			<ToastProvider>
				<App />
			</ToastProvider>
		</SessionProvider>
	</Frappe>
);

async function open(): Promise<void> {
	render(<Page />);
	await settle();
}

async function scan(badge: string): Promise<void> {
	window.onScan?.simulate(document, badge);
	await settle();
	await settle();
}

/** A promise that needs IndexedDB's stand-in to run. */
async function settled<T>(promise: Promise<T>): Promise<T> {
	let value: T;
	await act(async () => {
		value = await promise;
	});
	return value!;
}

const socketEvent = (name: string) =>
	socket.on.mock.calls.findLast(([event]) => event === name)?.[1] as (update?: unknown) => void;

const button = (name: string | RegExp) => screen.getAllByRole("button", { name }).at(-1)!;

async function tap(name: string | RegExp): Promise<void> {
	fireEvent.click(button(name));
	await settle();
}

async function openWorkOrder(name: string): Promise<void> {
	fireEvent.click(document.querySelector(`[data-work-order="${name}"] .jt-card`)!);
	await settle();
}

async function goOffline(server: TrackerServer): Promise<void> {
	setOnline(false);
	server.reachable = false;
	await act(async () => {
		window.dispatchEvent(new Event("offline"));
	});
	await settle();
}

async function comeBack(server: TrackerServer): Promise<void> {
	setOnline(true);
	server.reachable = true;
	await act(async () => {
		window.dispatchEvent(new Event("online"));
	});
	await settle();
	await settle();
}

describe("the job tracker", () => {
	beforeEach(() => {
		vi.useFakeTimers({
			now: new Date(2026, 9, 23, 14, 0),
			toFake: ["Date", "setTimeout", "clearTimeout", "setInterval", "clearInterval"],
		});
		setOnline(true);
		socket.on.mockClear();
		socket.off.mockClear();
		vi.mocked(goTo).mockClear();
		Element.prototype.scrollIntoView = vi.fn();
		// The real digest runs on another thread, past what fake timers can wait for.
		vi.spyOn(crypto.subtle, "digest").mockImplementation(
			async (_algorithm, data) => (data as Uint8Array<ArrayBuffer>).buffer,
		);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("signing in", () => {
		it("waits for a badge, and links to the old tracker", async () => {
			trackerServer();
			await open();

			expect(screen.getByText("Scan your badge to start tracking time.")).toBeTruthy();
			expect(screen.getByRole("link", { name: "Use old tracker" }).getAttribute("href")).toBe(
				"/job_timeclock_vue",
			);
		});

		it("signs a badge in and shows the work", async () => {
			const server = trackerServer();
			await open();

			await scan(BADGE);

			expect(screen.getByText("Maria Lopez")).toBeTruthy();
			expect(screen.getByText(/Timeout in 29m/)).toBeTruthy();
			expect(screen.getByText("Item of WO-1")).toBeTruthy();
			expect(server.calls["authenticate_employee"]).toEqual([{ rfid: BADGE }]);
		});

		it("refuses a badge it doesn't know", async () => {
			trackerServer();
			await open();

			await scan("UNKNOWN1");

			expect(screen.getByText("Badge not recognised.")).toBeTruthy();
			expect(screen.getByText("Scan your badge to start tracking time.")).toBeTruthy();
		});

		it("switches to whoever scans next", async () => {
			const server = trackerServer({ badges: [BADGE, "RFID5678"] });
			await open();
			await scan(BADGE);

			await scan("RFID5678");

			expect(server.calls["authenticate_employee"]).toHaveLength(2);
		});

		it("takes the page's own user when it is an employee", async () => {
			trackerServer({ sessionEmployee: { employee_id: "HR-EMP-2", employee_name: "Sam Okafor" } });
			await open();

			expect(screen.getByText("Sam Okafor")).toBeTruthy();
			expect(screen.queryByText(/Timeout in/)).toBeNull();
			expect((await settled(recallEmployee(SESSION_KEY)))?.employee_name).toBe("Sam Okafor");
		});

		it("signs out by the button", async () => {
			trackerServer();
			await open();
			await scan(BADGE);

			await tap("Sign Out");

			expect(screen.getByText("Maria Lopez switched user.")).toBeTruthy();
			expect(screen.getByText("Scan your badge to start tracking time.")).toBeTruthy();
		});

		it("ends the session when the token runs out", async () => {
			trackerServer();
			await open();
			await scan(BADGE);

			await act(async () => {
				await vi.advanceTimersByTimeAsync(31 * 60 * 1000);
			});

			expect(screen.getByText("Scan your badge to start tracking time.")).toBeTruthy();
		});

		it("ends the session when the server no longer takes the token", async () => {
			trackerServer({ deadFor: ["get_operations"] });
			await open();
			await scan(BADGE);

			await openWorkOrder("WO-1");

			expect(screen.getByText("Scan your badge to start tracking time.")).toBeTruthy();
		});

		it.each(["get_operations", "start_timer"])(
			"ends the session on a 401 from %s, with no toast",
			async (method) => {
				trackerServer({ statusFor: { [method]: 401 } });
				await open();
				await scan(BADGE);

				await openWorkOrder("WO-1");
				if (screen.queryByRole("button", { name: "Start Timer" })) await tap("Start Timer");

				expect(screen.getByText("Scan your badge to start tracking time.")).toBeTruthy();
				expect(screen.queryByText(/failed/)).toBeNull();
			},
		);

		it("ends the session when a timer's token is no longer good", async () => {
			trackerServer({ deadFor: ["start_timer"] });
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");

			await tap("Start Timer");

			expect(screen.getByText("Scan your badge to start tracking time.")).toBeTruthy();
		});

		it("reloads the page when the server forbids a read", async () => {
			trackerServer({ statusFor: { get_operations: 403 } });
			await open();
			await scan(BADGE);

			await openWorkOrder("WO-1");

			expect(goTo).toHaveBeenCalled();
		});

		it("says nothing when a read finds the server gone", async () => {
			const server = trackerServer();
			await open();
			await scan(BADGE);
			server.reachable = false;

			await openWorkOrder("WO-1");

			expect(screen.queryByText(/get_operations/)).toBeNull();
			expect(screen.getByText("Weld")).toBeTruthy();
		});
	});

	describe("waking from sleep", () => {
		const wake = async () => {
			vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
			await act(async () => {
				document.dispatchEvent(new Event("visibilitychange"));
			});
			await settle();
		};

		it("refreshes the screen if the session is still good", async () => {
			const server = trackerServer();
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			server.calls = {};

			await wake();

			expect(server.calls["get_active_timer"]).toHaveLength(1);
			expect(server.calls["get_offline_snapshot"]).toHaveLength(1);
			expect(server.calls["get_operations"]).toHaveLength(1);
		});
	});

	describe("timers", () => {
		const start = async (server: TrackerServer) => {
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			return server;
		};

		it("starts and stops a timer", async () => {
			const server = await start(trackerServer());

			await tap("Start Timer");

			const started = server.calls["start_timer"]?.[0];
			expect(started).toMatchObject({ work_order: "WO-1", operation: "Weld", is_corrective: false });
			expect(started?.["event_id"]).toMatch(/^[\da-f-]{36}$/);
			expect(button("Stop Timer")).toBeTruthy();

			server.calls = {};
			await tap("Stop Timer");

			expect(server.calls["stop_timer"]).toHaveLength(1);
			expect(server.calls["get_operations"]).toHaveLength(1);
			expect(button("Start Timer")).toBeTruthy();
		});

		it("shows a timer that won't start", async () => {
			await start(trackerServer({ timerError: "No." }));

			await tap("Start Timer");

			expect(screen.getByText("Weld failed to start.")).toBeTruthy();
		});

		it("swaps a running timer for rework, as the server does", async () => {
			const server = await start(trackerServer());
			await tap("Start Timer");

			await tap("Start Rework");

			expect(server.calls["start_timer"]?.[1]).toMatchObject({ is_corrective: true });
			expect(screen.getByText("Rework started for Weld.")).toBeTruthy();
			expect(button("Stop Rework")).toBeTruthy();
			await tap("Stop Rework");
			expect(screen.getByText("Rework completed for Weld.")).toBeTruthy();
		});

		it("shows the running timer in the header and goes to its card", async () => {
			await start(
				trackerServer({
					activeTimer: {
						work_order: "WO-2",
						operation: "Paint",
						from_time: "2026-10-23 13:00:00",
						is_corrective: true,
					},
				}),
			);

			fireEvent.click(document.querySelector(".jt-running")!);
			await settle();

			expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
			expect(button("Stop Rework")).toBeTruthy();
			fireEvent.click(screen.getAllByRole("button", { name: "Stop Rework" })[0]!);
			await settle();
			expect(screen.getByText("Rework completed for Paint.")).toBeTruthy();
		});

		it("deselects a work order tapped again", async () => {
			await start(trackerServer());

			await openWorkOrder("WO-1");

			expect(screen.queryByText("Job Cards")).toBeNull();
		});
	});

	describe("machine timers", () => {
		const machine = operation("Laser", {
			is_machine_time: true,
			employee_group: "Cutters",
		});
		const running = {
			work_order: "WO-1",
			operation: "Laser",
			from_time: "2026-10-23 13:00:00",
			employee_group: "Cutters",
			is_corrective: false,
		};

		it("starts one without touching the employee's own timer", async () => {
			const server = trackerServer({ operations: { "WO-1": [machine] }, groups: ["Cutters"] });
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			server.machineTimers = [running];

			await tap("Start Timer");

			expect(screen.getAllByText(/^01:05:/).length).toBeGreaterThan(0);
			expect(button("Stop Timer")).toBeTruthy();
			expect(button("Stop Machine Timer")).toBeTruthy();
		});

		it("stops one from the bar", async () => {
			const server = trackerServer({
				operations: { "WO-1": [machine] },
				groups: ["Cutters"],
				machineTimers: [running],
			});
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			server.calls = {};

			await tap("Stop Machine Timer");

			expect(server.calls["stop_machine_timer"]?.[0]).toMatchObject({ operation: "Laser" });
			expect(server.calls["get_operations"]).toHaveLength(1);
			expect(screen.queryByRole("button", { name: "Stop Machine Timer" })).toBeNull();
		});

		it("stops one from its card, and shows a failure", async () => {
			const server = trackerServer({
				operations: { "WO-1": [machine] },
				groups: ["Cutters"],
				machineTimers: [running],
			});
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			server.timerError = "No.";

			await tap("Stop Timer");

			expect(screen.getByText("Laser machine timer failed to stop.")).toBeTruthy();
		});

		it("opens a machine timer's work order from the bar", async () => {
			trackerServer({
				operations: { "WO-1": [machine] },
				groups: ["Cutters"],
				machineTimers: [running],
			});
			await open();
			await scan(BADGE);

			fireEvent.click(document.querySelector(".jt-machines .jt-card")!);
			await settle();

			expect(screen.getByText("Job Cards")).toBeTruthy();
			expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
		});

		it("asks the server again when a machine timer changes anywhere", async () => {
			const server = trackerServer({ groups: ["Cutters"] });
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			server.calls = {};
			server.machineTimers = [running];

			await act(async () => socketEvent("machine_timer_update")());
			await settle();

			expect(server.calls["get_operations"]).toHaveLength(1);
			expect(button("Stop Machine Timer")).toBeTruthy();
		});

		it("refetches when the socket connects, and lets go on leaving", async () => {
			const server = trackerServer();
			const { unmount } = render(<Page />);
			await settle();
			await scan(BADGE);
			server.calls = {};

			await act(async () => socketEvent("connect")());
			await settle();
			expect(server.calls["get_machine_timers"]).toHaveLength(1);

			unmount();
			expect(socket.off).toHaveBeenCalled();
		});
	});

	describe("pins and settings", () => {
		it("moves the old tracker's link into Settings once someone is signed in", async () => {
			trackerServer();
			await open();
			await scan(BADGE);

			expect(screen.queryByRole("link", { name: "Use old tracker" })).toBeNull();
			await tap("Settings");

			expect(screen.getByRole("link", { name: "Use old tracker" }).getAttribute("href")).toBe(
				"/job_timeclock_vue",
			);
		});

		it("keeps both panels closed until they're asked for", async () => {
			trackerServer();
			await open();
			await scan(BADGE);

			expect(screen.queryByRole("heading", { name: "Pinned Jobs" })).toBeNull();
			expect(document.querySelector(".jt-panel")).toBeNull();

			await tap("Settings");
			expect(screen.getByRole("heading", { name: "Settings" })).toBeTruthy();
			await tap("Settings");
			expect(document.querySelector(".jt-panel")).toBeNull();
		});

		it("shows pinned jobs beside the work orders, in place of the job cards", async () => {
			trackerServer();
			await open();
			await scan(BADGE);
			const list = document.querySelector(".jt-column")!;
			expect(list.className).not.toContain("jt-column-half");

			await tap(/Pinned Jobs/);

			expect(screen.getByRole("heading", { name: "Pinned Jobs" })).toBeTruthy();
			expect(document.querySelector(".jt-column")!.className).toContain("jt-column-half");

			await openWorkOrder("WO-1");
			expect(screen.queryByRole("heading", { name: "Pinned Jobs" })).toBeNull();
			expect(screen.getByText("Job Cards")).toBeTruthy();

			await tap(/Pinned Jobs/);
			expect(screen.queryByText("Job Cards")).toBeNull();
			await tap(/Pinned Jobs/);
			expect(screen.getByText("Job Cards")).toBeTruthy();
		});

		it("starts a pinned job with another work order selected, and stays on the list", async () => {
			const server = trackerServer();
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			await tap("Pin");
			await openWorkOrder("WO-2");

			await tap(/Pinned Jobs/);
			expect(screen.getByRole("button", { name: "Weld" })).toBeTruthy();
			await tap("Start Timer");

			expect(server.calls["start_timer"]?.[0]).toMatchObject({ work_order: "WO-1", operation: "Weld" });
			expect(screen.getByRole("heading", { name: "Pinned Jobs" })).toBeTruthy();
		});

		it("goes to a pinned job when it is tapped, even at another station", async () => {
			window.localStorage.setItem("pinnedCards", JSON.stringify({ "HR-EMP-1": ["WO-2::Paint"] }));
			window.localStorage.setItem("workstations", JSON.stringify(["Bench"]));
			trackerServer({ operations: { "WO-2": [operation("Paint", { workstation: "Booth" })] } });
			await open();
			await scan(BADGE);
			await tap(/Pinned Jobs/);
			await settle();

			await tap("Paint");

			expect(screen.queryByRole("heading", { name: "Pinned Jobs" })).toBeNull();
			expect(screen.getByText("Job Cards")).toBeTruthy();
			expect(document.querySelector('[data-operation="Paint"]')).toBeTruthy();
			expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2);

			await openWorkOrder("WO-2");
			await openWorkOrder("WO-2");
			expect(document.querySelector('[data-operation="Paint"]')).toBeNull();
		});

		it("shows pinned jobs from what it kept, and unpins", async () => {
			window.localStorage.setItem(
				"pinnedCards",
				JSON.stringify({ "HR-EMP-1": ["WO-1::Weld", "WO-2::Paint", "not a pin", "WO-9::Gone"] }),
			);
			const server = trackerServer();
			await open();
			await scan(BADGE);

			await tap(/Pinned Jobs \(3\)/);

			expect(server.calls["get_operations"]).toBeUndefined();
			expect(screen.getByRole("button", { name: "Paint" })).toBeTruthy();
			fireEvent.click(screen.getAllByRole("button", { name: "Unpin" })[0]!);
			expect(JSON.parse(window.localStorage.getItem("pinnedCards")!)["HR-EMP-1"]).toHaveLength(3);
		});

		it("says when nothing is pinned, and swaps panels", async () => {
			trackerServer();
			await open();
			await scan(BADGE);

			await tap(/Pinned Jobs/);
			expect(screen.getByText(/No pinned job cards yet/)).toBeTruthy();
		});

		it("keeps this tablet's workstations, shows its address, and filters by them", async () => {
			const server = trackerServer({
				operations: { "WO-1": [operation("Weld"), operation("Spray", { workstation: "Booth" })] },
			});
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			expect(screen.getByText("Spray")).toBeTruthy();

			await tap("Settings");
			expect(server.calls["get_device_info"]).toHaveLength(1);
			expect(screen.getByText("10.0.0.7")).toBeTruthy();
			fireEvent.click(screen.getByLabelText("Bench"));
			await settle();

			expect(JSON.parse(window.localStorage.getItem("workstations")!)).toEqual(["Bench"]);
			expect(screen.queryByText("Spray", { selector: "h3" })).toBeNull();

			fireEvent.click(document.getElementById("jt-my-station")!);
			await settle();
			expect(screen.getByText("Spray", { selector: "h3" })).toBeTruthy();

			fireEvent.click(screen.getByLabelText("Bench"));
			await settle();
			expect(JSON.parse(window.localStorage.getItem("workstations")!)).toEqual([]);
		});
	});

	describe("offline", () => {
		it("keeps working from what it last saw, for an employee it remembers", async () => {
			const server = trackerServer();
			await open();
			await scan(BADGE);
			await tap("Sign Out");
			await goOffline(server);

			await scan(BADGE);

			expect(screen.getByText("Maria Lopez")).toBeTruthy();
			expect(screen.getByText("Offline")).toBeTruthy();
			await openWorkOrder("WO-1");
			expect(screen.getByText("Weld")).toBeTruthy();
		});

		it("accepts a badge it has never seen, unconfirmed and without pins", async () => {
			const server = trackerServer();
			await open();
			await goOffline(server);

			await scan("NEWBADGE");

			expect(screen.getByText("Badge not confirmed")).toBeTruthy();
			await openWorkOrder("WO-1");
			expect(screen.queryByRole("button", { name: "Pin" })).toBeNull();
		});

		it("queues a timer with its badge and time, and shows it running", async () => {
			const server = trackerServer();
			await open();
			await goOffline(server);
			await scan("NEWBADGE");
			await openWorkOrder("WO-1");

			await tap("Start Timer");

			expect(await settled(queuedEvents())).toEqual([
				expect.objectContaining({
					action: "start",
					badge: "NEWBADGE",
					work_order: "WO-1",
					operation: "Weld",
					time: "2026-10-23 14:05:00",
				}),
			]);
			expect(button("Stop Timer")).toBeTruthy();
			expect(screen.getByText("1 timer action waiting")).toBeTruthy();
		});

		it("queues a stop on a timer that was running when the tablet went offline", async () => {
			const server = trackerServer({
				activeTimer: {
					work_order: "WO-1",
					operation: "Weld",
					from_time: "2026-10-23 13:00:00",
					is_corrective: false,
				},
			});
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			await goOffline(server);

			await tap("Stop Timer");

			expect(await settled(queuedEvents())).toEqual([
				expect.objectContaining({ action: "stop", badge: BADGE }),
			]);
			expect(screen.getByRole("button", { name: "Start Timer" })).toBeTruthy();
		});

		it("sends the queue on reconnecting, then refreshes", async () => {
			const server = trackerServer();
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			await goOffline(server);
			await tap("Start Timer");
			await tap("Stop Timer");
			expect(screen.getByText("2 timer actions waiting")).toBeTruthy();
			server.calls = {};

			await comeBack(server);

			const [events] = (server.calls["sync_timer_events"] ?? []).map((call) => call["events"]);
			expect(events).toHaveLength(2);
			expect(await settled(queuedEvents())).toEqual([]);
			expect(screen.queryByText(/waiting/)).toBeNull();
			expect(server.calls["get_active_timer"]).toBeTruthy();
		});

		it("queues behind what is waiting, so nothing overtakes", async () => {
			const server = trackerServer({ statusFor: { sync_timer_events: 500 } });
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			await goOffline(server);
			await tap("Start Timer");
			setOnline(true);
			server.reachable = true;
			await act(async () => {
				window.dispatchEvent(new Event("online"));
			});
			await settle();

			await tap("Stop Timer");

			expect(server.calls["stop_timer"]).toBeUndefined();
			expect(await settled(queuedEvents())).toHaveLength(2);
		});

		it("queues a call whose answer never came, under the same id", async () => {
			const server = trackerServer();
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			server.reachable = false;

			await tap("Start Timer");

			const [event] = await settled(queuedEvents());
			expect(event?.action).toBe("start");
		});

		it("queues a machine start, and shows it running by its group", async () => {
			const machine = operation("Laser", { is_machine_time: true, employee_group: "Cutters" });
			const server = trackerServer({ operations: { "WO-1": [machine] }, groups: ["Cutters"] });
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			await goOffline(server);

			await tap("Start Timer");
			expect(button("Stop Machine Timer")).toBeTruthy();

			await tap("Stop Machine Timer");

			expect((await settled(queuedEvents())).map((event) => event.action)).toEqual(["start", "stop_machine"]);
			expect(screen.queryByRole("button", { name: "Stop Machine Timer" })).toBeNull();
		});

		it("hides another group's machine operations", async () => {
			const machine = operation("Laser", { is_machine_time: true, employee_group: "Cutters" });
			const server = trackerServer({ operations: { "WO-1": [operation("Weld"), machine] } });
			await open();
			await goOffline(server);
			await scan("NEWBADGE");

			await openWorkOrder("WO-1");

			expect(screen.getByText("Weld")).toBeTruthy();
			expect(screen.queryByText("Laser")).toBeNull();
		});

		it("ends an offline sign-in after 30 minutes with nothing done", async () => {
			const server = trackerServer();
			await open();
			await goOffline(server);
			await scan("NEWBADGE");
			await openWorkOrder("WO-1");

			await act(async () => {
				await vi.advanceTimersByTimeAsync(20 * 60 * 1000);
			});
			await tap("Start Timer");
			await act(async () => {
				await vi.advanceTimersByTimeAsync(20 * 60 * 1000);
			});
			expect(screen.getByText("Badge not confirmed")).toBeTruthy();
			await act(async () => {
				await vi.advanceTimersByTimeAsync(11 * 60 * 1000);
			});

			expect(screen.getByText("Scan your badge to start tracking time.")).toBeTruthy();
		});

		it("keeps an employee's own login working offline", async () => {
			const first = trackerServer({
				sessionEmployee: { employee_id: "HR-EMP-2", employee_name: "Sam Okafor" },
			});
			const { unmount } = render(<Page />);
			await settle();
			unmount();
			first.reachable = false;
			setOnline(false);

			await open();
			expect(screen.getByText("Sam Okafor")).toBeTruthy();
			await openWorkOrder("WO-1");
			await tap("Start Timer");

			const [event] = await settled(queuedEvents());
			expect(event?.badge).toBeUndefined();
			expect(screen.queryByText(/Timeout in/)).toBeNull();
		});

		it("works without a snapshot, showing an empty list", async () => {
			const server = trackerServer({ statusFor: { get_offline_snapshot: 500 } });
			await open();
			await goOffline(server);

			await scan("NEWBADGE");

			expect(screen.queryByText("Item of WO-1")).toBeNull();
		});
	});

	describe("when calls fail", () => {
		it("leaves things as they were", async () => {
			trackerServer({
				statusFor: {
					get_active_timer: 500,
					get_machine_timers: 500,
					get_work_orders: 500,
					get_device_info: 500,
					get_workstations: 500,
				},
			});
			await open();
			await scan(BADGE);

			expect(screen.getByText("Maria Lopez")).toBeTruthy();
			await tap("Settings");
		});

		it("doesn't keep a timer the server refused outright", async () => {
			trackerServer({ statusFor: { start_timer: 500 } });
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");

			await tap("Start Rework");

			expect(await settled(queuedEvents())).toEqual([]);
			expect(screen.queryByText(/Rework started/)).toBeNull();
		});

		it("says when a badge can't be read", async () => {
			trackerServer({ statusFor: { authenticate_employee: 500 } });
			await open();

			await scan(BADGE);

			expect(screen.getByText("Scan your badge to start tracking time.")).toBeTruthy();
		});

		it("signs a badge in offline when the server can't be reached after all", async () => {
			const server = trackerServer();
			await open();
			server.reachable = false;

			await scan("NEWBADGE");

			expect(screen.getByText("Badge not confirmed")).toBeTruthy();
		});

		it("copes with answers holding nothing", async () => {
			trackerServer({ sparse: true });
			await open();

			expect(screen.getByRole("button", { name: "Sign Out" })).toBeTruthy();
			expect(screen.queryByText(/Timeout in/)).toBeNull();
			await tap("Sign Out");
			await scan(BADGE);
			expect(screen.getByText("Maria Lopez")).toBeTruthy();
			await scan("UNKNOWN1");
			expect(screen.getByText("Badge not recognised.")).toBeTruthy();
		});

		it("starts a timer from an answer with no clock in it", async () => {
			const server = trackerServer();
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			server.sparse = true;

			await tap("Start Timer");

			expect(button("Stop Timer")).toBeTruthy();
			await openWorkOrder("WO-2");
			expect(document.querySelector('[data-operation="Paint"]')).toBeTruthy(); // as last seen
		});
	});

	describe("leaving things out", () => {
		it("lists no workstations until it has some", async () => {
			trackerServer({ workstations: [] });
			await open();
			await scan(BADGE);

			await tap("Settings");

			expect(screen.getByText("Loading…")).toBeTruthy();
		});

		it("wakes with nothing selected", async () => {
			const server = trackerServer();
			await open();
			await scan(BADGE);
			server.calls = {};
			vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");

			await act(async () => {
				document.dispatchEvent(new Event("visibilitychange"));
			});
			await settle();

			expect(server.calls["get_operations"]).toBeUndefined();
		});

		it("has nothing to say about an unconfirmed badge signing out", async () => {
			const server = trackerServer();
			await open();
			await goOffline(server);
			await scan("NEWBADGE");

			await tap("Sign Out");

			expect(screen.queryByText(/switched user/)).toBeNull();
		});

		it("names a pinned job's work order when it is no longer listed", async () => {
			window.localStorage.setItem("pinnedCards", JSON.stringify({ "HR-EMP-1": ["WO-9::Weld"] }));
			trackerServer({ operations: { "WO-9": [operation("Weld")] } });
			await open();
			await scan(BADGE);

			await tap(/Pinned Jobs/);
			await settle();

			expect(screen.getByText("WO-9")).toBeTruthy();
		});

		it("shows a rework machine timer, and one with no start yet", async () => {
			trackerServer({
				groups: ["Cutters"],
				machineTimers: [
					{ work_order: "WO-1", operation: "Laser", employee_group: "Cutters", is_corrective: true },
				],
			});
			await open();
			await scan(BADGE);

			expect(screen.getByText("Laser (Rework)")).toBeTruthy();
			expect(screen.getByText("00:00:00")).toBeTruthy();
		});

		it("opens a timer's work order even when it has closed, and marks the job", async () => {
			trackerServer({
				groups: ["Cutters"],
				operations: {
					"WO-9": [operation("Laser", { is_machine_time: true, employee_group: "Cutters" })],
				},
				machineTimers: [
					{ work_order: "WO-9", operation: "Laser", employee_group: "Cutters", is_corrective: false },
				],
			});
			await open();
			await scan(BADGE);

			fireEvent.click(document.querySelector(".jt-machines .jt-card")!);
			await settle();

			expect(screen.getByText("Job Cards")).toBeTruthy();
			expect(document.querySelector('[data-operation="Laser"] .jt-card-found')).toBeTruthy();
			expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
		});

		it("doesn't scroll until the job is on screen", async () => {
			trackerServer({
				activeTimer: {
					work_order: "WO-1",
					operation: "Gone",
					from_time: "2026-10-23 13:00:00",
					is_corrective: false,
				},
			});
			await open();
			await scan(BADGE);

			fireEvent.click(document.querySelector(".jt-running")!);
			await settle();

			expect(screen.getByText("Job Cards")).toBeTruthy();
			expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
		});

		it("opens the running timer's job from the header, whatever is selected or filtered", async () => {
			window.localStorage.setItem("workstations", JSON.stringify(["Bench"]));
			trackerServer({
				operations: {
					"WO-1": [operation("Weld")],
					"WO-2": [operation("Paint", { workstation: "Booth" })],
				},
				activeTimer: {
					work_order: "WO-2",
					operation: "Paint",
					from_time: "2026-10-23 13:00:00",
					is_corrective: false,
				},
			});
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");

			fireEvent.click(document.querySelector(".jt-running")!);
			await settle();

			expect(document.querySelector('[data-operation="Paint"] .jt-card-found')).toBeTruthy();
			expect(document.querySelector('[data-operation="Weld"]')).toBeNull();

			await openWorkOrder("WO-1");
			await openWorkOrder("WO-2");
			expect(document.querySelector(".jt-card-found")).toBeNull();
		});

		it("has no job cards offline for a work order it hasn't kept", async () => {
			const server = trackerServer({ operations: {} });
			await open();
			await goOffline(server);
			await scan("NEWBADGE");

			await openWorkOrder("WO-1");

			expect(screen.getByText("Job Cards")).toBeTruthy();
			expect(document.querySelector("[data-operation]")).toBeNull();
		});

		it("keeps a machine operation with no group from everyone, offline", async () => {
			const server = trackerServer({
				operations: { "WO-1": [operation("Laser", { is_machine_time: true })] },
			});
			await open();
			await goOffline(server);
			await scan("NEWBADGE");

			await openWorkOrder("WO-1");

			expect(document.querySelector("[data-operation]")).toBeNull();
		});

		it("queues a machine start with no group", async () => {
			const server = trackerServer({
				operations: { "WO-1": [operation("Laser", { is_machine_time: true })] },
				groups: [""],
			});
			await open();
			await scan(BADGE);
			await openWorkOrder("WO-1");
			await goOffline(server);

			await tap("Start Timer");

			expect((await settled(queuedEvents()))[0]?.machine_group).toBe("");
		});

		it("shows machine timers from what it kept, for the employee's groups", async () => {
			const timer = {
				work_order: "WO-1",
				operation: "Laser",
				from_time: "2026-10-23 13:00:00",
				employee_group: "Cutters",
			};
			const server = trackerServer({
				groups: ["Cutters"],
				machineTimers: [timer, { ...timer, operation: "Press", employee_group: "Others" }],
			});
			await open();
			await scan(BADGE);
			await tap("Sign Out");
			await goOffline(server);

			await scan(BADGE);

			expect(screen.getAllByRole("button", { name: "Stop Machine Timer" })).toHaveLength(1);
		});
	});

	it("shows a work order's time and status", async () => {
		trackerServer({
			workOrders: [
				workOrder("WO-1", { status: "Stopped", planned_time_mins: 60, logged_time_mins: 90 }),
				workOrder("WO-2", { status: "Not Started", planned_time_mins: 60, logged_time_mins: 30 }),
			],
			operations: {
				"WO-1": [
					operation("Weld", {
						planned_time_mins: 60,
						actual_time_mins: 80,
						employee_time_mins: 20,
						corrective_total_time_mins: 10,
						corrective_employee_time_mins: 5,
					}),
					operation("Paint", { is_submitted: true }),
				],
				"WO-2": [operation("Spray", { planned_time_mins: 60, actual_time_mins: 30 })],
			},
		});
		await open();
		await scan(BADGE);

		await openWorkOrder("WO-1");

		expect(screen.getByText("Stopped")).toBeTruthy();
		expect(screen.getByText("1h 30m logged of 1h estimated · +30m overrun")).toBeTruthy();
		expect(screen.getByText("Estimated Time: 1h")).toBeTruthy();
		expect(screen.getByText("+30m overrun")).toBeTruthy();
		expect(screen.getByText("1h 20m logged")).toBeTruthy();
		expect(screen.getByText("10m rework")).toBeTruthy();
		expect(screen.getByRole("button", { name: "Submitted" })).toBeTruthy();

		await openWorkOrder("WO-2");
		expect(screen.getByText("30m logged of 1h estimated")).toBeTruthy();
	});
});
