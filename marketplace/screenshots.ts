// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import type { ShotSpec } from "./shots.d.ts";

// The demo shop from employee_timeclock/demo.py, on the week of 2026-01-15 (a Thursday).
// Tuesday, when Jordan Patel forgot to clock out.
const TUESDAY = "from_date=2026-01-13&to_date=2026-01-13&group_by=Day";
const MARIA = "/app/employee/HR-EMP-00003";

export default {
	demo: { date: "2026-01-15", seed: 1 },
	shots: [
		{
			name: "job-tracker",
			route: "/job_timeclock",
			alt: "The job time tracker: open work orders, the workbench order's operations with logged time, and a welding timer running",
			waitFor: "[data-work-order]",
			actions: [{ click: "[data-work-order]" }, { waitFor: "#JobCards > *" }, { wait: 1000 }],
			themes: ["light"],
			readme: "hero",
			featured: true,
		},
		{
			name: "workday-management",
			route: `/app/query-report/Workday Management?${TUESDAY}`,
			alt: "The Workday Management report for one day: each employee's punches and hours, with a forgotten clock-out flagged as a missing punch",
			waitFor: ".dt-scrollable .dt-row",
			actions: [{ wait: 1000 }],
			readme: "feature",
			featured: true,
		},
		{
			name: "issue-badge",
			route: MARIA,
			alt: "Issuing a timeclock badge from the Employee form: the new token, shown once for printing on the badge",
			waitForFn:
				'window.cur_frm && cur_frm.doc.name === "HR-EMP-00003" && !!cur_frm.custom_buttons["Issue Badge"]',
			actions: [
				// Each theme issues a badge; skip the replace-the-badge confirmation the second one would ask for.
				{
					eval: 'cur_frm.doc.timeclock_badge_issued_on = null; cur_frm.custom_buttons["Issue Badge"].trigger("click")',
				},
				{ waitFor: '.modal.show .frappe-control[data-fieldname="token"]' },
				{ wait: 800 },
			],
			// The token is random on every run.
			mask: ['.modal.show .frappe-control[data-fieldname="token"] .control-input-wrapper'],
			readme: "feature",
			featured: true,
		},
		{
			name: "clock-in-form",
			route: "/employee-timeclock?new=1",
			alt: "The Employee Clock-in/out kiosk form with the time entered by hand: the date, the time and a Clock In or Clock Out choice, then the badge scan",
			waitFor: "input[data-fieldname='employee']",
			actions: [
				{ click: "input[data-fieldname='manual_override']" },
				{
					eval: 'frappe.web_form.set_value("manual_override_date", "2026-01-15"); frappe.web_form.set_value("manual_override_time", "07:30:00")',
				},
				{ wait: 1000 },
			],
			// The kiosk's live clock.
			hide: [".clock"],
			themes: ["light"],
			featured: true,
		},
		{
			name: "badge-kiosk",
			route: "/timeclock",
			alt: "The badge kiosk after a scan: Maria Lopez has punched in",
			waitFor: "#app",
			actions: [
				{ wait: 1000 },
				{ eval: 'window.onScan.simulate(document, "0004417253")' },
				{ waitFor: ".Vue-Toastification__toast" },
				{ wait: 800 },
			],
			themes: ["light"],
			featured: true,
		},
	],
} satisfies ShotSpec;
