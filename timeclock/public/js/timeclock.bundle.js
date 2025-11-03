
frappe.realtime.on("console_log", (message) => {
	console.log(message);
});

frappe.provide("frappe.ui.form");

frappe.ui.form.WorkdayBulkAddQuickEntryForm = class WorkdayBulkAddQuickEntryForm extends (
	frappe.ui.form.QuickEntryForm
) {
	constructor(doctype, after_insert, init_callback, doc, force) {
		super(doctype, after_insert, init_callback, doc, force);
		this.skip_redirect_on_error = true;
	}

	render_dialog() {
		this.mandatory = [];
		this.dialog = new frappe.ui.Dialog({
			title: __("Bulk Add Workday"),
			fields: this.get_bulk_add_fields(),
		});

		this.dialog.set_primary_action(__("Save"), () => {
			this.save_bulk_entries();
		});

		this.dialog.show();
	}

	get_bulk_add_fields() {
		return [
			{
				fieldname: 'date',
				label: __('Date'),
				fieldtype: 'Date',
				reqd: 1,
			},
			{
				fieldname: 'employees',
				label: __('Employees'),
				fieldtype: 'MultiSelectPills',
				options: 'Employee',
				get_data: () => {
					return frappe.db.get_list("Employee", {
						filters: { status: "Active" },
						fields: ["name", "employee_name"],
						limit: 1000
					}).then(r => {
						return r.map(e => ({ value: e.name, label: e.employee_name }));
					});
				},
				reqd: 1,
			},
			{
				fieldname: 'punches',
				label: __('Punches'),
				fieldtype: 'Table',
				options: 'Workday Punches',
				fields: [
					{
						fieldtype: "Data",
						fieldname: "checkin",
						label: __("Check In"),
						in_list_view: 1,
						reqd: 1
					},
					{
						fieldtype: "Data",
						fieldname: "checkout",
						label: __("Check Out"),
						in_list_view: 1,
						reqd: 1
					},
				],
				onload: function (field) {
					// convert the input fields to a new native <input type="time">
					field.grid.wrapper.find('input[data-fieldname="checkin"]').each(function (i, e) {
						e.type = 'time';
					});
					field.grid.wrapper.find('input[data-fieldname="checkout"]').each(function (i, e) {
						e.type = 'time';
					});
				},
			},
		];
	}

	save_bulk_entries() {
		const date = this.dialog.get_value('date');
		const employees = this.dialog.get_value('employees');
		const punches = this.dialog.get_value("punches").map(w => ({
			checkin: w.checkin,
			checkout: w.checkout,
		}));

		frappe.call({
			method: "timeclock.timeclock.doctype.workday.workday.bulk_add_punches",
			args: {
				date: date,
				employees: employees,
				punches: punches
			},
			callback: (r) => {
				if (r.message) {
					frappe.msgprint(r.message);
				}
				this.dialog.hide();

				// Call after_insert callback if provided
				if (this.after_insert) {
					this.after_insert();
				}

				// Refresh current view
				if (cur_list) {
					cur_list.refresh();
				}
			}
		});
	}
};

// Helper function to show the bulk add dialog
frappe.ui.form.show_workday_bulk_add = function (after_insert) {
	const quick_entry = new frappe.ui.form.WorkdayBulkAddQuickEntryForm(
		"Workday",
		after_insert
	);
	quick_entry.render_dialog();
};
