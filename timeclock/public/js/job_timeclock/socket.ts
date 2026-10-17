// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Get or create a socket.io connection to the Frappe realtime server.
 *
 * The connection uses the Frappe site name as the namespace and
 * authenticates via the session cookie (sid).
 */
export function getSocket(): Socket {
	if (socket?.connected) return socket;

	const win = window as Window & { sitename?: string; socketio_port?: number };
	const sitename = win.sitename || window.location.hostname;
	const host = window.location.hostname;
	const port = win.socketio_port ?? 9000;
	const protocol = window.location.protocol === "https:" ? "wss" : "ws";

	// In production behind a reverse proxy the socketio traffic goes
	// through the same origin on /socket.io/.  In dev the socketio
	// server listens on a dedicated port.
	const url =
		window.location.port && String(port) !== window.location.port
			? `${protocol}://${host}:${port}/${sitename}`
			: `/${sitename}`;

	socket = io(url, {
		withCredentials: true,
		reconnectionAttempts: 10,
		reconnectionDelay: 2000,
	});

	return socket;
}
