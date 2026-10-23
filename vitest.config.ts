// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// The React badge kiosk's tests (`yarn test`), apart from vite.config.ts, which builds the job
// timeclock SPA. Every line and branch of the kiosk is covered, and the run fails if any is not.

import { defineConfig } from "vitest/config";

const KIOSK_SOURCES = [
	"employee_timeclock/public/js/kiosk/**/*.{ts,tsx}",
	"employee_timeclock/public/js/kiosk-sw.js",
	"employee_timeclock/public/js/timeclock.bundle.ts",
	"employee_timeclock/www/timeclock/src/**/*.{ts,tsx}",
];

export default defineConfig({
	oxc: { jsx: { runtime: "automatic" } },
	test: {
		environment: "jsdom",
		environmentOptions: { jsdom: { url: "http://localhost:8000/timeclock" } },
		include: [
			"employee_timeclock/public/js/kiosk/**/*.test.{ts,tsx}",
			"employee_timeclock/www/timeclock/src/**/*.test.{ts,tsx}",
		],
		setupFiles: ["employee_timeclock/public/js/kiosk/test/setup.ts"],
		coverage: {
			provider: "v8",
			include: KIOSK_SOURCES,
			// Tests, their helpers, and modules with nothing but types.
			exclude: ["**/*.test.{ts,tsx}", "**/test/**", "**/types.ts"],
			reporter: ["text"],
			thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
		},
	},
});
