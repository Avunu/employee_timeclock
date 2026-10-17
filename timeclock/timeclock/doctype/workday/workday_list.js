// Copyright (c) 2022, Avunu LLC and contributors
// For license information, please see license.txt

// add a button for a bulk entry dialog that allows for the entry of workday checkin/checkout times for multiple employees
// the dialog form uses a Date field to select the date, Table MultiSelect field to select employees, and a Table field to enter the checkin/checkout times
frappe.listview_settings["Workday"] = /** @type {frappe.views.ListViewSettings<"Workday">} */ ({
	refresh: function (listview) {
		listview.page.add_inner_button(__("Bulk Add"), function () {
			frappe.ui.form.show_workday_bulk_add(() => {
				// Refresh the list view after bulk add
				listview.refresh();
			});
		});
	},
});

frappe.ui.form.on("Workday", {
	date: function (frm) {
		// set the day of the week based on the date
		frm.set_value("day_of_week", moment(frm.doc.date).format("dddd"));
	},
});
