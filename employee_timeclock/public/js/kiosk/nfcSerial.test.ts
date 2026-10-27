// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it } from "vitest";
import { serialAsDecimal, serialBytes } from "./nfcSerial";

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
