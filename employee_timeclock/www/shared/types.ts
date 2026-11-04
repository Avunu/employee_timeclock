// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import type onScanJs from "onscan.js";

export type ToastKind = "success" | "warning" | "error" | "info";

export interface ToastState {
	id: number;
	kind: ToastKind;
	title: string;
}

export type ShowToast = (toast: Omit<ToastState, "id">) => void;

/** What a kiosk page's index.py puts in `boot`. */
export interface KioskBoot {
	session_expiry?: string;
	/** For a page with a realtime connection. */
	sitename?: string;
	socketio_port?: number;
}

declare global {
	interface Window {
		csrf_token?: string;
		kiosk_boot?: KioskBoot;
		/** onscan.js, for `onScan.simulate(document, "<badge>")` from the console when testing. */
		onScan?: typeof onScanJs;
	}
}
