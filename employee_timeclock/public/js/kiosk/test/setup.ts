// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// Runs before every kiosk test file (vitest.config.ts setupFiles).

import { cleanup } from "@testing-library/react";
import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach, vi } from "vitest";

// Carbon reads these, and jsdom has neither.
window.matchMedia = (query: string) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: () => {},
	removeListener: () => {},
	addEventListener: () => {},
	removeEventListener: () => {},
	dispatchEvent: () => false,
});
window.ResizeObserver = class {
	observe() {}
	unobserve() {}
	disconnect() {}
};

// A fresh, empty IndexedDB (the offline queues) for every test; jsdom has none of its own.
beforeEach(() => {
	globalThis.indexedDB = new IDBFactory();
});

afterEach(() => {
	cleanup();
	vi.useRealTimers();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	delete window.csrf_token;
	delete window.kiosk_boot;
	window.localStorage.clear();
});
