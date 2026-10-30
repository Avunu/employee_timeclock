// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// Web NFC (Chrome on Android, over HTTPS), which TypeScript's DOM library doesn't include yet:
// https://w3c.github.io/web-nfc/

interface NDEFRecord {
	readonly recordType: string;
	readonly mediaType?: string;
	readonly encoding?: string;
	readonly data?: DataView;
}

interface NDEFMessage {
	readonly records: readonly NDEFRecord[];
}

interface NDEFReadingEvent extends Event {
	/** The tag's serial number (its UID), as hex bytes: "04:a1:b2:c3". */
	readonly serialNumber: string;
	readonly message: NDEFMessage;
}

declare class NDEFReader extends EventTarget {
	onreading: ((event: NDEFReadingEvent) => void) | null;
	onreadingerror: ((event: Event) => void) | null;
	scan(options?: { signal?: AbortSignal }): Promise<void>;
}

interface Window {
	NDEFReader?: typeof NDEFReader;
}
