// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useEffect, useRef, useState } from "react";
import { Button, InlineNotification } from "@carbon/react";
import { KioskHeader } from "../../../shared/KioskHeader";

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

/** One tap, as the tablet's NFC reported it. */
interface Tap {
	at: string;
	serial: string;
	big: string;
	little: string;
	records: string[];
}

function describe(record: NDEFRecord): string {
	const text = record.data ? new TextDecoder(record.encoding ?? "utf-8").decode(record.data) : "";
	return `${record.recordType}${record.mediaType ? ` (${record.mediaType})` : ""}: ${text}`;
}

/**
 * A temporary page (/timeclock?probe=nfc) for finding out what the tablet's own NFC reads from a
 * badge: its serial number as Web NFC reports it, that serial as the 10-digit decimal a USB reader
 * would type (both byte orders), and any NDEF records on it. Compare a badge's row with its
 * Attendance Device ID to see which form, if either, matches.
 */
export function NfcProbe() {
	const [taps, setTaps] = useState<Tap[]>([]);
	const [problem, setProblem] = useState(() =>
		window.NDEFReader ? "" : "This browser can't use NFC. Open the app in Chrome on Android, over HTTPS.",
	);
	const [scanning, setScanning] = useState(false);
	const stop = useRef(new AbortController());

	useEffect(() => () => stop.current.abort(), []);

	const start = async () => {
		// Only reachable once the browser has NDEFReader (the button is hidden otherwise).
		const reader = new window.NDEFReader!();
		reader.onreading = (event) => {
			const bytes = serialBytes(event.serialNumber) ?? [];
			setTaps((earlier) => [
				{
					at: new Date().toLocaleTimeString(),
					serial: event.serialNumber || "(none)",
					big: bytes.length ? serialAsDecimal(bytes, "big") : "",
					little: bytes.length ? serialAsDecimal(bytes, "little") : "",
					records: event.message.records.map(describe),
				},
				...earlier,
			]);
		};
		reader.onreadingerror = () =>
			setProblem("The tablet found a tag but couldn't read it. Try holding the badge still.");
		try {
			await reader.scan({ signal: stop.current.signal });
			setScanning(true);
			setProblem("");
		} catch (error) {
			setProblem(`NFC couldn't start: ${String(error)}`);
		}
	};

	return (
		<>
			<KioskHeader name="NFC probe" />
			<main className="tc-probe">
				<p>
					Start NFC, then tap badges on the back of the tablet. Compare each badge's row with its Attendance
					Device ID.
				</p>
				{problem && <InlineNotification kind="warning" title={problem} hideCloseButton />}
				{window.NDEFReader && !scanning && (
					<Button size="lg" onClick={() => void start()}>
						Start NFC
					</Button>
				)}
				{scanning && <p>Listening for badges…</p>}
				<table className="tc-probe-reads">
					<thead>
						<tr>
							<th>Time</th>
							<th>Serial number</th>
							<th>Decimal (big-endian)</th>
							<th>Decimal (little-endian)</th>
							<th>NDEF records</th>
						</tr>
					</thead>
					<tbody>
						{taps.map((tap, index) => (
							<tr key={taps.length - index}>
								<td>{tap.at}</td>
								<td>{tap.serial}</td>
								<td>{tap.big}</td>
								<td>{tap.little}</td>
								<td>{tap.records.join("; ") || "none"}</td>
							</tr>
						))}
					</tbody>
				</table>
			</main>
		</>
	);
}
