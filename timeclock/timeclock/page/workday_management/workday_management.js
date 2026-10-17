// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

frappe.realtime.on("doc_update", (data) => console.log(data));

// create a custom sort selector for the Workday Management Report
class WorkdaySortSelector extends frappe.ui.SortSelector {
	/** @override */
	get_sql_string() {
		return "`tabWorkday`.`employee_name` asc, `tabWorkday`.`date` asc";
	}
}

// The list views' bundle defines frappe.views.ReportView before page scripts run.
const ReportView = /** @type {NonNullable<typeof frappe.views.ReportView>} */ (frappe.views.ReportView);

// create a custom Workday Management Report Class
class WorkdayManagementReport extends ReportView {
	/** @override */
	setup_defaults() {
		this.page_name = frappe.get_route_str();
		this.page_title = __(this.doctype + "  Management");
		this.meta = /** @type {import("frappe-types").DocTypeMeta} */ (frappe.get_meta(this.doctype));
		this.settings = frappe.listview_settings[this.doctype] || {};
		this.user_settings = /** @type {Record<string, import("frappe-types").ListViewUserSettings>} */ (
			frappe.get_user_settings(this.doctype)
		);

		this.start = 0;
		this.page_length = 500;
		this.data = [];
		this.method = "frappe.desk.reportview.get";

		this.can_create = frappe.model.can_create(this.doctype);
		this.can_write = frappe.model.can_write(this.doctype);
		/** @type {string[]} */
		this.link_title_doctype_fields = [];

		this.fields = [
			["name", "Workday"],
			["employee_name", "Workday"],
			["date", "Workday"],
			["total_hours", "Workday"],
			["day_of_week", "Workday"],
			["check_in_1", "Workday"],
			["check_out_1", "Workday"],
			["check_in_2", "Workday"],
			["check_out_2", "Workday"],
			["check_in_3", "Workday"],
			["check_out_3", "Workday"],
			["check_in_4", "Workday"],
			["check_out_4", "Workday"],
			["check_in_5", "Workday"],
			["check_out_5", "Workday"],
			["check_in_6", "Workday"],
			["check_out_6", "Workday"],
			["check_in_7", "Workday"],
			["check_out_7", "Workday"],
		];
		this.filters = [
			// Optional filters for the list
			["Workday", "date", ">=", frappe.datetime.add_days(frappe.datetime.get_today(), -7)],
			["Workday", "date", "<=", frappe.datetime.get_today()],
		];

		// Setup buttons
		this.primary_action = null;
		this.secondary_action = null;
		jQuery(document.body).toggleClass("full-width", true);

		return this.get_list_view_settings();
	}

	/** @override */
	setup_main_section() {
		return frappe.run_serially(
			[
				this.setup_list_wrapper,
				this.hide_sidebar,
				this.setup_filter_area,
				this.setup_sort_selector,
				this.setup_extra_filters,
				this.setup_result_area,
				this.setup_no_result_area,
				this.setup_freeze_area,
				this.setup_paging_area,
			].map((fn) => fn.bind(this)),
		);
	}

	setup_extra_filters() {
		const filter_area = this.filter_area;
		if (!filter_area) return;
		// append new buttons "This Week" and "This Month" to the filter area
		let today = frappe.datetime.get_today();
		let month_start = frappe.datetime.month_start();
		let week_start = frappe.datetime.week_start();
		let last_sunday = frappe.datetime.add_days(frappe.datetime.week_start(), -7);
		let last_saturday = frappe.datetime.add_days(frappe.datetime.week_start(), -1);
		let this_week_button = $(
			`<button class="btn btn-secondary btn-xs" style="margin: auto 5px; height: fit-content;">This Week</button>`,
		);
		let last_week_button = $(
			`<button class="btn btn-secondary btn-xs" style="margin: auto 5px; height: fit-content;">Last Week</button>`,
		);
		let this_month_button = $(
			`<button class="btn btn-secondary btn-xs" style="margin: auto 5px; height: fit-content;">This Month</button>`,
		);
		this_week_button.on("click", () => {
			/** @type {import("frappe-types").ListFilterTuple[]} */
			let filters = [
				["Workday", "date", ">=", week_start],
				["Workday", "date", "<=", today],
			];
			this.filters = filters;
			filter_area.clear();
			filter_area.set(filters);
			this.refresh();
		});
		last_week_button.on("click", () => {
			/** @type {import("frappe-types").ListFilterTuple[]} */
			let filters = [
				["Workday", "date", ">=", last_sunday],
				["Workday", "date", "<=", last_saturday],
			];
			this.filters = filters;
			filter_area.clear();
			filter_area.set(filters);
			this.refresh();
		});
		this_month_button.on("click", () => {
			/** @type {import("frappe-types").ListFilterTuple[]} */
			let filters = [
				["Workday", "date", ">=", month_start],
				["Workday", "date", "<=", today],
			];
			this.filters = filters;
			filter_area.clear();
			filter_area.set(filters);
			this.refresh();
		});
		filter_area.$filter_list_wrapper.prepend(this_month_button);
		filter_area.$filter_list_wrapper.prepend(last_week_button);
		filter_area.$filter_list_wrapper.prepend(this_week_button);

		// Add Bulk Add button
		this.setup_bulk_add_button();

		// hide filter sidebar
		this.page.sidebar.toggle();
		const sort_wrapper = this.sort_selector?.wrapper[0];
		if (sort_wrapper) sort_wrapper.hidden = true;
	}

	setup_bulk_add_button() {
		this.page.add_inner_button(__("Bulk Add"), () => {
			frappe.ui.form.show_workday_bulk_add(() => {
				// Refresh the list view after bulk add
				this.refresh();
			});
		});
	}

	/** @override */
	setup_view_menu() {
		// do nothing
	}

	/** @override */
	setup_sort_selector() {
		const filter_area = this.filter_area;
		if (!filter_area) return;
		this.sort_selector = new WorkdaySortSelector({
			parent: filter_area.$filter_list_wrapper,
			doctype: this.doctype,
			...(this.order_by === undefined ? {} : { args: this.order_by }),
			onchange: this.on_sort_change.bind(this),
		});
		this.group_by_control = new frappe.ui.GroupBy(this);
	}

	// the page's fixed columns/sort must not overwrite the user's own Workday report settings
	/** @override */
	save_report_settings() {}
}

// frappe creates the page's entry before it runs the page script
const workday_management_page = /** @type {frappe.views.PageWrapper} */ (frappe.pages["workday-management"]);
workday_management_page.on_page_load = function () {
	const page_name = frappe.get_route_str();
	const parent = frappe.make_page(true, page_name, null);
	window.cur_list = frappe.provide("frappe.views.list_view")[page_name] = new WorkdayManagementReport({
		doctype: "Workday",
		parent: parent,
	});
};
