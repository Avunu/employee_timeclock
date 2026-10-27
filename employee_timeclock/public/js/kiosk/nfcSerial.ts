// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/** A Web NFC serial number, "04:a1:b2:c3", as its bytes; null for anything else. */
export function serialBytes(serial: string): number[] | null {
	if (!/^[\da-f]{2}(?::[\da-f]{2})*$/i.test(serial)) return null;
	return serial.split(":").map((byte) => Number.parseInt(byte, 16));
}

/**
 * The bytes read as one number, most significant first ("big") or last ("little"), in decimal and
 * zero-padded to 10 digits: the form a USB badge reader types a 4-byte serial in.
 */
export function serialAsDecimal(bytes: readonly number[], order: "big" | "little"): string {
	const ordered = order === "little" ? bytes.toReversed() : bytes;
	return ordered
		.reduce((value, byte) => value * 256n + BigInt(byte), 0n)
		.toString()
		.padStart(10, "0");
}
