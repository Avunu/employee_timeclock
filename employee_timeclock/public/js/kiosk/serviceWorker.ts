// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/**
 * Registers the page's service worker, which is what lets the browser install
 * it as an app and keeps its built files on hand (see kiosk-sw.js).
 *
 * The page's own address is its scope. kiosk_pwa.py serves a worker per page
 * at <page>/sw.js and allows it to control exactly that route.
 */
export function registerServiceWorker(): void {
	// Only exists on HTTPS or localhost; elsewhere the page just runs as before.
	if (!("serviceWorker" in navigator)) return;

	const scope = window.location.pathname.replace(/\/+$/, "");
	// After load, so it never competes with the page's own first paint.
	window.addEventListener("load", () => {
		navigator.serviceWorker.register(`${scope}/sw.js`, { scope }).catch((error: unknown) => {
			// The app still works without it; it just can't be installed.
			console.warn("Couldn't register the service worker", error);
		});
	});
}
