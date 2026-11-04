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

type Answer = (method: string, args: Record<string, unknown>) => Promise<Response>;

/** Stub the browser's XMLHttpRequest, which the SDK's axios sends through, with `answer`, and
 * return a mock to read the calls from. An `answer` that throws is a call that got no response. */
export function stubFetch(answer: Answer) {
	const received = vi.fn((url: string, init: { body: string }) =>
		answer(
			url.split("?")[0]!.replace("/api/method/", ""),
			init.body ? (JSON.parse(init.body) as Record<string, unknown>) : {},
		),
	);

	class FakeRequest {
		url = "";
		status = 0;
		statusText = "";
		responseText = "";
		responseURL = "";
		readyState = 1;
		timeout = 0;
		withCredentials = false;
		onloadend: (() => void) | null = null;
		onerror: (() => void) | null = null;
		onabort = null;
		ontimeout = null;
		get response(): string {
			return this.responseText;
		}
		open(_method: string, url: string): void {
			this.url = url;
		}
		setRequestHeader(): void {}
		addEventListener(): void {}
		getAllResponseHeaders(): string {
			return "";
		}
		abort(): void {}
		send(body?: string): void {
			received(this.url, { body: body ?? "" }).then(
				async (response) => {
					this.status = response.status;
					this.statusText = response.statusText;
					this.responseText = await response.text();
					this.readyState = 4;
					this.onloadend?.();
				},
				() => this.onerror?.(),
			);
		}
	}

	vi.stubGlobal("XMLHttpRequest", FakeRequest);
	return received;
}
