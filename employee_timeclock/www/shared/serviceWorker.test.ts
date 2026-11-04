// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { afterEach, describe, expect, it, vi } from "vitest";
import { registerServiceWorker } from "./serviceWorker";

/** Give the browser a service worker container whose register() does `register`. */
function stubServiceWorker(register: () => Promise<unknown>, controller: object | null = {}) {
	const postMessage = vi.fn();
	const container = {
		register: vi.fn(register),
		controller,
		ready: Promise.resolve({ active: { postMessage } }),
		postMessage,
	};
	Object.defineProperty(navigator, "serviceWorker", { value: container, configurable: true });
	return container;
}

const loaded = () => window.dispatchEvent(new Event("load"));

describe("registerServiceWorker", () => {
	afterEach(() => {
		Reflect.deleteProperty(navigator, "serviceWorker");
		window.history.replaceState(null, "", "/timeclock");
	});

	it("registers the page's own worker, scoped to the page, once the page has loaded", async () => {
		const container = stubServiceWorker(async () => ({}));

		registerServiceWorker();
		expect(container.register).not.toHaveBeenCalled();
		loaded();

		expect(container.register).toHaveBeenCalledExactlyOnceWith("/timeclock/sw.js", { scope: "/timeclock" });
	});

	it("drops a trailing slash from the page's address", () => {
		window.history.replaceState(null, "", "/timeclock/");
		const container = stubServiceWorker(async () => ({}));

		registerServiceWorker();
		loaded();

		expect(container.register).toHaveBeenCalledWith("/timeclock/sw.js", { scope: "/timeclock" });
	});

	it("hands a new worker what the first visit loaded, so it can keep it", async () => {
		vi.spyOn(performance, "getEntriesByType").mockReturnValue([
			{ name: "http://localhost:8000/assets/employee_timeclock/dist/js/timeclock.bundle.js" },
			{ name: "http://localhost:8000/api/method/frappe.ping" },
			{ name: "https://fonts.example/font.woff2" },
		] as PerformanceEntry[]);
		const container = stubServiceWorker(async () => ({}), null);

		registerServiceWorker();
		loaded();

		await vi.waitFor(() =>
			// toHaveBeenCalledWith: earlier tests' load listeners are still on the window.
			expect(container.postMessage).toHaveBeenCalledWith({
				type: "keep",
				urls: ["/timeclock", "http://localhost:8000/assets/employee_timeclock/dist/js/timeclock.bundle.js"],
			}),
		);
	});

	it("tells a worker that already runs the page nothing: it saw the page load", async () => {
		const container = stubServiceWorker(async () => ({}));

		registerServiceWorker();
		loaded();
		await vi.waitFor(() => expect(container.register).toHaveBeenCalled());
		await Promise.resolve();

		expect(container.postMessage).not.toHaveBeenCalled();
	});

	it("only warns when the worker can't be registered", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const failure = new Error("not allowed");
		stubServiceWorker(async () => {
			throw failure;
		});

		registerServiceWorker();
		loaded();
		await vi.waitFor(() =>
			expect(warn).toHaveBeenCalledWith("Couldn't register the service worker", failure),
		);
	});

	it("does nothing where the browser has no service workers (plain HTTP)", () => {
		const listen = vi.spyOn(window, "addEventListener");

		registerServiceWorker();

		expect(listen).not.toHaveBeenCalled();
	});
});
