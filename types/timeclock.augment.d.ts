// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// The names this app adds to frappe's desk and web pages, for the checkJs projects
// (tsconfig.desk.json and tsconfig.web.json). frappe's own names come from frappe-types.

import type { QuickEntryForm } from "frappe-types";
import type * as TempusDominus from "@eonasdan/tempus-dominus";

declare module "frappe-types" {
	interface FrappeUiFormNamespace {
		// app-owned: the Workday list's Bulk Add dialog (public/js/timeclock.app.bundle.js)
		WorkdayBulkAddQuickEntryForm: typeof QuickEntryForm;
		// app-owned: opens the Bulk Add dialog (public/js/timeclock.app.bundle.js)
		show_workday_bulk_add: (after_insert?: () => void) => void;
	}
}

declare global {
	// app-owned: frappe loads moment.js as a desk global, which frappe-types leaves untyped; the Workday form only formats with it
	function moment(input?: string | Date | null): { format(format: string): string };

	interface Window {
		// app-owned: the time picker library public/js/employee_timelog.bundle.js loads for the Employee Clock-in/out web form
		tempusDominus: typeof TempusDominus;
		// app-owned: set by the Employee Clock-in/out web form while it submits a punch
		saving?: boolean;
	}

	// app-owned: the global the web form script uses (window.tempusDominus)
	const tempusDominus: typeof TempusDominus;
}
