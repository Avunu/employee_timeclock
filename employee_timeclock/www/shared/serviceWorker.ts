// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/**
 * Registers the page's service worker, which is what lets the browser install
 * it as an app and keeps its built files on hand (see kiosk-sw.js).
 *
 * The page's own address is its scope. kiosk_pwa.py serves a worker per page
 * at <page>/sw.js and allows it to control exactly that route.
 */
/** The built files (under /assets/) the page has loaded from its own site. */
function builtFiles(): string[] {
	return performance
		.getEntriesByType("resource")
		.map((entry) => entry.name)
		.filter((url) => {
			const { origin, pathname } = new URL(url);
			return origin === window.location.origin && pathname.startsWith("/assets/");
		});
}

export function registerServiceWorker(): void {
	// Only exists on HTTPS or localhost; elsewhere the page just runs as before.
	if (!("serviceWorker" in navigator)) return;

	const scope = window.location.pathname.replace(/\/+$/, "");
	// After load, so it never competes with the page's own first paint.
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register(`${scope}/sw.js`, { scope })
			.then(async () => {
				// The first time, the page and its files loaded before the worker was running, so it
				// saw none of them: hand it the list, so the app opens offline after one visit.
				if (navigator.serviceWorker.controller) return;
				const { active } = await navigator.serviceWorker.ready;
				// A worker's postMessage has no target origin: that's window.postMessage.
				// oxlint-disable-next-line unicorn/require-post-message-target-origin
				active?.postMessage({ type: "keep", urls: [window.location.pathname, ...builtFiles()] });
			})
			.catch((error: unknown) => {
				// The app still works without it; it just can't be installed.
				console.warn("Couldn't register the service worker", error);
			});
	});
}
