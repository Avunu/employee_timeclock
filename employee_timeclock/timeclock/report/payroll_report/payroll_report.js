// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

frappe.provide("frappe.query_reports")["Payroll Report"] = {
	filters: [
		{
			fieldname: "start_date",
			label: __("Start Date"),
			fieldtype: "Date",
			reqd: 1,
		},
		{
			fieldname: "end_date",
			label: __("End Date"),
			fieldtype: "Date",
			reqd: 1,
		},
	],
};
