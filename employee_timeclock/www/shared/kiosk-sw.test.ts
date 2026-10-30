// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// The kiosk's service worker (../kiosk-sw.js), loaded into a stand-in for a worker's global scope:
// its listeners are caught as it registers them, then handed fake install/activate/fetch events.

import { beforeEach, describe, expect, it, vi } from "vitest";

type Listener = (event: unknown) => void;

const CACHE = "employee-timeclock-kiosk-v3";

/** What a cache keys a request by: its URL, or the path a page is kept under. */
const keyOf = (request: string | { url: string }) => (typeof request === "string" ? request : request.url);

/** A fake CacheStorage: named caches of url -> Response. */
function fakeCaches(names: string[] = []) {
	const stores = new Map<string, Map<string, Response>>(names.map((name) => [name, new Map()]));
	return {
		stores,
		keys: vi.fn(async () => [...stores.keys()]),
		delete: vi.fn(async (name: string) => stores.delete(name)),
		open: vi.fn(async (name: string) => {
			const store = stores.get(name) ?? new Map<string, Response>();
			stores.set(name, store);
			return {
				match: async (request: string | { url: string }) => store.get(keyOf(request)),
				put: async (request: string | { url: string }, response: Response) =>
					void store.set(keyOf(request), response),
			};
		}),
	};
}

/** An event the worker can respondWith/waitUntil, holding on to what it was given. */
function workerEvent(request?: { method: string; mode: string; url: string }) {
	const event = {
		request,
		responded: undefined as Promise<Response> | undefined,
		waited: [] as Promise<unknown>[],
		respondWith: (response: Promise<Response>) => void (event.responded = response),
		waitUntil: (promise: Promise<unknown>) => void event.waited.push(promise),
	};
	return event;
}

const get = (url: string, mode = "no-cors") => ({ method: "GET", mode, url });

let listeners: Map<string, Listener>;
let caches: ReturnType<typeof fakeCaches>;
let skipWaiting: ReturnType<typeof vi.fn>;
let claim: ReturnType<typeof vi.fn>;

async function loadWorker(cacheNames: string[] = []) {
	listeners = new Map();
	vi.spyOn(self, "addEventListener").mockImplementation((type: string, listener: unknown) => {
		listeners.set(type, listener as Listener);
	});
	caches = fakeCaches(cacheNames);
	skipWaiting = vi.fn();
	claim = vi.fn(async () => {});
	vi.stubGlobal("caches", caches);
	vi.stubGlobal("skipWaiting", skipWaiting);
	vi.stubGlobal("clients", { claim });
	vi.resetModules();
	const worker = "./kiosk-sw.js";
	await import(/* @vite-ignore */ worker);
}

function dispatch(type: string, event: unknown): void {
	listeners.get(type)!(event);
}

