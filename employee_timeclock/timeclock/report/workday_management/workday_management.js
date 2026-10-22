// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

const WM_METHOD = "employee_timeclock.timeclock.report.workday_management.workday_management";

/**
 * A row of the report (workday_management.py `get_data`/`_day_rows`): a group (employee or day), a
 * Workday under it, the day's punches (Employee Checkins) under that, a blank row to add a punch,
 * and the closing total.
 * @typedef {object} WMRow
 * @property {"group" | "workday" | "checkin" | "new_punch" | "total"} row_type
 * @property {string} [row_key]
 * @property {number} [indent]
 * @property {string} [label]
 * @property {string} [employee]
 * @property {string} [employee_name]
 * @property {string} [date]
 * @property {string} [status]
 * @property {string} [issues]
 * @property {number} [issue_count]
 * @property {string} [workday]
 * @property {string} [checkin]
 * @property {string} [time_value]
 * @property {number | null} [hours]
 * @property {string} [overridden_time]
 */

/** @typedef {{ employee: string; date: string }} WMDay */

/** @type {Record<string, string>} */
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
const WM_REBUILD_STATUSES = ["No Workday", "Out of Sync", "Log Type Mismatch"];

// Row backgrounds by tree level: groups darkest, workdays tinted, punches plain.
// Theme surface variables, so the shades flip in dark mode.
/** @type {Record<string, string>} */
const WM_ROW_BACKGROUNDS = {
	group: "var(--surface-gray-3)",
	workday: "var(--surface-blue-1)",
};

// row_keys of tree nodes that were open before a refresh we triggered, reapplied after render
/** @type {Set<string | undefined> | null} */
let wm_open_nodes = null;

frappe.provide("frappe.query_reports")["Workday Management"] = {
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
				frappe.query_report?.refresh();
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

	formatter: function (value, row, column, raw_data, default_formatter, _filter) {
		if (!raw_data) return default_formatter(value, row, column, raw_data);
		const data = /** @type {WMRow} */ (/** @type {unknown} */ (raw_data));

		const row_type = data.row_type;
		const field = column.fieldname;

		// ── Total row: bold label and values, skip everything else ──
		if (row_type === "total") {
			if (field === "label") return `<strong>${frappe.utils.escape_html(value || "")}</strong>`;
			if (value != null && value !== "")
				return `<strong>${default_formatter(value, row, column, raw_data)}</strong>`;
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
			// a click handler set in onload opens this row's time editor
			if (row_type === "new_punch") return `<a class="wm-add-punch">+ ${label}</a>`;
			return `<span class="text-muted">${label}</span>`;
		}

		// -- New punch row: prompt for a time, nothing else --
		if (row_type === "new_punch") {
			if (field === "time") return `<span class="text-muted">${__("Double-click to add")}</span>`;
			return "";
		}

		// ── Status column: issue count on groups, indicator pill on workdays ──
		if (field === "status") {
			if (row_type === "group") {
				if (!data.issue_count) return "";
				return `<span class="indicator-pill orange">${__("{0} issue(s)", [data.issue_count])}</span>`;
			}
			if (row_type === "workday" && value) {
				const color = WM_STATUS_COLORS[String(value)] || "gray";
				const title = frappe.utils.escape_html(data.issues || "");
				return `<span class="indicator-pill ${color}" title="${title}">${frappe.utils.escape_html(__(String(value)))}</span>`;
			}
			return "";
		}

		// ── Override: show the original punch time on hover ──
		if (field === "override") {
			if (!value) return "";
			const title = data.overridden_time ? __("Originally {0}", [data.overridden_time]) : "";
			return `<span class="indicator-pill orange" title="${frappe.utils.escape_html(title)}">${frappe.utils.escape_html(value)}</span>`;
		}

		// ── Workday link only on workday rows; checkin rows sit right beneath it ──
		if (field === "workday" && row_type !== "workday") return "";

		return default_formatter(value, row, column, raw_data);
	},

	get_datatable_options: function (options) {
		return Object.assign(options, {
			treeView: true,
			checkboxColumn: true,
			serialNoColumn: true,
			cellHeight: 36,
			layout: "fluid",

			/**
			 * @param {number} colIndex
			 * @param {number} rowIndex
			 * @param {unknown} value
			 * @param {HTMLElement} parent
			 * @param {{ fieldname?: string; id?: string }} column
			 * @param {unknown} row
			 * @param {unknown} raw_data
			 */
			getEditor: function (colIndex, rowIndex, value, parent, column, row, raw_data) {
				// Punches (Employee Checkin rows) are editable, (time, and hours on an OUT), plus the time on a
				// day's new punch row
				if (!raw_data) return false;
				const data = /** @type {WMRow} */ (/** @type {unknown} */ (raw_data));
				const field = column.fieldname || column.id;
				const is_new = data.row_type === "new_punch" && field === "time";
				if (data.row_type !== "checkin" && !is_new) return false;

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
						/** @param {string} newValue */
						setValue(newValue) {
							if (!newValue) return;
							if (is_new) add_punch(data, newValue);
							else if (newValue !== data.time_value) save_checkin(data, newValue);
						},
					};
				}

				if (field === "hours" && data.hours != null) {
					const current = data.hours;
					const $input = document.createElement("input");
					$input.type = "number";
					$input.step = "0.01";
					$input.min = "0";
					$input.className = "dt-input";
					$input.style.width = "100%";
					parent.appendChild($input);

					return {
						initValue() {
							$input.value = String(Math.round(current * 100) / 100);
							$input.focus();
						},
						getValue() {
							return $input.value;
						},
						/** @param {string} newValue */
						setValue(newValue) {
							const hours = parseFloat(newValue);
							// the editor shows two decimals, so leaving it as shown is not a change
							if (!(hours > 0) || Math.abs(hours - current) < 0.005) return;
							save_hours(data, hours);
						},
					};
				}

				return false;
			},
		});
	},

	onload: function (report) {
		// "+ Add Punch" opens the time editor on its own row
		report.$report.on("click", ".wm-add-punch", (e) => {
			e.preventDefault();
			const datatable = report.datatable;
			if (!datatable) return;
			const rowIndex = $(e.currentTarget).closest(".dt-cell").data("row-index");
			const time_column = datatable.datamanager.getColumns().find((col) => col.id === "time");
			if (time_column?.colIndex === undefined) return;
			const $cell = /** @type {HTMLElement | undefined} */ (
				datatable.cellmanager.getCell$(time_column.colIndex, rowIndex)
			);
			if ($cell) datatable.cellmanager.activateEditing($cell);
		});
		report.page.add_button(__("Add Punch"), () => open_add_punch_dialog(report), {
			btn_class: "btn-primary",
			icon: "add",
		});

		report.page.add_inner_button(__("Delete Punches"), () => delete_selected_punches(report), __("Manage"));
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
		/**
		 * @param {string} from_date
		 * @param {string} to_date
		 */
		const set_period = (from_date, to_date) => report.set_filter_value({ from_date, to_date });
		report.page.add_inner_button(__("This Week"), () => set_period(week_start, today), __("Period"));
		report.page.add_inner_button(
			__("Last Week"),
			() => set_period(frappe.datetime.add_days(week_start, -7), frappe.datetime.add_days(week_start, -1)),
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
				}, /** @type {number[]} */ ([]));
		}

		// Keep the tree the way the user had it across refreshes caused by edits
		if (wm_open_nodes) {
			restore_tree_state(datatable, wm_open_nodes);
			wm_open_nodes = null;
		}

		shade_rows(datatable);
	},
};

