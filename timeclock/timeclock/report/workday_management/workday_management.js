// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

const WM_METHOD = "timeclock.timeclock.report.workday_management.workday_management";

const WM_STATUS_COLORS = {
  OK: "green",
  "No Workday": "red",
  "Missing Punch": "red",
  "Duplicate Workday": "orange",
  "Out of Sync": "orange",
  "Log Type Mismatch": "yellow",
  "No Punches": "gray",
};

// Statuses a rebuild fixes, used when Rebuild Workdays runs with nothing selected
const WM_REBUILD_STATUSES = ["No Workday", "Out of Sync"];

// row_keys of tree nodes that were open before a refresh we triggered, reapplied after render
let wm_open_nodes = null;

frappe.query_reports["Workday Management"] = {
  filters: [
    {
      fieldname: "from_date",
      label: __("From Date"),
      fieldtype: "Date",
      reqd: 1,
      default: frappe.datetime.week_start(),
    },
    {
      fieldname: "to_date",
      label: __("To Date"),
      fieldtype: "Date",
      reqd: 1,
      default: frappe.datetime.get_today(),
    },
    {
      fieldname: "group_by",
      label: __("Group By"),
      fieldtype: "Select",
      options: "Employee\nDay",
      default: "Employee",
      on_change: function () {
        frappe.query_report.refresh();
      },
    },
    {
      fieldname: "employee",
      label: __("Employee"),
      fieldtype: "Link",
      options: "Employee",
    },
    {
      fieldname: "issues_only",
      label: __("Issues Only"),
      fieldtype: "Check",
      default: 0,
    },
  ],

  tree: true,
  initial_depth: 2,

  formatter: function (value, row, column, data, default_formatter, _filter) {
    if (!data) return default_formatter(value, row, column, data);

    const row_type = data.row_type;
    const field = column.fieldname;

    // ── Total row: bold label and values, skip everything else ──
    if (row_type === "total") {
      if (field === "label") return `<strong>${frappe.utils.escape_html(value || "")}</strong>`;
      if (value != null && value !== "")
        return `<strong>${default_formatter(value, row, column, data)}</strong>`;
      return "";
    }

    // ── Label column: employee/day for groups, workday link, or punch slot ──
    if (field === "label") {
      const label = frappe.utils.escape_html(value || "");
      if (row_type === "group") {
        if (data.employee) {
          return `<a href="/app/employee/${encodeURIComponent(data.employee)}" target="_blank">
            <strong>${label}</strong></a>`;
        }
        return `<strong>${label}</strong>`;
      }
      if (row_type === "workday") {
        if (data.workday) {
          return `<a href="/app/workday/${encodeURIComponent(data.workday)}" target="_blank">${label}</a>`;
        }
        return label;
      }
      return `<span class="text-muted">${label}</span>`;
    }

    // ── Status column: issue count on groups, indicator pill on workdays ──
    if (field === "status") {
      if (row_type === "group") {
        if (!data.issue_count) return "";
        return `<span class="indicator-pill orange">${__("{0} issue(s)", [data.issue_count])}</span>`;
      }
      if (row_type === "workday" && value) {
        const color = WM_STATUS_COLORS[value] || "gray";
        const title = frappe.utils.escape_html(data.issues || "");
        return `<span class="indicator-pill ${color}" title="${title}">${frappe.utils.escape_html(__(value))}</span>`;
      }
      return "";
    }

    // ── Log type: flag punches whose log type doesn't match their IN/OUT slot ──
    if (field === "log_type") {
      if (row_type !== "checkin") return "";
      const expected = (data.label || "").startsWith("OUT") ? "OUT" : "IN";
      const color = value === expected ? (value === "IN" ? "green" : "blue") : "orange";
      const title = value === expected ? "" : __("Expected {0} for this slot", [expected]);
      return `<span class="indicator-pill ${color}" title="${title}">${frappe.utils.escape_html(value || __("None"))}</span>`;
    }

    // ── Override: show the original punch time on hover ──
    if (field === "override") {
      if (!value) return "";
      const title = data.overridden_time ? __("Originally {0}", [data.overridden_time]) : "";
      return `<span class="indicator-pill orange" title="${frappe.utils.escape_html(title)}">${frappe.utils.escape_html(value)}</span>`;
    }

    // ── Workday link only on workday rows; checkin rows sit right beneath it ──
    if (field === "workday" && row_type !== "workday") return "";

    return default_formatter(value, row, column, data);
  },

  get_datatable_options: function (options) {
    return Object.assign(options, {
      treeView: true,
      checkboxColumn: true,
      serialNoColumn: true,
      cellHeight: 36,

      getEditor: function (colIndex, rowIndex, value, parent, column, row, data) {
        // Only punches (Employee Checkin rows) are editable
        if (!data || data.row_type !== "checkin") return false;

        const field = column.fieldname || column.id;

        // ── time: native time input, kept on the punch's date ──
        if (field === "time") {
          const $input = document.createElement("input");
          $input.type = "time";
          $input.className = "dt-input";
          $input.style.width = "100%";
          parent.appendChild($input);

          return {
            initValue() {
              $input.value = data.time_value || "";
              $input.focus();
            },
            getValue() {
              return $input.value;
            },
            setValue(newValue) {
              if (newValue && newValue !== data.time_value) save_checkin(data, field, newValue);
            },
          };
        }

        // ── log_type: IN / OUT select ──
        if (field === "log_type") {
          const $select = document.createElement("select");
          $select.className = "dt-input";
          $select.style.width = "100%";
          ["IN", "OUT"].forEach((log_type) => $select.add(new Option(log_type, log_type)));
          parent.appendChild($select);

          return {
            initValue(val) {
              $select.value = val || "IN";
              $select.focus();
            },
            getValue() {
              return $select.value;
            },
            setValue(newValue) {
              if (newValue !== data.log_type) save_checkin(data, field, newValue);
            },
          };
        }

        return false;
      },
    });
  },

  onload: function (report) {
    report.page.add_button(__("Add Punch"), () => open_add_punch_dialog(report), {
      btn_class: "btn-primary",
      icon: "add",
    });

    report.page.add_inner_button(
      __("Delete Punches"),
      () => delete_selected_punches(report),
      __("Manage"),
    );
    report.page.add_inner_button(
      __("Rebuild Workdays"),
      () => rebuild_selected_workdays(report),
      __("Manage"),
    );
    report.page.add_inner_button(
      __("Bulk Add"),
      () => frappe.ui.form.show_workday_bulk_add(() => refresh_report()),
      __("Manage"),
    );

    const today = frappe.datetime.get_today();
    const week_start = frappe.datetime.week_start();
    const set_period = (from_date, to_date) => report.set_filter_value({ from_date, to_date });
    report.page.add_inner_button(__("This Week"), () => set_period(week_start, today), __("Period"));
    report.page.add_inner_button(
      __("Last Week"),
      () =>
        set_period(frappe.datetime.add_days(week_start, -7), frappe.datetime.add_days(week_start, -1)),
      __("Period"),
    );
    report.page.add_inner_button(
      __("This Month"),
      () => set_period(frappe.datetime.month_start(), today),
      __("Period"),
    );
  },

  after_datatable_render: function (datatable) {
    if (!datatable) return;

    // Clear any stale checked rows from a previous render
    if (datatable.rowmanager) {
      datatable.rowmanager.checkMap = [];
      datatable.rowmanager.getCheckedRows = () =>
        datatable.rowmanager.checkMap.reduce((acc, val, i) => {
          if (val) acc.push(i);
          return acc;
        }, []);
    }

    // Keep the tree the way the user had it across refreshes caused by edits
    if (wm_open_nodes) {
      restore_tree_state(datatable, wm_open_nodes);
      wm_open_nodes = null;
    }

    // Clear all cell styling first to remove stale styles from previous renders
    datatable.datamanager.rows.forEach((row, rowIndex) => {
      datatable.datamanager.columns.forEach((_, colIdx) => {
        datatable.style.setStyle(`.dt-cell--${colIdx}-${rowIndex}`, {
          backgroundColor: "",
          fontWeight: "",
        });
      });
    });

    // Style group-level rows
    datatable.datamanager.rows.forEach((row, rowIndex) => {
      const rowData = datatable.datamanager.data[rowIndex];
      if (!rowData) return;

      if (rowData.row_type === "group") {
        datatable.datamanager.columns.forEach((_, colIdx) => {
          datatable.style.setStyle(`.dt-cell--${colIdx}-${rowIndex}`, {
            backgroundColor: "var(--bg-light-gray, #f5f7fa)",
            fontWeight: "400",
          });
        });
      }
    });
  },
};

