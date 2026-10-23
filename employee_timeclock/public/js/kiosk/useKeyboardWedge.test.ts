// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { renderHook } from "@testing-library/react";
import onScanJs from "onscan.js";
import { describe, expect, it, vi } from "vitest";
import { useKeyboardWedge } from "./useKeyboardWedge";

/** Type `keys` the way a scanner does: one keystroke straight after another, then Enter. */
function scan(keys: string[], target: EventTarget = document): void {
	for (const key of keys) target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
	target.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, bubbles: true }));
}

describe("useKeyboardWedge", () => {
	it("hears a badge scanned anywhere on the page", () => {
		const onScan = vi.fn();
		renderHook(() => useKeyboardWedge(onScan));

		scan([..."RFID-2024_7"]);

		expect(onScan).toHaveBeenCalledExactlyOnceWith("RFID-2024_7");
	});

	it("skips keys that type nothing, like Shift", () => {
		const onScan = vi.fn();
		renderHook(() => useKeyboardWedge(onScan));

		scan(["Shift", ..."ABC", "Shift", ..."123"]);

		expect(onScan).toHaveBeenCalledExactlyOnceWith("ABC123");
	});

	it("trims the scan", () => {
		const onScan = vi.fn();
		renderHook(() => useKeyboardWedge(onScan));

		window.onScan?.simulate(document, "  BADGE9  ");

		expect(onScan).toHaveBeenCalledExactlyOnceWith("BADGE9");
	});

	it("leaves keystrokes into a field to the field", () => {
		const onScan = vi.fn();
		renderHook(() => useKeyboardWedge(onScan));
		const input = document.body.appendChild(document.createElement("input"));
		input.focus();

		scan([..."TYPED1"], input);
		input.remove();

		expect(onScan).not.toHaveBeenCalled();
	});

	it("calls the latest callback it was given", () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = renderHook(({ onScan }) => useKeyboardWedge(onScan), {
			initialProps: { onScan: first },
		});

		rerender({ onScan: second });
		scan([..."BADGE7"]);

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledExactlyOnceWith("BADGE7");
	});

	it("stops listening when the page goes", () => {
		const onScan = vi.fn();
		const { unmount } = renderHook(() => useKeyboardWedge(onScan));

		unmount();
		scan([..."BADGE8"]);

		expect(onScan).not.toHaveBeenCalled();
		expect(onScanJs.isAttachedTo(document)).toBe(false);
	});

	it("doesn't trip over a listener that's already gone", () => {
		const { unmount } = renderHook(() => useKeyboardWedge(vi.fn()));

		onScanJs.detachFrom(document);

		expect(unmount).not.toThrow();
	});
});