// ---------------------------------------------------------------------------
// Row Shading
// ---------------------------------------------------------------------------

// One rule per shaded row in a stylesheet of our own, rewritten whole on each render.
//datatable.style.setStyle scans every existing rule per call, so a rule per cell
// (rows x columns) locks the page up once a refresh starts replacing them.
/** @param {import("frappe-types").DataTable} datatable */
function shade_rows(datatable) {
	let style_el = datatable.wrapper.querySelector("style.wm-row-shading");
	if (!style_el) {
		style_el = document.createElement("style");
		style_el.className = "wm-row-shading";
		datatable.wrapper.prepend(style_el);
	}

	const scope = `.${datatable.style.scopeClass}`;
	style_el.textContent = datatable.datamanager.data
		.map((row, rowIndex) => {
			const background = WM_ROW_BACKGROUNDS[/** @type {WMRow | undefined} */ (row)?.row_type ?? ""];
			return background ? `${scope} .dt-row-${rowIndex} .dt-cell { background-color: ${background}; }` : "";
		})
		.join("\n");
}

// ---------------------------------------------------------------------------
// Tree state
// ---------------------------------------------------------------------------

function refresh_report() {
	const datatable = frappe.query_report?.datatable;
	if (datatable) {
		const data = datatable.datamanager.data;
		wm_open_nodes = new Set(
			datatable.datamanager
				.getRows()
				.filter((row) => !row.meta.isLeaf && !row.meta.isTreeNodeClose)
				.map((row) => /** @type {WMRow | undefined} */ (data[row.meta.rowIndex])?.row_key),
		);
	}
	frappe.query_report?.refresh();
}

/**
 * @param {import("frappe-types").DataTable} datatable
 * @param {Set<string | undefined>} open_nodes
 */
