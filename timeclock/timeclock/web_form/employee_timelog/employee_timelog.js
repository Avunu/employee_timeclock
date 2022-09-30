// frappe.web_form is employee_timelog.js
function reset_form(form_entry) {
	// reset the form
	update_form_value(form_entry, 'manual_override', '');
	update_form_value(form_entry, 'manual_override_date', frappe.datetime.now_date());
	update_form_value(form_entry, 'manual_override_time', '');
	update_form_value(form_entry, 'time', '');
	update_form_value(form_entry, 'log_type', 'IN');
	update_form_value(form_entry, 'employee', '');
	jQuery("input[data-fieldname='employee']").focus();
}

function update_form_value(form_entry, field_name, value) {
	form_entry[field_name] = value;
	frappe.web_form.set_value(field_name, value);
}

function save_form(form_entry) {
	// save the form
	Object.assign(frappe.web_form.doc, form_entry);
	frappe.web_form.doc.doctype = frappe.web_form.doc_type;
	frappe.web_form.doc.web_form_name = frappe.web_form.name;
	// make sure employee is set
	if (!'employee' in form_entry) {
		return;
	}
	// make sure time isn't in the future
	else if (Date.parse(form_entry.time) > Date.parse(frappe.datetime.now_datetime())) {
		alert_message = "next_alert=<h3>You can't log time in the future!</h3>";
		frappe.show_alert({
			message: __(alert_message),
			indicator: 'yellow'
		}, 5);
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
				data: frappe.web_form.doc
			},
			callback: function (response) {
				employee = form_entry.employee;
				log_type = form_entry.log_type;
				reset_form(form_entry);
				frappe.call({
					method: "timeclock.timeclock.api.get_weekly_hours",
					args: {
						"employee": employee
					},
					callback: function (response) {
						employee_name = response.message[0];
						weekly_hours = response.message[1];
						alert_message = '<h3>Clocked ' + log_type.toLowerCase() + '!</h3><large>' + employee_name + ', you have logged ' + weekly_hours + ' hours this week.</large>';
						// set the alert color based on the log type
						if (log_type == 'IN') {
							alert_color = 'green';
						} else {
							alert_color = 'red';
						}
						frappe.show_alert({
							message: __(alert_message),
							indicator: alert_color
						}, 7);
					},
					error: (r) => {
						reset_form(form_entry);
					}
				});
			}
		});
		return;
	}
}

frappe.init_client_script = () => {
	try {

		var firstOpen = true;
		var time;

		const manual_override_time = new tempusDominus.TempusDominus(document.querySelector("[data-fieldname='manual_override_time']"), {
			display: {
				viewMode: 'clock',
				theme: 'light',
				icons: {
					type: 'icons',
					up: 'octicon octicon-chevron-up',
					down: 'octicon octicon-chevron-down'
				},
				components: {
					decades: false,
					year: false,
					month: false,
					date: false,
					hours: true,
					minutes: true,
					seconds: false
				}
			}
		});

		// focus on the employee field on page load
		frappe.web_form.after_load = () => {
			jQuery("input[data-fieldname='employee']").focus();
		}

		// create "clock in" and "clock out" buttons from the "log_type" select/dropdown
		jQuery("select[data-fieldname='log_type'] option").each(function (i, e) {
			select_option = jQuery(this).val();
			(jQuery("<input type='radio' name='r' style='display:none;' />")
				.attr("value", select_option)
				.attr("id", select_option)
				.attr("checked", i == 0)
				.click(function () {
					jQuery("select[data-fieldname='log_type']").val(select_option);
				}).add($("<label class='btn btn-light btn-lg mr-4' for='" + select_option + "'>Clock " + this.textContent.toLowerCase() + "</label>")))
				.appendTo("#r");
		});

		jQuery("#reset").click(function () {
			window.location.href = '/employee-timeclock?new=1';
		});

		// calculate and set form values, save the form after employee selection
		frappe.web_form.on('employee', (field, value) => {
			let form_entry = frappe.web_form.get_values();
			if ('employee' in form_entry) {
				employee = form_entry.employee;
			} else {
				return;
			}
			// set the time first
			if (form_entry.manual_override) {
				update_form_value(form_entry, 'manual_override_time', manual_override_time.viewDate.format({ hour12: false, hour: '2-digit', minute: 'numeric', second: 'numeric' }));
				time = form_entry.manual_override_date + ' ' + form_entry.manual_override_time;
			} else {
				time = frappe.datetime.now_datetime();
			}
			update_form_value(form_entry, 'time', time);

			if (form_entry.manual_override) {
				save_form(form_entry);
			} else {
				// get the next log time from the API
				frappe.call({
					method: "timeclock.timeclock.api.determine_next_log_type",
					args: {
						"employee": employee,
						"data": form_entry
					},
					callback: function (response) {
						log_type = response.message;
						update_form_value(form_entry, 'log_type', log_type);
						save_form(form_entry);
					}
				});
			}
		});

	} catch (e) {
		console.error('Error in web form client script');
		console.error(e);
	}
}

// reload the form on the hour
setInterval(function () {
	window.location.href = '/employee-timeclock?new=1';
}
	, 3600000);

