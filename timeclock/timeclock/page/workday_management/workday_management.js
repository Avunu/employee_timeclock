frappe.realtime.on("doc_update", (data) => console.log(data));

// create a custom sort selector for the Workday Management Report
frappe.ui.SortSelector = class SortSelector extends frappe.ui.SortSelector {
  get_sql_string() {
    return "`tabWorkday`.`employee_name` asc, `tabWorkday`.`date` asc";
  }
};

// create a custom Workday Management Report Class
frappe.views.ReportView = class ReportView extends frappe.views.ReportView {
  setup_defaults() {
    this.page_name = frappe.get_route_str();
    this.page_title = __(this.doctype + "  Management");
    this.meta = frappe.get_meta(this.doctype);
    this.settings = frappe.listview_settings[this.doctype] || {};
    this.user_settings = frappe.get_user_settings(this.doctype);

    this.start = 0;
    this.page_length = 500;
    this.data = [];
    this.method = "frappe.desk.reportview.get";

    this.can_create = frappe.model.can_create(this.doctype);
    this.can_write = frappe.model.can_write(this.doctype);

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
    // append new buttons "This Week" and "This Month" to the filter area
    let today = frappe.datetime.get_today();
    let month_start = frappe.datetime.month_start(frappe.datetime.get_today());
    let week_start = frappe.datetime.week_start(frappe.datetime.get_today());
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
      let filters = [
        ["Workday", "date", ">=", week_start],
        ["Workday", "date", "<=", today],
      ];
      this.filters = filters;
      this.filter_area.clear();
      this.filter_area.set(filters);
      this.refresh();
    });
    last_week_button.on("click", () => {
      let filters = [
        ["Workday", "date", ">=", last_sunday],
        ["Workday", "date", "<=", last_saturday],
      ];
      this.filters = filters;
      this.filter_area.clear();
      this.filter_area.set(filters);
      this.refresh();
    });
    this_month_button.on("click", () => {
      let filters = [
        ["Workday", "date", ">=", month_start],
        ["Workday", "date", "<=", today],
      ];
      this.filters = filters;
      this.filter_area.clear();
      this.filter_area.set(filters);
      this.refresh();
    });
    this.filter_area.$filter_list_wrapper.prepend(this_month_button);
    this.filter_area.$filter_list_wrapper.prepend(last_week_button);
    this.filter_area.$filter_list_wrapper.prepend(this_week_button);

    // Add Bulk Add button
    this.setup_bulk_add_button();

    // hide filter sidebar
    this.page.sidebar.toggle();
    this.sort_selector.wrapper[0].hidden = 1;
  }

  setup_bulk_add_button() {
    this.page.add_inner_button(__("Bulk Add"), () => {
      frappe.ui.form.show_workday_bulk_add(() => {
        // Refresh the list view after bulk add
        this.refresh();
      });
    });
  }

  setup_view_menu() {
    // do nothing
  }
};

// Create a new page
frappe.pages["workday-management"].on_page_load = function (wrapper) {
  var list_factory = new frappe.views.ListFactory({
    doctype: "Workday", // The doctype for the list
    parent: wrapper, // The parent element for the list
    title: "Workday Management", // The title for the list
  });
  list_factory.route = ["List", "Workday", "Report"];
  list_factory.page_name = frappe.get_route_str();
  list_factory.make(list_factory.route);
};