// ---------------------------------------------------------------------------
// Tree state
// ---------------------------------------------------------------------------

function refresh_report() {
  const datatable = frappe.query_report.datatable;
  if (datatable) {
    const data = datatable.datamanager.data;
    wm_open_nodes = new Set(
      datatable.datamanager
        .getRows()
        .filter((row) => !row.meta.isLeaf && !row.meta.isTreeNodeClose)
        .map((row) => data[row.meta.rowIndex]?.row_key),
    );
  }
  frappe.query_report.refresh();
}

function restore_tree_state(datatable, open_nodes) {
  const data = datatable.datamanager.data;
  const visible = [];
  // indent of the closed node whose descendants are currently being skipped
  let closed_indent = null;

  datatable.datamanager.getRows().forEach((row) => {
    const { indent, isLeaf, rowIndex } = row.meta;
    const hidden = closed_indent !== null && indent > closed_indent;
    if (!isLeaf) row.meta.isTreeNodeClose = hidden || !open_nodes.has(data[rowIndex]?.row_key);
    if (hidden) return;

    visible.push(rowIndex);
    closed_indent = !isLeaf && row.meta.isTreeNodeClose ? indent : null;
  });

  datatable.rowmanager.showRows(visible);
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function get_checked_data(report) {
  const datatable = report.datatable;
  if (!datatable) return [];
  return datatable.rowmanager
    .getCheckedRows()
    .map((rowIndex) => datatable.datamanager.data[rowIndex])
    .filter((row) => row && row.row_type !== "total");
}

function save_checkin(data, fieldname, value) {
  frappe.call({
    method: `${WM_METHOD}.update_checkin`,
    args: { checkin: data.checkin, fieldname: fieldname, value: value },
    callback: (r) => {
      if (r.message) frappe.show_alert({ message: r.message, indicator: "green" }, 3);
    },
    // Refresh on failure too, so the cell drops the rejected value
    always: () => refresh_report(),
  });
}

function open_add_punch_dialog(report) {
  // Prefill from the first selected row, suggesting the log type the day needs next
  const selected = get_checked_data(report)[0] || {};
  const punches = (report.data || []).filter(
    (row) =>
      row.row_type === "checkin" && row.employee === selected.employee && row.date === selected.date,
  );

  const dialog = new frappe.ui.Dialog({
    title: __("Add Punch"),
    fields: [
      {
        fieldname: "employee",
        label: __("Employee"),
        fieldtype: "Link",
        options: "Employee",
        reqd: 1,
        default: selected.employee,
      },
      {
        fieldname: "date",
        label: __("Date"),
        fieldtype: "Date",
        reqd: 1,
        default: selected.date || frappe.datetime.get_today(),
      },
      { fieldtype: "Column Break" },
      {
        fieldname: "time",
        label: __("Time"),
        fieldtype: "Time",
        reqd: 1,
      },
      {
        fieldname: "log_type",
        label: __("Log Type"),
        fieldtype: "Select",
        options: "IN\nOUT",
        reqd: 1,
        default: punches.length % 2 ? "OUT" : "IN",
      },
    ],
    primary_action_label: __("Add"),
    primary_action: function (values) {
      frappe.call({
        method: `${WM_METHOD}.add_checkin`,
        args: values,
        freeze: true,
        freeze_message: __("Adding punch..."),
        callback: (r) => {
          dialog.hide();
          frappe.show_alert({ message: r.message, indicator: "green" }, 3);
          refresh_report();
        },
      });
    },
  });
  dialog.show();
}

function delete_selected_punches(report) {
  const checkins = get_checked_data(report)
    .filter((row) => row.row_type === "checkin")
    .map((row) => row.checkin);

  if (checkins.length === 0) {
    frappe.msgprint(__("Please select at least one punch row using the checkboxes"));
    return;
  }

  frappe.confirm(
    __("Delete {0} punch(es)? Their workdays will be recalculated.", [checkins.length]),
    () => {
      frappe.call({
        method: `${WM_METHOD}.delete_checkins`,
        args: { checkins: checkins },
        freeze: true,
        freeze_message: __("Deleting punches..."),
        callback: (r) => {
          frappe.show_alert({ message: r.message, indicator: "green" }, 5);
          refresh_report();
        },
      });
    },
  );
}

function rebuild_selected_workdays(report) {
  const data = report.data || [];
  const workday_rows = data.filter((row) => row.row_type === "workday");
  const selected = get_checked_data(report);

  let rows;
  if (selected.length) {
    // Groups expand to their workdays; workday and punch rows stand for their own day
    rows = selected.flatMap((row) => {
      if (row.row_type !== "group") return [row];
      return workday_rows.filter((wd) =>
        row.employee ? wd.employee === row.employee : wd.date === row.date,
      );
    });
  } else {
    rows = workday_rows.filter((row) => WM_REBUILD_STATUSES.includes(row.status));
  }

  const days = Object.values(
    Object.fromEntries(
      rows.map((row) => [
        `${row.employee}:${row.date}`,
        { employee: row.employee, date: row.date },
      ]),
    ),
  );

  if (days.length === 0) {
    frappe.msgprint(__("Nothing to rebuild. Select rows, or no workdays in view are out of sync."));
    return;
  }

  const message = selected.length
    ? __("Rebuild {0} workday(s) from their punches?", [days.length])
    : __("Rebuild {0} workday(s) that are out of sync or missing?", [days.length]);

  frappe.confirm(message, () => {
    frappe.call({
      method: `${WM_METHOD}.rebuild_workdays`,
      args: { days: days },
      freeze: true,
      freeze_message: __("Rebuilding workdays..."),
      callback: (r) => {
        frappe.show_alert({ message: r.message, indicator: "green" }, 5);
        refresh_report();
      },
    });
  });
}
