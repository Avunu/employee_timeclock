// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it, vi } from "vitest";
import { mountKiosk } from "../../../public/js/kiosk/mount";

vi.mock("../../../public/js/kiosk/mount", () => ({ mountKiosk: vi.fn() }));

describe("the timeclock's entry points", () => {
	it.each([
		["main.tsx", () => import("./main")],
		["public/js/timeclock.bundle.ts", () => import("../../../public/js/timeclock.bundle")],
	])("%s mounts the timeclock app", async (_entry, load) => {
		vi.resetModules();
		vi.mocked(mountKiosk).mockClear();

		await load();

		expect(mountKiosk).toHaveBeenCalledOnce();
		// A fresh copy of the module graph, so App is compared by name, not identity.
		const element = vi.mocked(mountKiosk).mock.calls[0]![0] as { type: { name: string } };
		expect(element.type.name).toBe("App");
	});
});
