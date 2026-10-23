// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/** A call the server answered with an error: its HTTP status and frappe's message, if it sent one. */
export class KioskCallError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = "KioskCallError";
		this.status = status;
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

/** JSON.parse that answers undefined for text that isn't JSON. */
function parseJson(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
}

/**
 * The text of frappe.throw()'s message: `_server_messages` is a JSON list of JSON-encoded
 * `{message}` objects, and the message may hold HTML.
 */
function serverMessage(body: unknown): string {
	const raw = isRecord(body) ? body["_server_messages"] : undefined;
	const entries = typeof raw === "string" ? parseJson(raw) : undefined;
	if (!Array.isArray(entries)) return "";
	const messages = entries.map((entry: unknown) => {
		const parsed = typeof entry === "string" ? parseJson(entry) : undefined;
		return isRecord(parsed) && typeof parsed["message"] === "string" ? parsed["message"] : "";
	});
	return new DOMParser().parseFromString(messages.join(" "), "text/html").body.textContent.trim();
}

/**
 * POST a whitelisted method and return what it returned (frappe's `{message}`, unwrapped).
 *
 * Throws KioskCallError when the server answers with an error, and fetch's own TypeError when
 * there is no answer at all (offline, the server down).
 */
export async function kioskCall<T>(method: string, args: Record<string, unknown> = {}): Promise<T> {
	const response = await fetch(`/api/method/${method}`, {
		method: "POST",
		headers: {
			"X-Frappe-CSRF-Token": window.csrf_token ?? "",
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(args),
	});
	const body: unknown = await response.json().catch(() => undefined);
	if (!response.ok) {
		throw new KioskCallError(
			response.status,
			serverMessage(body) || `${response.status} ${response.statusText}`,
		);
	}
	if (!isRecord(body) || !("message" in body)) {
		throw new KioskCallError(response.status, serverMessage(body) || "The server sent no answer.");
	}
	// The method's own return type, which the caller names: the server is trusted to send it.
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	return body["message"] as T;
}
