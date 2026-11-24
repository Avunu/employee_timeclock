// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

declare global {
	interface Window {
		csrf_token?: string;
	}
}

interface FrappeResponse<T> {
	message?: T;
	_server_messages?: string;
}

/** A request the server answered with an error: its HTTP status and frappe's message, if it sent one. */
export class FrappeCallError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = "FrappeCallError";
		this.status = status;
	}
}

/** The first message in frappe's `_server_messages` (a JSON list of JSON objects), as plain text. */
function serverMessage(serverMessages: string | undefined): string | null {
	if (!serverMessages) {
		return null;
	}
	try {
		const messages = JSON.parse(serverMessages) as string[];
		const first = JSON.parse(messages[0]) as { message?: string };
		const element = document.createElement("div");
		element.innerHTML = first.message || "";
		return element.textContent || null;
	} catch {
		return null;
	}
}

export async function frappeCall<T = unknown>(
	method: string,
	args: Record<string, unknown> = {},
): Promise<T> {
	const response = await fetch(`/api/method/${method}`, {
		method: "POST",
		headers: {
			"X-Frappe-CSRF-Token": window.csrf_token || "",
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(args),
	});

	const data: FrappeResponse<T> = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new FrappeCallError(
			response.status,
			serverMessage(data._server_messages) || `Network error: ${response.status} ${response.statusText}`,
		);
	}

	if (data.message !== undefined) {
		return data.message;
	}

	throw new FrappeCallError(response.status, serverMessage(data._server_messages) || "Unknown server error");
}