function restore_tree_state(datatable, open_nodes) {
	const data = datatable.datamanager.data;
	/** @type {number[]} */
	const visible = [];
	// indent of the closed node whose descendants are currently being skipped
	/** @type {number | null} */
	let closed_indent = null;

	datatable.datamanager.getRows().forEach((row) => {
		const { indent, isLeaf, rowIndex } = row.meta;
		const hidden = closed_indent !== null && (indent ?? 0) > closed_indent;
		if (!isLeaf)
			row.meta.isTreeNodeClose =
				hidden || !open_nodes.has(/** @type {WMRow | undefined} */ (data[rowIndex])?.row_key);
		if (hidden) return;

		visible.push(rowIndex);
		closed_indent = !isLeaf && row.meta.isTreeNodeClose ? (indent ?? null) : null;
	});

	datatable.rowmanager.showRows(visible);
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/**
 * @param {frappe.views.QueryReport} report
 * @returns {WMRow[]}
 */
function get_checked_data(report) {
	const datatable = report.datatable;
	if (!datatable) return [];
	return datatable.rowmanager
		.getCheckedRows()
		.map((rowIndex) => /** @type {WMRow | undefined} */ (datatable.datamanager.data[rowIndex]))
		.filter(
			/**
			 * @param {WMRow | undefined} row
			 * @returns {row is WMRow}
			 */
			(row) => row !== undefined && row.row_type !== "total",
		);
}

/**
 * @param {WMRow} data
 * @param {string} time
 */
function save_checkin(data, time) {
	frappe.call({
		method: `${WM_METHOD}.update_checkin`,
		args: { checkin: data.checkin, time: time },
		callback: (r) => {
			if (r.message) frappe.show_alert({ message: /** @type {string} */ (r.message), indicator: "green" }, 3);
		},
		// Refresh on failure too, so the cell drops the rejected value
		always: () => refresh_report(),
	});
}


/**
 * @param {WMRow} data
 * @param {number} hours
 */
function save_hours(data, hours) {
	frappe.call({
		method: `${WM_METHOD}.set_punch_hours`,
		args: { checkin: data.checkin, hours: hours },
		callback: (r) => {
			if (r.message) frappe.show_alert({ message: /** @type {string} */ (r.message), indicator: "green"}, 3);
		},
		// Refresh on failure too, so the cell drops the rejected value
		always: () => refresh_report(),
	});
}

/**
 * @param {WMRow} data
 * @param {string} time
 */
function add_punch(data, time) {
	// log_type is left to the server, which picks it from where the time lands in the day
	frappe.call({
		method: `${WM_METHOD}.add_checkin`,
		args: { employee: data.employee, date: data.date, time: time },
		callback: (r) => {
			if (r.message) frappe.show_alert({ message: /** @type {string} */ (r.message), indicator: "green" }, 3);
		},
		// Refresh on failure too, so the row drops the rejected value
		always: () => refresh_report(),
	});
}

/** @param {frappe.views.QueryReport} report */
function open_add_punch_dialog(report) {
	// Prefill from the first selected row, suggesting the log type the day needs next
	const selected = get_checked_data(report)[0];

	const dialog = new frappe.ui.Dialog({
		title: __("Add Punch"),
		fields: [
			{
				fieldname: "employee",
				label: __("Employee"),
				fieldtype: "Link",
				options: "Employee",
				reqd: 1,
				default: selected?.employee,
			},
			{
				fieldname: "date",
				label: __("Date"),
				fieldtype: "Date",
				reqd: 1,
				default: selected?.date || frappe.datetime.get_today(),
			},
			{ fieldname: "column_break", fieldtype: "Column Break" },
			{
				fieldname: "time",
				label: __("Time"),
				fieldtype: "Time",
				reqd: 1,
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
					frappe.show_alert({ message: /** @type {string} */ (r.message), indicator: "green" }, 3);
					refresh_report();
				},
			});
		},
	});
	dialog.show();
}

/** @param {frappe.views.QueryReport} report */
function delete_selected_punches(report) {
	const checkins = get_checked_data(report)
		.filter((row) => row.row_type === "checkin")
		.map((row) => row.checkin);

	if (checkins.length === 0) {
		frappe.msgprint(__("Please select at least one punch row using the checkboxes"));
		return;
	}

	frappe.confirm(__("Delete {0} punch(es)? Their workdays will be recalculated.", [checkins.length]), () => {
		frappe.call({
			method: `${WM_METHOD}.delete_checkins`,
			args: { checkins: checkins },
			freeze: true,
			freeze_message: __("Deleting punches..."),
			callback: (r) => {
				frappe.show_alert({ message: /** @type {string} */ (r.message), indicator: "green" }, 5);
				refresh_report();
			},
		});
	});
}

/** @param {frappe.views.QueryReport} report */
function rebuild_selected_workdays(report) {
	const data = /** @type {WMRow[]} */ (/** @type {unknown} */ (report.data || []));
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
		rows = workday_rows.filter((row) => WM_REBUILD_STATUSES.includes(row.status ?? ""));
	}

	const days = Object.values(
		Object.fromEntries(
			rows.map((row) => [`${row.employee}:${row.date}`, { employee: row.employee, date: row.date }]),
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
				frappe.show_alert({ message: /** @type {string} */ (r.message), indicator: "green" }, 5);
				refresh_report();
			},
		});
	});
}
