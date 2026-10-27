// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it, vi } from "vitest";
import { forgetPunches, type QueuedPunch, queuePunch, queuedPunches } from "./punchQueue";

const punch = (id: string, time: string, extra: Partial<QueuedPunch> = {}): QueuedPunch => ({
	id,
	badge: `BADGE-${id}`,
	time,
	...extra,
});

describe("the punch queue", () => {
	it("is empty to begin with", async () => {
		await expect(queuedPunches()).resolves.toEqual([]);
	});

	it("keeps punches, and hands them back oldest first", async () => {
		await queuePunch(punch("b", "2026-10-27 09:00:00"));
		await queuePunch(punch("a", "2026-10-27 07:00:00", { log_type: "IN", manual: 1 }));

		await expect(queuedPunches()).resolves.toEqual([
			punch("a", "2026-10-27 07:00:00", { log_type: "IN", manual: 1 }),
			punch("b", "2026-10-27 09:00:00"),
		]);
	});

	it("forgets the punches it's told to, and keeps the rest", async () => {
		await queuePunch(punch("a", "2026-10-27 07:00:00"));
		await queuePunch(punch("b", "2026-10-27 08:00:00"));
		await queuePunch(punch("c", "2026-10-27 09:00:00"));

		await forgetPunches(["a", "c", "never-queued"]);

		expect((await queuedPunches()).map((kept) => kept.id)).toEqual(["b"]);
	});

	it("won't keep the same punch twice", async () => {
		await queuePunch(punch("a", "2026-10-27 07:00:00"));

		await expect(queuePunch(punch("a", "2026-10-27 07:00:00"))).rejects.toThrow();
		await expect(queuedPunches()).resolves.toHaveLength(1);
	});

	it("passes on a failure to open the store", async () => {
		const refused = new DOMException("blocked", "SecurityError");
		vi.stubGlobal("indexedDB", {
			open: () => {
				const request = Object.assign(new EventTarget(), { error: refused });
				queueMicrotask(() => request.dispatchEvent(new Event("error")));
				return request;
			},
		});

		await expect(queuedPunches()).rejects.toBe(refused);
	});
});
