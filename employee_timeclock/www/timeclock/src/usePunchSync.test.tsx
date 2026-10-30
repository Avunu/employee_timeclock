// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { forgetPunches, queuePunch, queuedPunches, type QueuedPunch, usePunchSync } from "./usePunchSync";
import { act, renderHook, waitFor } from "@testing-library/react";
import { serverNow } from "../../shared/clock";
import { reloadPage } from "../../shared/navigate";
import { useSession } from "../../shared/session";
import { respond, stubFetch, thrown } from "../../shared/test/server";
import { SYNC_INTERVAL_MS } from "../../shared/useQueueSync";
import { Frappe } from "../../shared/test/Frappe";

const stored = (id: string, time: string, extra: Partial<QueuedPunch> = {}): QueuedPunch => ({
	id,
	badge: `BADGE-${id}`,
	time,
	...extra,
});

describe("the punch queue", () => {
	it("is empty to begin with", async () => {
		await expect(queuedPunches()).resolves.toEqual([]);
	});

	it("keeps punches, and hands them back oldest first", async () => {
		await queuePunch(stored("b", "2026-10-27 09:00:00"));
		await queuePunch(stored("a", "2026-10-27 07:00:00", { log_type: "IN", manual: 1 }));

		await expect(queuedPunches()).resolves.toEqual([
			stored("a", "2026-10-27 07:00:00", { log_type: "IN", manual: 1 }),
			stored("b", "2026-10-27 09:00:00"),
		]);
	});

	it("forgets the punches it's told to, and keeps the rest", async () => {
		await queuePunch(stored("a", "2026-10-27 07:00:00"));
		await queuePunch(stored("b", "2026-10-27 08:00:00"));
		await queuePunch(stored("c", "2026-10-27 09:00:00"));

		await forgetPunches(["a", "c", "never-queued"]);

		expect((await queuedPunches()).map((kept) => kept.id)).toEqual(["b"]);
	});

	it("won't keep the same punch twice", async () => {
		await queuePunch(stored("a", "2026-10-27 07:00:00"));

		await expect(queuePunch(stored("a", "2026-10-27 07:00:00"))).rejects.toThrow();
		await expect(queuedPunches()).resolves.toHaveLength(1);
	});

	it("passes on a failure to open the store", async () => {
		const refused = new DOMException("blocked", "SecurityError");
		vi.stubGlobal("indexedDB", {
			open: () => {
				const request = Object.assign(new EventTarget(), { error: refused });
				queueMicrotask(() => request.dispatchEvent(new Event("error")));
				return request;
			},
		});

		await expect(queuedPunches()).rejects.toBe(refused);
	});
});

vi.mock("../../shared/navigate", () => ({ goTo: vi.fn(), reloadPage: vi.fn() }));
vi.mock("../../shared/session", () => ({ useSession: vi.fn() }));

const SERVER_TIME = "2026-10-27 12:00:00";

const punch = (id: string, time = `2026-10-27 07:${id.padStart(2, "0").slice(-2)}:00`): QueuedPunch => ({
	id,
	badge: "RFID1234",
	time,
});

/** The server: records every punch it's sent, except those in `unanswered`. */
function server(unanswered: string[] = []) {
	return stubFetch(async (_method, args) => {
		const punches = args["punches"] as QueuedPunch[];
		return respond(200, {
			message: {
				results: punches
					.filter(({ id }) => !unanswered.includes(id))
					.map(({ id }) => ({ id, status: "recorded" })),
				server_time: SERVER_TIME,
			},
		});
	});
}

const sentBatches = (fetch: ReturnType<typeof stubFetch>) =>
	fetch.mock.calls.map(([, init]) => (JSON.parse(String(init.body)) as { punches: QueuedPunch[] }).punches);

function setOnline(online: boolean): void {
	Object.defineProperty(navigator, "onLine", { value: online, configurable: true });
}

