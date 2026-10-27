// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useEffect, useRef, useState } from "react";
import { Button, InlineNotification } from "@carbon/react";
import { KioskHeader } from "../../../../public/js/kiosk/KioskHeader";
import { serialAsDecimal, serialBytes } from "../../../../public/js/kiosk/nfcSerial";

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
