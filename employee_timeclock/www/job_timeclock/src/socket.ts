// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { io, type Socket } from "socket.io-client";

/**
 * A connection to frappe's realtime server, on the site's namespace, signed in by the session
 * cookie. Behind a proxy it shares the page's own address; on a dev bench, the page has a port of
 * its own and socket.io listens on another.
 */
export function connectSocket(): Socket {
	const boot = window.kiosk_boot;
	const site = boot?.sitename ?? window.location.hostname;
	const port = String(boot?.socketio_port ?? 9000);
	const { hostname, port: pagePort, protocol } = window.location;
	const scheme = protocol === "https:" ? "wss" : "ws";
	const url = pagePort && port !== pagePort ? `${scheme}://${hostname}:${port}/${site}` : `/${site}`;
	return io(url, { withCredentials: true, reconnectionAttempts: 10, reconnectionDelay: 2000 });
}
