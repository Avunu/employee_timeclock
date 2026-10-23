// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

frappe.query_reports["Work Day Hours Report"] = {
	filters: [
		{
			fieldname: "from_date",
			label: __("From Date"),
			fieldtype: "Date",
		},
		{
			fieldname: "to_date",
			label: __("To Date"),
			fieldtype: "Date",
		},
	],
};
