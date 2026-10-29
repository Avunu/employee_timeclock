// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useEffect, useRef } from "react";
import onScanJs, { type ScanOptions } from "onscan.js";

/**
 * Listens for a USB "keyboard wedge" badge scanner anywhere on the page.
 * There's no dedicated field to focus - the scanner's keystrokes go wherever
 * the page's focus already is, so onscan.js listens at the document level
 * and tells fast scanner input apart from normal typing by timing.
 *
 * Attaches once per mount; remount the calling component (e.g. via `key`)
 * to start a fresh scan session.
 */
export function useKeyboardWedge(onScan: (code: string) => void): void {
	// A ref so the listener (attached once, below) always calls the latest
	// closure instead of the one from the first render.
	const onScanRef = useRef(onScan);
	useEffect(() => {
		onScanRef.current = onScan;
	});

	useEffect(() => {
		const options = {
			// ignoreIfFocusOn backs off whenever a text field is focused, so typing
			// into it (the forgotten-punch date) fills that field instead of also
			// being read as a page-level scan. Radio buttons take no typed text,
			// so a badge scanned while one has focus (right after choosing the
			// forgotten punch's IN/OUT) is still heard.
			// @types/onscan.js types this as boolean only, but onscan.js itself
			// also accepts a selector/element (or array of them) - see its own doc
			// comment on the option.
			ignoreIfFocusOn: "input:not([type='radio']), textarea, select",
			// onscan.js's default decoder only recognizes keyCodes 48-90 and
			// 96-111 (letters, digits, numpad) and silently drops everything
			// else - the "-" and "_" in an issued badge token among them.
			// KeyboardEvent.key already gives the right printable character
			// for any key regardless of layout/keyCode, so decode from that.
			keyCodeMapper: (event: KeyboardEvent) => {
				const { key } = event;
				return typeof key === "string" && key.length === 1 ? key : null;
			},
			onScan: (code: string) => onScanRef.current(code.trim()),
		};
		// @types/onscan.js is narrower than onscan.js itself (see ignoreIfFocusOn above), so the
		// options can't be typed as ScanOptions without saying so.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion
		onScanJs.attachTo(document, options as unknown as ScanOptions);
		window.onScan = onScanJs;
		return () => {
			if (onScanJs.isAttachedTo(document)) onScanJs.detachFrom(document);
		};
	}, []);
}
