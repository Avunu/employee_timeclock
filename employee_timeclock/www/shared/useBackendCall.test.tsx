// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSession } from "./session";
import { Frappe } from "./test/Frappe";
import { respond, stubFetch, thrown } from "./test/server";
import { useToasts } from "./Toasts";
import { getErrorMessage, useBackendCall, useKioskRequest } from "./useBackendCall";

vi.mock("./session", () => ({ useSession: vi.fn() }));
vi.mock("./Toasts", () => ({ useToasts: vi.fn() }));

const FALLBACK = "The punch wasn't recorded.";

describe("getErrorMessage", () => {
	it("shows the server's message", () => {
		expect(getErrorMessage(thrown("Choose Clock In or Clock Out."), FALLBACK)).toBe(
			"Choose Clock In or Clock Out.",
		);
	});

	it("falls back when the server's error has no message", () => {
		expect(getErrorMessage(thrown(""), FALLBACK)).toBe(FALLBACK);
	});

	it("skips what can't be read in the server's messages", () => {
		const messages = JSON.stringify([
			1,
			"not json",
			JSON.stringify({ other: 1 }),
			JSON.stringify({ message: "Yes." }),
		]);

		expect(getErrorMessage({ _server_messages: messages }, FALLBACK)).toBe("Yes.");
		expect(getErrorMessage({ _server_messages: "not json" }, FALLBACK)).toBe(FALLBACK);
	});

	it("falls back for anything else", () => {
		expect(getErrorMessage(new Error("boom"), FALLBACK)).toBe(FALLBACK);
		expect(getErrorMessage("boom", FALLBACK)).toBe(FALLBACK);
	});
});

describe("useBackendCall", () => {
	const recordActivity = vi.fn();
	const reportForbidden = vi.fn();
	const showToast = vi.fn();

	beforeEach(() => {
		vi.mocked(useSession).mockReturnValue({ recordActivity, reportForbidden });
		vi.mocked(useToasts).mockReturnValue(showToast);
		for (const spy of [recordActivity, reportForbidden, showToast]) spy.mockClear();
	});

	const backend = () =>
		renderHook(() => useBackendCall<{ ok: boolean }>("a.method", FALLBACK), { wrapper: Frappe }).result;

	it("answers the method's return value and restarts the session timer", async () => {
		const fetch = stubFetch(async () => respond(200, { message: { ok: true } }));
		const result = backend();

		let answer;
		await act(async () => {
			answer = await result.current.call({ badge: "B1" });
		});

		expect(answer).toEqual({ ok: true, data: { ok: true } });
		expect(fetch).toHaveBeenCalledOnce();
		expect(recordActivity).toHaveBeenCalledOnce();
		expect(showToast).not.toHaveBeenCalled();
	});

	it("sends no args when given none", async () => {
		const fetch = stubFetch(async () => respond(200, { message: { ok: true } }));
		const result = backend();

		await act(() => result.current.call());

		expect(JSON.parse(String(fetch.mock.calls[0]![1].body))).toEqual({});
	});

	it("is loading while the call is out", async () => {
		let answer: (response: Response) => void = () => {};
		const fetch = stubFetch(() => new Promise((resolve) => (answer = resolve)));
		const result = backend();

		let call: Promise<unknown> = Promise.resolve();
		await act(async () => {
			call = result.current.call();
			await vi.waitFor(() => expect(fetch).toHaveBeenCalled());
		});
		expect(result.current.loading).toBe(true);

		await act(async () => {
			answer(respond(200, { message: { ok: true } }));
			await call;
		});
		expect(result.current.loading).toBe(false);
	});

	it("leaves a quiet status to the caller, with no toast", async () => {
		stubFetch(async () => respond(401, thrown("Badge not recognised.")));
		const { result } = renderHook(() => useKioskRequest(), { wrapper: Frappe });

		let answer;
		await act(async () => {
			answer = await result.current("some.method", {}, "It failed.", [401]);
		});

		expect(answer).toEqual({ ok: false, offline: false, status: 401 });
		expect(showToast).not.toHaveBeenCalled();
	});

	it("shows a failure as an error toast, and says it failed", async () => {
		stubFetch(async () => respond(401, thrown("Badge not recognised.")));
		const result = backend();

		let answer;
		await act(async () => {
			answer = await result.current.call();
		});

		expect(answer).toEqual({ ok: false, offline: false, status: 401 });
		expect(showToast).toHaveBeenCalledExactlyOnceWith({ kind: "error", title: "Badge not recognised." });
		expect(recordActivity).not.toHaveBeenCalled();
		expect(reportForbidden).not.toHaveBeenCalled();
	});

	it("keeps quiet when the call never reached the server, and says it's offline", async () => {
		stubFetch(async () => {
			throw new TypeError("Failed to fetch");
		});
		const result = backend();

		let answer;
		await act(async () => {
			answer = await result.current.call();
		});

		expect(answer).toEqual({ ok: false, offline: true });
		expect(showToast).not.toHaveBeenCalled();
		expect(reportForbidden).not.toHaveBeenCalled();
	});

	it("hands a 403 to the session, which reloads, instead of a toast", async () => {
		stubFetch(async () => respond(403, thrown("Not permitted")));
		const result = backend();

		await act(() => result.current.call());

		expect(reportForbidden).toHaveBeenCalledOnce();
		expect(showToast).not.toHaveBeenCalled();
	});
});
