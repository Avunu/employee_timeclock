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

/**
 * The punch employee_timeclock.timeclock.api.submit_checkin records and reports back.
 * @typedef {object} KioskPunch
 * @property {"IN" | "OUT"} log_type
 * @property {string} employee_name
 * @property {number} weekly_hours
 */

/** @param {FormEntry} form_entry */
function save_form(form_entry) {
	// the scanned badge; the server works out whose it is
	const badge = String(form_entry.employee || "").trim();
	if (!badge) {
		return;
	}
	// make sure time isn't in the future
	if (Date.parse(String(form_entry.time)) > Date.parse(frappe.datetime.now_datetime())) {
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
	window.saving = true;
	frappe.form_dirty = false;
	frappe.call({
		type: "POST",
		method: "employee_timeclock.timeclock.api.submit_checkin",
		args: {
			badge: badge,
			time: form_entry.time,
			log_type: form_entry.log_type,
			manual_override: form_entry.manual_override ? 1 : 0,
		},
		callback: function (response) {
			reset_form(form_entry);
			const punch = /** @type {KioskPunch} */ (response.message);
			const heading_color = punch.log_type == "IN" ? "#4ade80" : "#f87171";
			const alert_message =
				"<div style='font-size: 2.5rem; font-weight: 700; line-height: 1.2; color: " +
				heading_color +
				";'>Clocked " +
				punch.log_type.toLowerCase() +
				"!</div><div style='font-size: 2.5rem; font-weight: 600; line-height: 1.2; color: #ffffff;'>" +
				frappe.utils.escape_html(punch.employee_name) +
				", you have logged " +
				punch.weekly_hours +
				" hours this week.</div>";
			frappe.show_alert(
				{
					message: alert_message,
					indicator: punch.log_type == "IN" ? "green" : "red",
				},
				7,
			);
		},
		error: () => {
			// an unknown badge, a missing kiosk role or the scan rate limit: frappe shows the message
			reset_form(form_entry);
		},
	});
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
						up: "tc-chevron tc-chevron-up",
						down: "tc-chevron tc-chevron-down",
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
			if (!form_entry.employee) {
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

			// IN or OUT is the server's call, unless the time was entered by hand
			save_form(form_entry);
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
