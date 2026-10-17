// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// frappe.web_form is employee_timelog.js

/** @typedef {Record<string, unknown>} FormEntry the web form's values, as frappe.web_form.get_values() returns them */

/** @param {FormEntry} form_entry */
function reset_form(form_entry) {
	// reset the form
	update_form_value(form_entry, "manual_override", "");
	// Use YYYY-MM-DD (internal format); ControlDate.validate() requires it.
	update_form_value(form_entry, "manual_override_date", frappe.datetime.now_date());
	update_form_value(form_entry, "manual_override_time", "");
	update_form_value(form_entry, "time", "");
	update_form_value(form_entry, "log_type", "IN");
	update_form_value(form_entry, "employee", "");
	jQuery("input[data-fieldname='employee']").focus();
}

/**
 * @param {FormEntry} form_entry
 * @param {string} field_name
 * @param {unknown} value
 */
function update_form_value(form_entry, field_name, value) {
	form_entry[field_name] = value;
	frappe.web_form.set_value(field_name, value);
}

/** @param {FormEntry} form_entry */
function save_form(form_entry) {
	// save the form
	Object.assign(frappe.web_form.doc, form_entry);
	frappe.web_form.doc.doctype = frappe.web_form.doc_type;
	frappe.web_form.doc.web_form_name = frappe.web_form.name;
	// make sure employee is set
	if (!("employee" in form_entry)) {
		return;
	}
	// make sure time isn't in the future
	else if (Date.parse(String(form_entry.time)) > Date.parse(frappe.datetime.now_datetime())) {
		const time_travel_gif = "https://media4.giphy.com/media/3ov9jU4ycPvfrPTsly/giphy.gif";
		const alert_message =
			'<b>Time Traveler!</b><br>It looks like you are trying to clock in the future. Please check your time and try again.<br><img src="' +
			time_travel_gif +
			'" style="width: 100%; max-width: 10rem; margin-top: 1rem;">';
		frappe.show_alert(
			{
				message: __(alert_message),
				indicator: "orange",
			},
			5,
		);
		reset_form(form_entry);
		return;
	}
	// tests passed, save the form
	else {
		window.saving = true;
		frappe.form_dirty = false;
		frappe.call({
			type: "POST",
			method: "timeclock.timeclock.api.submit_checkin",
			args: {
				web_form: frappe.web_form.name,
				data: frappe.web_form.doc,
			},
			callback: function (response) {
				const employee = form_entry.employee;
				const log_type = /** @type {"IN" | "OUT"} */ (response.message);
				reset_form(form_entry);
				frappe.call({
					method: "timeclock.timeclock.api.get_weekly_hours",
					args: {
						employee: employee,
					},
					callback: function (hours_response) {
						const [employee_name, weekly_hours] = /** @type {[string, number]} */ (hours_response.message);
						const heading_color = log_type == "IN" ? "#4ade80" : "#f87171";
						const alert_message =
							"<div style='font-size: 2.5rem; font-weight: 700; line-height: 1.2; color: " +
							heading_color +
							";'>Clocked " +
							log_type.toLowerCase() +
							"!</div><div style='font-size: 2.5rem; font-weight: 600; line-height: 1.2; color: #ffffff;'>" +
							employee_name +
							", you have logged " +
							weekly_hours +
							" hours this week.</div>";
						// set the alert color based on the log type
						let alert_color;
						if (log_type == "IN") {
							alert_color = "green";
						} else {
							alert_color = "red";
						}
						frappe.show_alert(
							{
								message: __(alert_message),
								indicator: alert_color,
							},
							7,
						);
					},
					error: (_r) => {
						reset_form(form_entry);
					},
				});
			},
		});
		return;
	}
}

frappe.init_client_script = () => {
	try {
		var time;

		const manual_override_time = new tempusDominus.TempusDominus(
			/** @type {HTMLElement} */ (document.querySelector("[data-fieldname='manual_override_time']")),
			{
				display: {
					viewMode: "clock",
					theme: "light",
					icons: {
						type: "icons",
						up: "octicon octicon-chevron-up",
						down: "octicon octicon-chevron-down",
					},
					components: {
						decades: false,
						year: false,
						month: false,
						date: false,
						hours: true,
						minutes: true,
						seconds: false,
					},
				},
			},
		);

		// focus on the employee field on page load
		frappe.web_form.after_load = () => {
			jQuery("input[data-fieldname='employee']").focus();
		};

		// create "clock in" and "clock out" buttons from the "log_type" select/dropdown
		jQuery("select[data-fieldname='log_type'] option").each(function (i, e) {
			const select_option = /** @type {string} */ (jQuery(this).val());
			jQuery("<input type='radio' name='r' style='display:none;' />")
				.attr("value", select_option)
				.attr("id", select_option)
				.attr("checked", i == 0 ? "checked" : null)
				.click(function () {
					jQuery("select[data-fieldname='log_type']").val(select_option);
				})
				.add(
					$(
						"<label class='btn btn-light btn-lg mr-4' for='" +
							select_option +
							"'>Clock " +
							e.textContent.toLowerCase() +
							"</label>",
					),
				)
				.appendTo("#r");
		});

		jQuery("#reset").click(function () {
			window.location.href = "/employee-timeclock?new=1";
		});

		// calculate and set form values, save the form after employee selection
		frappe.web_form.on("employee", (_field, _value) => {
			let form_entry = frappe.web_form.get_values();
			if (!form_entry) {
				return;
			}
			let employee;
			if ("employee" in form_entry) {
				employee = form_entry.employee;
			} else {
				return;
			}
			// set the time first
			if (form_entry.manual_override) {
				update_form_value(
					form_entry,
					"manual_override_time",
					manual_override_time.viewDate.format({
						hour12: false,
						hour: "2-digit",
						minute: "numeric",
						second: "numeric",
					}),
				);
				time = form_entry.manual_override_date + " " + form_entry.manual_override_time;
			} else {
				time = frappe.datetime.now_datetime();
			}
			update_form_value(form_entry, "time", time);

			if (form_entry.manual_override) {
				save_form(form_entry);
			} else {
				// get the next log time from the API
				frappe.call({
					method: "timeclock.timeclock.api.determine_next_log_type",
					args: {
						employee: employee,
						data: form_entry,
					},
					callback: function (response) {
						const log_type = /** @type {"IN" | "OUT"} */ (response.message);
						update_form_value(form_entry, "log_type", log_type);
						save_form(form_entry);
					},
				});
			}
		});
	} catch (e) {
		console.error("Error in web form client script");
		console.error(e);
	}
};

// reload the form on the hour
setInterval(function () {
	window.location.href = "/employee-timeclock?new=1";
}, 3600000);

// run the digital clock
function updateClock() {
	const now = new Date();
	const hours = now.getHours() % 12 || 12;
	const minutes = now.getMinutes().toString().padStart(2, "0");
	const amPm = now.getHours() < 12 ? "AM" : "PM";
	const timeString = `${hours}:${minutes} ${amPm}`;
	const dateString = now.toDateString();
	const time = document.getElementById("time");
	const date = document.getElementById("date");
	if (time) time.textContent = timeString;
	if (date) date.textContent = dateString;
}
setInterval(updateClock, 1000);