describe("usePunchSync", () => {
	const recordActivity = vi.fn();

	beforeEach(() => {
		vi.mocked(useSession).mockReturnValue({ recordActivity, reportForbidden: vi.fn() });
		recordActivity.mockClear();
		vi.mocked(reloadPage).mockClear();
	});

	afterEach(() => setOnline(true));

	/** Render the hook and let its first sync finish. */
	async function synced(fetch: ReturnType<typeof stubFetch>) {
		const hook = renderHook(() => usePunchSync(), { wrapper: Frappe });
		await waitFor(() => expect(fetch).toHaveBeenCalled());
		await act(async () => {});
		return hook;
	}

	it("syncs when the page loads, even with nothing queued, to keep the clock and session", async () => {
		const fetch = server();
		const { result } = await synced(fetch);

		await waitFor(() => expect(recordActivity).toHaveBeenCalled());
		expect(sentBatches(fetch)).toEqual([[]]);
		expect(serverNow()).toMatch(/^2026-10-27 12:00:0\d$/);
		expect(result.current).toMatchObject({ online: true, waiting: 0 });
	});

	it("sends the queued punches oldest first, and forgets what the server dealt with", async () => {
		await queuePunch(punch("2"));
		await queuePunch(punch("1"));
		await queuePunch(punch("3"));
		const fetch = server(["3"]);

		const { result } = await synced(fetch);

		expect(sentBatches(fetch)[0]!.map(({ id }) => id)).toEqual(["1", "2", "3"]);
		expect((await queuedPunches()).map(({ id }) => id)).toEqual(["3"]);
		await waitFor(() => expect(result.current.waiting).toBe(1));
	});

	it("sends a long queue in batches of 100", async () => {
		const two = (value: number) => String(value).padStart(2, "0");
		await Promise.all(
			Array.from({ length: 150 }, (_, n) =>
				queuePunch(punch(String(n), `2026-10-27 07:${two(Math.floor(n / 60))}:${two(n % 60)}`)),
			),
		);
		const fetch = server();

		await synced(fetch);
		await waitFor(() => expect(sentBatches(fetch).map((batch) => batch.length)).toEqual([100, 50]));

		await waitFor(async () => expect(await queuedPunches()).toEqual([]));
	});

	it("goes offline, keeping everything, when the server can't be reached", async () => {
		await queuePunch(punch("1"));
		const fetch = stubFetch(async () => {
			throw new TypeError("Failed to fetch");
		});

		const { result } = await synced(fetch);

		await waitFor(() => expect(result.current).toMatchObject({ online: false, waiting: 1 }));
		expect(await queuedPunches()).toHaveLength(1);
		expect(reloadPage).not.toHaveBeenCalled();
	});

	it.each([400, 403])("reloads for a fresh session and CSRF token on a %i", async (status) => {
		const fetch = stubFetch(async () => respond(status, thrown("Invalid Request")));

		await synced(fetch);

		await waitFor(() => expect(reloadPage).toHaveBeenCalledOnce());
	});

	it("tries again later on any other refusal, like the rate limit", async () => {
		await queuePunch(punch("1"));
		const fetch = stubFetch(async () => respond(429, thrown("Too many requests")));

		const { result } = await synced(fetch);

		expect(reloadPage).not.toHaveBeenCalled();
		await waitFor(() => expect(result.current.waiting).toBe(1));
	});

	it("starts out offline when the browser is", async () => {
		setOnline(false);
		stubFetch(() => new Promise(() => {}));

		const { result } = renderHook(() => usePunchSync(), { wrapper: Frappe });

		expect(result.current.online).toBe(false);
	});

	it("syncs again when the browser comes back online, and goes offline when it drops", async () => {
		const fetch = server();
		const { result } = await synced(fetch);

		await act(async () => {
			window.dispatchEvent(new Event("offline"));
		});
		expect(result.current.online).toBe(false);

		await act(async () => {
			window.dispatchEvent(new Event("online"));
		});
		await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
		await waitFor(() => expect(result.current.online).toBe(true));
	});

	it("syncs every minute", async () => {
		// Captured rather than faked: waitFor polls on timers of its own.
		const every = vi.spyOn(window, "setInterval");
		const fetch = server();
		await synced(fetch);
		const [tick, ms] = every.mock.calls.find(([, delay]) => delay === SYNC_INTERVAL_MS)!;

		await act(async () => (tick as () => void)());

		expect(ms).toBe(60 * 1000);
		await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
	});

	it("doesn't start a second sync while one is still out", async () => {
		let answer: (response: Response) => void = () => {};
		const fetch = stubFetch(() => new Promise((resolve) => (answer = resolve)));
		renderHook(() => usePunchSync(), { wrapper: Frappe });
		await waitFor(() => expect(fetch).toHaveBeenCalledOnce());

		await act(async () => {
			window.dispatchEvent(new Event("online"));
		});
		expect(fetch).toHaveBeenCalledOnce();

		await act(async () => answer(respond(200, { message: { results: [], server_time: SERVER_TIME } })));
	});

	it("keeps a punch the kiosk couldn't send, and counts it", async () => {
		const fetch = server();
		const { result } = await synced(fetch);

		await act(() => result.current.keep(punch("1")));

		expect(result.current).toMatchObject({ online: false, waiting: 1 });
		expect(await queuedPunches()).toEqual([punch("1")]);
	});

	it("stops syncing when the page goes", async () => {
		const every = vi.spyOn(window, "setInterval");
		const stop = vi.spyOn(window, "clearInterval");
		const fetch = server();
		const { unmount } = await synced(fetch);
		const id =
			every.mock.results[every.mock.calls.findIndex(([, delay]) => delay === SYNC_INTERVAL_MS)]!.value;

		unmount();
		window.dispatchEvent(new Event("online"));
		await act(async () => {});

		expect(stop).toHaveBeenCalledWith(id);
		expect(fetch).toHaveBeenCalledOnce();
	});
});
