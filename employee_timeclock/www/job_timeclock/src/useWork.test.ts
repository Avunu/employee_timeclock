// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it } from "vitest";
import { readStored, usePins, writeStored } from "./useWork";
import { act, renderHook } from "@testing-library/react";

describe("stored values", () => {
	it("reads back what was written", () => {
		writeStored("key", ["a"]);

		expect(readStored("key", [])).toEqual(["a"]);
	});

	it("falls back when nothing is kept", () => {
		expect(readStored("key", "fallback")).toBe("fallback");
	});

	it("falls back when what is kept can't be read", () => {
		window.localStorage.setItem("key", "{not json");

		expect(readStored("key", "fallback")).toBe("fallback");
	});
});

describe("usePins", () => {
	it("keeps each employee's pins apart", () => {
		const { result, rerender } = renderHook(({ id }) => usePins(id), { initialProps: { id: "A" } });

		act(() => result.current.toggle("WO-1", "Weld"));
		expect(result.current.pins).toEqual([{ workOrder: "WO-1", operation: "Weld" }]);
		expect(result.current.isPinned("WO-1", "Weld")).toBe(true);

		rerender({ id: "B" });
		expect(result.current.pins).toEqual([]);
	});

	it("has no pins for a badge nobody has confirmed", () => {
		const { result } = renderHook(() => usePins(null));

		act(() => result.current.toggle("WO-1", "Weld"));

		expect(result.current.pins).toEqual([]);
		expect(window.localStorage.getItem("pinnedCards")).toBeNull();
	});
});
