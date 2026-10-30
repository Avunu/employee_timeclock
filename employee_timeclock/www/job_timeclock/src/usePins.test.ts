// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePins } from "./usePins";

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
