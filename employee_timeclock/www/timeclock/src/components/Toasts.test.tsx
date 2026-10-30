// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToastProvider, useToasts } from "./Toasts";
import type { ShowToast } from "../types";

/** Render a ToastProvider and hand back its showToast. */
function toasts(): ShowToast {
	let show: ShowToast = () => {};
	function Grab() {
		show = useToasts();
		return null;
	}
	render(
		<ToastProvider>
			<Grab />
		</ToastProvider>,
	);
	return show;
}

const titles = () => screen.queryAllByRole("status").map((toast) => toast.textContent);

describe("ToastProvider", () => {
	it("shows each toast, newest on top", () => {
		const show = toasts();

		act(() => {
			show({ kind: "error", title: "First" });
			show({ kind: "success", title: "Second" });
		});

		expect(titles()).toEqual([expect.stringContaining("Second"), expect.stringContaining("First")]);
	});

	it("takes a toast away when it's closed", async () => {
		const show = toasts();
		act(() => show({ kind: "info", title: "Read me" }));

		await userEvent.click(screen.getByRole("button", { name: /close/i }));

		expect(titles()).toEqual([]);
	});

	it("takes a toast away by itself after eight seconds", () => {
		vi.useFakeTimers();
		const show = toasts();
		act(() => show({ kind: "warning", title: "Soon gone" }));

		act(() => vi.advanceTimersByTime(7900));
		expect(titles()).toHaveLength(1);
		act(() => vi.advanceTimersByTime(200));
		expect(titles()).toEqual([]);
	});

	it("does nothing outside a ToastProvider", () => {
		const show = renderHook(() => useToasts()).result.current;

		expect(() => show({ kind: "error", title: "Nobody sees this" })).not.toThrow();
	});
});
