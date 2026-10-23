// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/** The kiosk's page navigation, in one place so tests can stand in for it: jsdom can't navigate. */

export function reloadPage(): void {
	window.location.reload();
}

export function goTo(url: string): void {
	window.location.href = url;
}
