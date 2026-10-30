// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { beforeEach, describe, expect, it, vi } from "vitest";
import { io } from "socket.io-client";
import { connectSocket } from "./socket";

vi.mock("socket.io-client", () => ({ io: vi.fn() }));

const place = (url: string) => vi.stubGlobal("location", new URL(url));

describe("connectSocket", () => {
	beforeEach(() => vi.mocked(io).mockClear());

	it("uses the page's own address behind a proxy", () => {
		place("https://erp.example.com/job_timeclock");
		window.kiosk_boot = { sitename: "erp.example.com" };

		connectSocket();

		expect(vi.mocked(io).mock.calls[0]?.[0]).toBe("/erp.example.com");
	});

	it("uses socket.io's own port on a dev bench, and the host for the site if it wasn't told", () => {
		place("http://localhost:8000/job_timeclock");

		connectSocket();

		expect(vi.mocked(io).mock.calls[0]?.[0]).toBe("ws://localhost:9000/localhost");
	});

	it("uses the configured port, and a secure socket on https", () => {
		place("https://localhost:8443/job_timeclock");
		window.kiosk_boot = { sitename: "site", socketio_port: 9001 };

		connectSocket();

		expect(vi.mocked(io).mock.calls[0]?.[0]).toBe("wss://localhost:9001/site");
	});

	it("stays on the page's address when socket.io shares its port", () => {
		place("http://localhost:9000/job_timeclock");

		connectSocket();

		expect(vi.mocked(io).mock.calls[0]?.[0]).toBe("/localhost");
	});
});
