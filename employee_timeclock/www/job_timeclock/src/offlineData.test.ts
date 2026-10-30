// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it } from "vitest";
import { badgeKey, forgetEvents, queuedEvents, queueEvent, type TimerEvent } from "./offlineData";

const event = (id: string, time: string, order: number): TimerEvent => ({
	id,
	action: "start",
	time,
	order,
	who: "someone",
});

describe("the offline queue", () => {
	it("gives events back oldest first, and those of the same second in the order they came", async () => {
		await queueEvent(event("z", "2026-10-23 10:00:00", 1));
		await queueEvent(event("a", "2026-10-23 10:00:00", 2));
		await queueEvent(event("m", "2026-10-23 09:00:00", 3));

		expect((await queuedEvents()).map(({ id }) => id)).toEqual(["m", "z", "a"]);
	});

	it("forgets what the server dealt with", async () => {
		await queueEvent(event("a", "2026-10-23 10:00:00", 1));
		await queueEvent(event("b", "2026-10-23 10:00:01", 2));

		await forgetEvents(["a"]);

		expect((await queuedEvents()).map(({ id }) => id)).toEqual(["b"]);
	});

	it("keys a badge by a hash, so the badge itself isn't what stays", async () => {
		const key = await badgeKey("RFID1234");

		expect(key).toMatch(/^[\da-f]{64}$/);
		expect(key).toBe(await badgeKey("RFID1234"));
		expect(key).not.toBe(await badgeKey("RFID5678"));
	});
});
