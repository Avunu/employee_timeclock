// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// A stand-in for the frappe server: what fetch answers a kiosk call with.

import { vi } from "vitest";

/** A frappe response body for frappe.throw(message). */
export function thrown(message: string): Record<string, unknown> {
	return { _server_messages: JSON.stringify([JSON.stringify({ message })]) };
}

/** A fetch Response with this status and JSON body (or a body that isn't JSON, with `undefined`). */
export function respond(status: number, body?: unknown, statusText = ""): Response {
	return new Response(body === undefined ? "not json" : JSON.stringify(body), { status, statusText });
}

/** Stub fetch with `answer`, and return the stub to read its calls from. */
export function stubFetch(answer: (method: string, args: Record<string, unknown>) => Promise<Response>) {
	const fetch = vi.fn((url: string, init: RequestInit) =>
		answer(url.replace("/api/method/", ""), JSON.parse(String(init.body)) as Record<string, unknown>),
	);
	vi.stubGlobal("fetch", fetch);
	return fetch;
}
