// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { afterEach, describe, expect, it, vi } from "vitest";
import { NfcProbe, serialAsDecimal, serialBytes } from "./NfcProbe";
import { act, fireEvent, render, screen } from "@testing-library/react";

describe("serialBytes", () => {
	it("reads a Web NFC serial number's bytes", () => {
		expect(serialBytes("3a:1f:b2:0C")).toEqual([0x3a, 0x1f, 0xb2, 0x0c]);
	});

	it.each(["", "3a1fb20c", "3a:1f:b2:", "zz:00", "3a-1f-b2-0c"])("refuses %j", (serial) => {
		expect(serialBytes(serial)).toBeNull();
	});
});

describe("serialAsDecimal", () => {
	const bytes = [0x3a, 0x1f, 0xb2, 0x0c];

	it("reads the bytes most significant first, zero-padded to 10 digits", () => {
		expect(serialAsDecimal(bytes, "big")).toBe("0975155724");
	});

	it("reads them least significant first", () => {
		expect(serialAsDecimal(bytes, "little")).toBe("0212999994");
	});

	it("handles a 7-byte serial, longer than 10 digits", () => {
		expect(serialAsDecimal([0x04, 0xa1, 0xb2, 0xc3, 0xd4, 0xe5, 0xf6], "big")).toBe("1303689068602870");
	});
});

/** A stand-in for Web NFC's NDEFReader: the probe's reader, and what its scan() does. */
class FakeReader extends EventTarget {
	static latest: FakeReader | null = null;
	static scan: (options?: { signal?: AbortSignal }) => Promise<void> = async () => {};
	onreading: ((event: NDEFReadingEvent) => void) | null = null;
	onreadingerror: ((event: Event) => void) | null = null;
	signal: AbortSignal | undefined;

	constructor() {
		super();
		FakeReader.latest = this;
	}

	scan(options?: { signal?: AbortSignal }): Promise<void> {
		this.signal = options?.signal;
		return FakeReader.scan(options);
	}

	/** A tag tapped on the tablet. */
	tap(serialNumber: string, records: NDEFRecord[] = []): void {
		act(() => this.onreading!({ serialNumber, message: { records } } as unknown as NDEFReadingEvent));
	}
}

function withNfc(): void {
	vi.stubGlobal("NDEFReader", FakeReader);
}

async function start(): Promise<FakeReader> {
	await act(async () => {
		fireEvent.click(screen.getByRole("button", { name: "Start NFC" }));
	});
	return FakeReader.latest!;
}

const rows = () =>
	[...document.querySelectorAll(".tc-probe-reads tbody tr")].map((row) =>
		[...row.querySelectorAll("td")].slice(1).map((cell) => cell.textContent),
	);

describe("NfcProbe", () => {
	afterEach(() => {
		FakeReader.latest = null;
		FakeReader.scan = async () => {};
	});

	it("says when the browser can't use NFC", () => {
		render(<NfcProbe />);

		expect(screen.getByText(/This browser can't use NFC/)).toBeTruthy();
		expect(screen.queryByRole("button", { name: "Start NFC" })).toBeNull();
	});

	it("lists each tap: serial, both decimal readings, and NDEF records, newest first", async () => {
		withNfc();
		render(<NfcProbe />);
		const reader = await start();
		expect(screen.getByText("Listening for badges…")).toBeTruthy();
		expect(screen.queryByRole("button", { name: "Start NFC" })).toBeNull();

		reader.tap("3a:1f:b2:0c");
		reader.tap("04:a1:b2:c3", [
			{
				recordType: "text",
				encoding: "utf-8",
				data: new DataView(new TextEncoder().encode("TOKEN-1").buffer),
			},
			{ recordType: "mime", mediaType: "application/json" },
		]);

		expect(rows()).toEqual([
			["04:a1:b2:c3", "0077705923", "3283263748", "text: TOKEN-1; mime (application/json): "],
			["3a:1f:b2:0c", "0975155724", "0212999994", "none"],
		]);
	});

	it("shows a tag with no usable serial as it came", async () => {
		withNfc();
		render(<NfcProbe />);
		const reader = await start();

		reader.tap("");
		reader.tap("not-hex");

		expect(rows()).toEqual([
			["not-hex", "", "", "none"],
			["(none)", "", "", "none"],
		]);
	});

	it("reads a text record without a stated encoding as UTF-8", async () => {
		withNfc();
		render(<NfcProbe />);
		const reader = await start();

		reader.tap("3a:1f:b2:0c", [
			{ recordType: "text", data: new DataView(new TextEncoder().encode("é").buffer) },
		]);

		expect(rows()[0]![3]).toBe("text: é");
	});

	it("says when a tag was seen but couldn't be read", async () => {
		withNfc();
		render(<NfcProbe />);
		const reader = await start();

		act(() => reader.onreadingerror!(new Event("readingerror")));

		expect(screen.getByText(/found a tag but couldn't read it/)).toBeTruthy();
	});

	it("says why NFC couldn't start, and offers to try again", async () => {
		withNfc();
		FakeReader.scan = async () => {
			throw new DOMException("NFC permission request denied.", "NotAllowedError");
		};
		render(<NfcProbe />);

		await start();

		expect(
			screen.getByText(/NFC couldn't start: NotAllowedError: NFC permission request denied./),
		).toBeTruthy();
		expect(screen.getByRole("button", { name: "Start NFC" })).toBeTruthy();
	});

	it("stops listening when the page goes", async () => {
		withNfc();
		const { unmount } = render(<NfcProbe />);
		const reader = await start();

		unmount();

		expect(reader.signal?.aborted).toBe(true);
	});
});
