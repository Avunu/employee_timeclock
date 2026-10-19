// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// HR issues and revokes the badge an employee scans at a timeclock kiosk. The server keeps only
// a hash of the badge token, so the token is shown once, here, for HR to print on the badge.

/**
 * What employee_timeclock.kiosk.issue_badge returns.
 * @typedef {{ employee: string, token: string, issued_on: string }} IssuedBadge
 */

const BADGE_ISSUER_ROLES = ["HR Manager", "System Manager"];

/** @param {IssuedBadge} badge */
function show_issued_badge(badge) {
	const dialog = new frappe.ui.Dialog({
		title: __("Timeclock Badge"),
		fields: [
			{
				fieldtype: "HTML",
				fieldname: "warning",
				options: `<p>${__(
					"Print this token on the employee's badge as a barcode or QR code. It is shown only now: if it is lost, issue a new badge.",
				)}</p>`,
			},
			{
				fieldtype: "Data",
				fieldname: "token",
				label: __("Badge Token"),
				read_only: 1,
				default: badge.token,
			},
		],
		primary_action_label: __("Copy Token"),
		primary_action() {
			frappe.utils.copy_to_clipboard(badge.token);
		},
	});
	dialog.show();
}

frappe.ui.form.on("Employee", {
	refresh(frm) {
		if (frm.is_new() || !BADGE_ISSUER_ROLES.some((role) => frappe.user.has_role(role))) {
			return;
		}
		const group = __("Timeclock");
		frm.add_custom_button(
			__("Issue Badge"),
			() => {
				const issue = () =>
					frappe.call({
						method: "employee_timeclock.kiosk.issue_badge",
						args: { employee: frm.doc.name },
						callback(r) {
							show_issued_badge(/** @type {IssuedBadge} */ (r.message));
							frm.reload_doc();
						},
					});
				if (frm.doc.timeclock_badge_issued_on) {
					frappe.confirm(__("Issue a new badge? The current badge stops working."), issue);
				} else {
					issue();
				}
			},
			group,
		);
		if (frm.doc.timeclock_badge_issued_on) {
			frm.add_custom_button(
				__("Revoke Badge"),
				() =>
					frappe.confirm(__("Revoke this employee's timeclock badge?"), () =>
						frappe.call({
							method: "employee_timeclock.kiosk.revoke_badge",
							args: { employee: frm.doc.name },
							callback() {
								frm.reload_doc();
							},
						}),
					),
				group,
			);
		}
	},
});
