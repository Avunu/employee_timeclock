// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it } from "vitest";
import { KioskCallError, kioskCall } from "./call";
import { respond, stubFetch, thrown } from "./test/server";

/** What kioskCall threw, failing the test if it didn't throw. */
async function failure(call: Promise<unknown>): Promise<KioskCallError> {
	const error: unknown = await call.then(
		() => undefined,
		(reason: unknown) => reason,
	);
	expect(error).toBeInstanceOf(KioskCallError);
	return error as KioskCallError;
}

describe("kioskCall", () => {
	it("posts the args to the method and answers what it returned", async () => {
		window.csrf_token = "csrf-123";
		const fetch = stubFetch(async () => respond(200, { message: { log_type: "IN" } }));

		await expect(kioskCall("employee_timeclock.www.timeclock.punch", { badge: "B1" })).resolves.toEqual({
			log_type: "IN",
		});

		const [url, init] = fetch.mock.calls[0]!;
		expect(url).toBe("/api/method/employee_timeclock.www.timeclock.punch");
		expect(init.method).toBe("POST");
		expect(init.headers).toMatchObject({ "X-Frappe-CSRF-Token": "csrf-123" });
		expect(JSON.parse(String(init.body))).toEqual({ badge: "B1" });
	});

	it("sends no args and an empty CSRF token when it has neither", async () => {
		const fetch = stubFetch(async () => respond(200, { message: null }));

		await expect(kioskCall("a.method")).resolves.toBeNull();

		const [, init] = fetch.mock.calls[0]!;
		expect(init.headers).toMatchObject({ "X-Frappe-CSRF-Token": "" });
		expect(JSON.parse(String(init.body))).toEqual({});
	});

	it("throws frappe.throw()'s message as plain text, with the status", async () => {
		stubFetch(async () => respond(401, thrown("Badge <b>not</b> recognised.")));

		const error = await failure(kioskCall("a.method"));

		expect(error.status).toBe(401);
		expect(error.message).toBe("Badge not recognised.");
		expect(error.name).toBe("KioskCallError");
	});

	it("reads the {message} entries and skips anything else", async () => {
		const body = { _server_messages: JSON.stringify([JSON.stringify({ message: "One." }), "{}", "Two."]) };
		stubFetch(async () => respond(417, body));

		expect((await failure(kioskCall("a.method"))).message).toBe("One.");
	});

	it("falls back to the HTTP status when the error has no message", async () => {
		stubFetch(async () => respond(500, undefined, "Internal Server Error"));

		const error = await failure(kioskCall("a.method"));

		expect(error.status).toBe(500);
		expect(error.message).toBe("500 Internal Server Error");
	});

	it.each([
		["not a string", { _server_messages: 42 }],
		["not JSON", { _server_messages: "{" }],
		["not a list", { _server_messages: JSON.stringify({ message: "x" }) }],
		["a list of non-strings", { _server_messages: JSON.stringify([7]) }],
		["messages that aren't text", { _server_messages: JSON.stringify([JSON.stringify({ message: 3 })]) }],
	])("ignores _server_messages that are %s", async (_shape, body) => {
		stubFetch(async () => respond(403, body, "Forbidden"));

		expect((await failure(kioskCall("a.method"))).message).toBe("403 Forbidden");
	});

	it("throws when a successful answer carries no message", async () => {
		stubFetch(async () => respond(200, { docs: [] }));

		const error = await failure(kioskCall("a.method"));

		expect(error.status).toBe(200);
		expect(error.message).toBe("The server sent no answer.");
	});

	it("throws when a successful answer isn't JSON", async () => {
		stubFetch(async () => respond(200));

		expect((await failure(kioskCall("a.method"))).message).toBe("The server sent no answer.");
	});

	it("shows the server's message on a successful answer with no return value", async () => {
		stubFetch(async () => respond(200, thrown("Saved, but read this.")));

		expect((await failure(kioskCall("a.method"))).message).toBe("Saved, but read this.");
	});

	it("lets fetch's own error through when there's no answer at all", async () => {
		stubFetch(async () => {
			throw new TypeError("Failed to fetch");
		});

		await expect(kioskCall("a.method")).rejects.toThrow(TypeError);
	});
});
