// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// The service worker for every kiosk page (employee_timeclock/kiosk_pwa.py
// serves it at /<page>/sw.js, allowed to control just that page).
//
// It does two things, and only two:
//
//  1. Keeps the page's built JS, CSS and images (everything under /assets/)
//     in a cache, so an installed app opens without waiting on them. They are
//     content-hashed, so a cached copy is never the wrong version; it is served
//     at once and refreshed behind the scenes.
//  2. Keeps the last copy of the page itself, so the app still opens when the
//     tablet is off the network: the page then keeps its work until it is
//     back. The page is always fetched fresh when it can be,
//     and only a real page is kept, never a redirect to the login. With no copy
//     kept yet, a plain "offline" screen stands in for the browser's error page.
//     A server error (a deploy, a restart) gets the kept copy too.
//
// The first visit loads before the worker runs, so the page sends it what it
// loaded, to keep (serviceWorker.ts).
//
// It never caches a call to the server: work is queued by the page, which
// has the session and CSRF token to send them. Anything else - /api/, the
// socket - isn't touched at all.
//
// Change CACHE's name when this logic changes, so old caches are dropped.

const CACHE = "employee-timeclock-kiosk-v4";

const OFFLINE_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Offline</title>
<style>
	:root { color-scheme: light dark; }
	body { display: grid; min-height: 100vh; margin: 0; place-items: center; font: 16px/1.5 system-ui, sans-serif; text-align: center; }
	main { max-width: 24rem; padding: 2rem; }
	h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 400; }
	button { margin-top: 1.5rem; padding: 0.75rem 2rem; border: 0; background: #0f62fe; color: #fff; font: inherit; }
</style>
</head>
<body>
<main>
	<h1>You're offline</h1>
	<p>This app has to be opened once with a connection. Reconnect, then try again.</p>
	<button type="button" onclick="location.reload()">Try again</button>
</main>
</body>
</html>`;

self.addEventListener("install", () => {
	// Take over at once instead of waiting for every open tab to close: a
	// station browser can stay open for a whole shift.
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			const names = await caches.keys();
			await Promise.all(
				names
					.filter((name) => name !== CACHE && name.startsWith("employee-timeclock-kiosk-"))
					.map((name) => caches.delete(name)),
			);
			await self.clients.claim();
		})(),
	);
});

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (request.method !== "GET") return;

	if (request.mode === "navigate") {
		event.respondWith(loadPage(request));
		return;
	}

	const url = new URL(request.url);
	if (url.origin === self.location.origin && url.pathname.startsWith("/assets/")) {
		event.respondWith(staleWhileRevalidate(event));
	}
});

self.addEventListener("message", (event) => {
	if (event.data?.type === "keep") event.waitUntil(keep(event.data.urls));
});

/** Keep the page and the built files it loaded before this worker was running. */
async function keep(urls) {
	const cache = await caches.open(CACHE);
	const scope = new URL(self.registration.scope).pathname.replace(/\/+$/, "");
	await Promise.all(
		urls.map(async (url) => {
			const target = new URL(url, self.location.origin);
			const isPage = target.pathname.replace(/\/+$/, "") === scope;
			if (target.origin !== self.location.origin) return;
			if (!isPage && !target.pathname.startsWith("/assets/")) return;
			try {
				const response = await fetch(target.href);
				if (response.ok && !response.redirected) {
					await cache.put(isPage ? target.pathname : target.href, response);
				}
			} catch {
				// Offline already: the next visit keeps them instead.
			}
		}),
	);
}

async function loadPage(request) {
	const cache = await caches.open(CACHE);
	// One copy of the page, whatever its query string.
	const page = new URL(request.url).pathname;
	try {
		const response = await fetch(request);
		if (response.ok && !response.redirected) await cache.put(page, response.clone());
		// A server that answers but can't serve the page is no better than none: the kept page
		// carries on, and keeps trying to sync, until it's back.
		if (response.status < 500) return response;
		return (await cache.match(page)) ?? response;
	} catch {
		const kept = await cache.match(page);
		return (
			kept ??
			new Response(OFFLINE_PAGE, {
				status: 503,
				headers: { "Content-Type": "text/html; charset=utf-8" },
			})
		);
	}
}

async function staleWhileRevalidate(event) {
	const cache = await caches.open(CACHE);
	const cached = await cache.match(event.request);
	const refreshed = fetch(event.request).then((response) => {
		if (response.ok) cache.put(event.request, response.clone());
		return response;
	});
	if (!cached) return refreshed;
	// Answer from the cache now; the refresh carries on in the background, and
	// waitUntil keeps the worker alive for it. An offline refresh just fails.
	event.waitUntil(refreshed.catch(() => {}));
	return cached;
}
