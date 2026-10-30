// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { afterEach, describe, expect, it, vi } from "vitest";
import { mountKiosk } from "../../shared/mount";

vi.mock("../../shared/mount", () => ({ mountKiosk: vi.fn() }));

/** The component an entry point mounted (a fresh copy of the module graph, so compared by name). */
async function mounted(load: () => Promise<unknown>): Promise<string> {
	vi.resetModules();
	vi.mocked(mountKiosk).mockClear();
	await load();
	expect(mountKiosk).toHaveBeenCalledOnce();
	return (vi.mocked(mountKiosk).mock.calls[0]![0] as { type: { name: string } }).type.name;
}

describe("the timeclock's entry points", () => {
	afterEach(() => window.history.replaceState(null, "", "/timeclock"));

	it.each([
		["main.tsx", () => import("./main")],
		["public/js/timeclock.bundle.ts", () => import("../../../public/js/timeclock.bundle")],
	])("%s mounts the timeclock app", async (_entry, load) => {
		expect(await mounted(load)).toBe("App");
	});

	it("mounts the NFC probe at ?probe=nfc", async () => {
		window.history.replaceState(null, "", "/timeclock?probe=nfc");

		expect(await mounted(() => import("./main"))).toBe("NfcProbe");
	});
});
