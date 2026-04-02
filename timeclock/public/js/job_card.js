frappe.ui.form.on("Job Card", {
  setup_time_logs_columns: function (frm) {
    const time_logs_grid = frm.fields_dict.time_logs.grid;
    if (time_logs_grid) {
      time_logs_grid.df.on_setup = function (grid) {
        grid.setup_user_defined_columns = function () {
          const is_machine_time = frm.doc.is_machine_time;
          this.user_defined_columns = [
            frappe.meta.get_docfield(
              "Job Card Time Log",
              is_machine_time ? "machine_operator" : "employee",
            ),
            frappe.meta.get_docfield("Job Card Time Log", "from_time"),
            frappe.meta.get_docfield("Job Card Time Log", "to_time"),
            frappe.meta.get_docfield("Job Card Time Log", "time_in_mins"),
          ].map((df) => {
            df.in_list_view = 1;
            df.columns = df?.columns || 2;
            return df;
          });
        };
      };
      time_logs_grid.refresh();
    }
  },
  setup: function (frm) {
    frm.trigger("setup_time_logs_columns");
  },
  refresh: function (frm) {
    frm.trigger("setup_time_logs_columns");
  },
});
