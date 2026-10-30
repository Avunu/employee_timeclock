// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it, vi } from "vitest";
import { mountKiosk } from "../../../public/js/kiosk/mount";

vi.mock("../../../public/js/kiosk/mount", () => ({ mountKiosk: vi.fn() }));

describe("the tracker's entry points", () => {
	it.each([
		["main.tsx", () => import("./main")],
		["public/js/job-timeclock.bundle.ts", () => import("../../../public/js/job-timeclock.bundle")],
	])("%s mounts the tracker", async (_entry, load) => {
		vi.resetModules();
		vi.mocked(mountKiosk).mockClear();

		await load();

		expect(mountKiosk).toHaveBeenCalledOnce();
	});
});
