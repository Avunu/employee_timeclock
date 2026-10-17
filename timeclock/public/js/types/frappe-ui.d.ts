// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// The part of frappe-ui 0.1 the SPAs use, for the type check only (tsconfig.json maps
// "frappe-ui" here; Vite still bundles the package). frappe-ui 0.1 ships its TypeScript sources
// and no declarations, and those sources do not pass a strict check, so checking through them
// reports the library's errors as ours. Delete this file with the move to frappe-ui 1.x, which
// ships declarations.

import type { Component, Plugin } from "vue";

export declare const FrappeUI: Plugin;

export declare const Badge: Component;
export declare const Button: Component;
export declare const Card: Component;
export declare const Checkbox: Component;
export declare const Dropdown: Component;
export declare const LoadingIndicator: Component;
export declare const Sidebar: Component;
export declare const Switch: Component;
export declare const Toast: Component;

export interface ToastOptions {
	duration?: number;
	closable?: boolean;
}

export declare const toast: {
	success(message: string, options?: ToastOptions): string;
	error(message: string, options?: ToastOptions): string;
	warning(message: string, options?: ToastOptions): string;
	info(message: string, options?: ToastOptions): string;
};