describe("the kiosk service worker", () => {
	beforeEach(async () => {
		await loadWorker();
	});

	it("takes over as soon as it's installed", () => {
		dispatch("install", workerEvent());

		expect(skipWaiting).toHaveBeenCalledOnce();
	});

	it("drops its own older caches, and nobody else's, when it activates", async () => {
		await loadWorker(["employee-timeclock-kiosk-v2", CACHE, "little-cocalico-portal-v1"]);
		const event = workerEvent();

		dispatch("activate", event);
		await Promise.all(event.waited);

		expect([...caches.stores.keys()]).toEqual([CACHE, "little-cocalico-portal-v1"]);
		expect(claim).toHaveBeenCalledOnce();
	});

	it("leaves anything but a GET to the network", () => {
		const event = workerEvent({ method: "POST", mode: "cors", url: "http://localhost:8000/api/method/x" });

		dispatch("fetch", event);

		expect(event.responded).toBeUndefined();
	});

	it("loads the page from the network, and keeps a copy for offline", async () => {
		const page = new Response("the timeclock");
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => page),
		);
		const event = workerEvent(get("http://localhost:8000/timeclock", "navigate"));

		dispatch("fetch", event);

		await expect(event.responded).resolves.toBe(page);
		expect(await caches.stores.get(CACHE)!.get("/timeclock")!.text()).toBe("the timeclock");
	});

	it("keeps one copy of the page, whatever its query string", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("the probe")),
		);
		const event = workerEvent(get("http://localhost:8000/timeclock?probe=nfc", "navigate"));

		dispatch("fetch", event);
		await event.responded;

		expect([...caches.stores.get(CACHE)!.keys()]).toEqual(["/timeclock"]);
	});

	it("never keeps a redirect to the login, or an error page", async () => {
		const login = new Response("login");
		Object.defineProperty(login, "redirected", { value: true });
		const failed = new Response("oops", { status: 500 });
		const answers = [login, failed];
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => answers.shift()),
		);
		const events = [1, 2].map(() => workerEvent(get("http://localhost:8000/timeclock", "navigate")));

		for (const event of events) dispatch("fetch", event);

		expect(await Promise.all(events.map((event) => event.responded))).toEqual([login, failed]);
		expect(caches.stores.get(CACHE)!.size).toBe(0);
	});

	it("opens the kept page when the tablet is offline", async () => {
		await (await caches.open(CACHE)).put("/timeclock", new Response("kept timeclock"));
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				throw new TypeError("Failed to fetch");
			}),
		);
		const event = workerEvent(get("http://localhost:8000/timeclock", "navigate"));

		dispatch("fetch", event);

		expect(await (await event.responded!).text()).toBe("kept timeclock");
	});

	it("shows the offline screen when offline with no page kept yet", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				throw new TypeError("Failed to fetch");
			}),
		);
		const event = workerEvent(get("http://localhost:8000/timeclock", "navigate"));

		dispatch("fetch", event);
		const response = await event.responded!;

		expect(response.status).toBe(503);
		expect(response.headers.get("Content-Type")).toBe("text/html; charset=utf-8");
		expect(await response.text()).toContain("You're offline");
	});

	it("fetches and keeps a built file it doesn't have yet", async () => {
		const file = new Response("bundle");
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => file),
		);
		const url = "http://localhost:8000/assets/employee_timeclock/dist/js/timeclock.bundle.ABC.js";
		const event = workerEvent(get(url));

		dispatch("fetch", event);

		await expect(event.responded).resolves.toBe(file);
		expect(caches.stores.get(CACHE)!.has(url)).toBe(true);
		expect(event.waited).toEqual([]);
	});

	it("doesn't keep a failed answer for a built file", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("missing", { status: 404 })),
		);
		const url = "http://localhost:8000/assets/employee_timeclock/dist/js/gone.js";
		const event = workerEvent(get(url));

		dispatch("fetch", event);

		expect((await event.responded!).status).toBe(404);
		expect(caches.stores.get(CACHE)!.has(url)).toBe(false);
	});

	it("answers a kept built file at once, and refreshes it behind the scenes", async () => {
		const url = "http://localhost:8000/assets/employee_timeclock/images/kiosk/timeclock-192.png";
		const kept = new Response("old");
		(await caches.open(CACHE)).put({ url }, kept);
		const fresh = new Response("new");
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => fresh),
		);
		const event = workerEvent(get(url));

		dispatch("fetch", event);

		await expect(event.responded).resolves.toBe(kept);
		await Promise.all(event.waited);
		expect(await caches.stores.get(CACHE)!.get(url)!.text()).toBe("new");
	});

	it("still answers a kept built file when the refresh can't reach the server", async () => {
		const url = "http://localhost:8000/assets/employee_timeclock/dist/css/kiosk.bundle.X.css";
		const kept = new Response("css");
		(await caches.open(CACHE)).put({ url }, kept);
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				throw new TypeError("Failed to fetch");
			}),
		);
		const event = workerEvent(get(url));

		dispatch("fetch", event);

		await expect(event.responded).resolves.toBe(kept);
		await expect(Promise.all(event.waited)).resolves.toBeDefined();
	});

	it.each([
		["a call to the server", "http://localhost:8000/api/method/employee_timeclock.www.timeclock.punch"],
		["another site's assets", "https://cdn.example.com/assets/app.js"],
	])("leaves %s alone", (_what, url) => {
		const event = workerEvent(get(url));

		dispatch("fetch", event);

		expect(event.responded).toBeUndefined();
	});
});
