// frappe.web_form is employee_timelog.js
// function reset_form(form_entry) {
// 	// reset the form
// 	update_form_value(form_entry, 'manual_override', '');
// 	update_form_value(form_entry, 'manual_override_date', frappe.datetime.now_date());
// 	update_form_value(form_entry, 'manual_override_time', '');
// 	update_form_value(form_entry, 'time', '');
// 	update_form_value(form_entry, 'log_type', 'IN');
// 	update_form_value(form_entry, 'employee', '');
// 	jQuery("input[data-fieldname='employee']").focus();
// }

// function update_form_value(form_entry, field_name, value) {
// 	form_entry[field_name] = value;
// 	frappe.web_form.set_value(field_name, value);
// }

// function save_form(form_entry) {
// 	// save the form
// 	Object.assign(frappe.web_form.doc, form_entry);
// 	frappe.web_form.doc.doctype = frappe.web_form.doc_type;
// 	frappe.web_form.doc.web_form_name = frappe.web_form.name;
// 	// make sure employee is set
// 	if (!'employee' in form_entry) {
// 		return;
// 	}
// 	// make sure time isn't in the future
// 	else if (Date.parse(form_entry.time) > Date.parse(frappe.datetime.now_datetime())) {
// 		time_travel_gif = 'https://media4.giphy.com/media/3ov9jU4ycPvfrPTsly/giphy.gif';
// 		alert_message = '<b>Time Traveler!</b><br>It looks like you are trying to clock in the future. Please check your time and try again.<br><img src="' + time_travel_gif + '" style="width: 100%; max-width: 10rem; margin-top: 1rem;">';
// 		frappe.show_alert({
// 			message: __(alert_message),
// 			indicator: 'orange'
// 		}, 5);
// 		reset_form(form_entry);
// 		return;
// 	}
// 	// tests passed, save the form
// 	else {
// 		window.saving = true;
// 		frappe.form_dirty = false;
// 		frappe.call({
// 			type: "POST",
// 			method: "timeclock.timeclock.api.submit_checkin",
// 			args: {
// 				web_form: frappe.web_form.name,
// 				data: frappe.web_form.doc
// 			},
// 			callback: function (response) {
// 				employee = form_entry.employee;
// 				log_type = response.message;
// 				reset_form(form_entry);
// 				frappe.call({
// 					method: "timeclock.timeclock.api.get_weekly_hours",
// 					args: {
// 						"employee": employee
// 					},
// 					callback: function (response) {
// 						employee_name = response.message[0];
// 						weekly_hours = response.message[1];
// 						alert_message = '<h3>Clocked ' + log_type.toLowerCase() + '!</h3><large>' + employee_name + ', you have logged ' + weekly_hours + ' hours this week.</large>';
// 						// set the alert color based on the log type
// 						if (log_type == 'IN') {
// 							alert_color = 'green';
// 						} else {
// 							alert_color = 'red';
// 						}
// 						frappe.show_alert({
// 							message: __(alert_message),
// 							indicator: alert_color
// 						}, 7);
// 					},
// 					error: (r) => {
// 						reset_form(form_entry);
// 					}
// 				});
// 			}
// 		});
// 		return;
// 	}
// }

// frappe.init_client_script = () => {
// 	try {

// 		var firstOpen = true;
// 		var time;

// 		const manual_override_time = new tempusDominus.TempusDominus(document.querySelector("[data-fieldname='manual_override_time']"), {
// 			display: {
// 				viewMode: 'clock',
// 				theme: 'light',
// 				icons: {
// 					type: 'icons',
// 					up: 'octicon octicon-chevron-up',
// 					down: 'octicon octicon-chevron-down'
// 				},
// 				components: {
// 					decades: false,
// 					year: false,
// 					month: false,
// 					date: false,
// 					hours: true,
// 					minutes: true,
// 					seconds: false
// 				}
// 			}
// 		});

// 		// focus on the employee field on page load
// 		frappe.web_form.after_load = () => {
// 			jQuery("input[data-fieldname='employee']").focus();
// 		}

// 		// create "clock in" and "clock out" buttons from the "log_type" select/dropdown
// 		jQuery("select[data-fieldname='log_type'] option").each(function (i, e) {
// 			select_option = jQuery(this).val();
// 			(jQuery("<input type='radio' name='r' style='display:none;' />")
// 				.attr("value", select_option)
// 				.attr("id", select_option)
// 				.attr("checked", i == 0)
// 				.click(function () {
// 					jQuery("select[data-fieldname='log_type']").val(select_option);
// 				}).add($("<label class='btn btn-light btn-lg mr-4' for='" + select_option + "'>Clock " + this.textContent.toLowerCase() + "</label>")))
// 				.appendTo("#r");
// 		});

// 		jQuery("#reset").click(function () {
// 			window.location.href = '/employee-timeclock?new=1';
// 		});

// 		// calculate and set form values, save the form after employee selection
// 		frappe.web_form.on('employee', (field, value) => {
// 			let form_entry = frappe.web_form.get_values();
// 			if ('employee' in form_entry) {
// 				employee = form_entry.employee;
// 			} else {
// 				return;
// 			}
// 			// set the time first
// 			if (form_entry.manual_override) {
// 				update_form_value(form_entry, 'manual_override_time', manual_override_time.viewDate.format({ hour12: false, hour: '2-digit', minute: 'numeric', second: 'numeric' }));
// 				time = form_entry.manual_override_date + ' ' + form_entry.manual_override_time;
// 			} else {
// 				time = frappe.datetime.now_datetime();
// 			}
// 			update_form_value(form_entry, 'time', time);

// 			if (form_entry.manual_override) {
// 				save_form(form_entry);
// 			} else {
// 				// get the next log time from the API
// 				frappe.call({
// 					method: "timeclock.timeclock.api.determine_next_log_type",
// 					args: {
// 						"employee": employee,
// 						"data": form_entry
// 					},
// 					callback: function (response) {
// 						log_type = response.message;
// 						update_form_value(form_entry, 'log_type', log_type);
// 						save_form(form_entry);
// 					}
// 				});
// 			}
// 		});

// 	} catch (e) {
// 		console.error('Error in web form client script');
// 		console.error(e);
// 	}
// }


let timelog_form

frappe.pages['employee_timelog'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Employee Timelog',
		single_column: true
	});
	page.set_title('Employee Clock-in/out')
	// page.set_title_sub('Please scan your ID')
	page.add_menu_item('Select Employee', function () { manual_employee_selection() });
	page.add_button('Manual Time Entry', function () { manual_time_entry() });

	// create a new timelog form
	timelog_form = new frappe.ui.FieldGroup({
		parent: page.body,
		fields: [
			// html field for subtitle
			{ fieldtype: 'HTML', fieldname: 'subtitle', label: 'Subtitle', description: 'Subtitle', options: '<h3>Please scan your ID</h3>' },
			// column break
			{ fieldtype: 'Column Break', fieldname: 'column_break_1' },
			// html field for clock
			{ fieldtype: 'HTML', fieldname: 'clock', label: 'Clock', description: 'Clock' },
			// html field for the date
			{ fieldtype: 'HTML', fieldname: 'date', label: 'Date', description: 'Date' },
			// section break
			{ fieldtype: 'Section Break', fieldname: 'section_break_1' },
			// button for manual time entry
			// { fieldtype: 'Button', fieldname: 'manual_time_entry', label: 'Manual Time Entry'},
			// employee html field
			{ fieldtype: 'HTML', fieldname: 'employee', label: 'Employee', description: 'Employee Name', options: '<h4 id="employee"></h4>' },
			// html field for reload button
			// { fieldtype: 'HTML', fieldname: 'reload', label: 'Reload', description: 'Reload the page', options: '<button class="btn btn-primary btn-lg" onclick="window.location.reload();">Reload</button>' },
		],
	});
	timelog_form.make();

	updateClock();
	setInterval(updateClock, 1000);
	select_employee();

	// on click on the manual time entry button, open a modal with a link field to select the employee
	// timelog_form.fields_dict.manual_time_entry.$input.on('click', function () {
	// 	manual_time_entry();
	// });
}

async function select_employee() {
	// use the web nfc api to get the employee id from the nfc tag
	try {
		const reader = new NDEFReader();
		await reader.scan();
		reader.onreading = async event => {
			const records = event.message.records;
			const employee_tag_id = new TextDecoder().decode(records[0].data);
			// find the employee whose attendance device id matches the employee tag id
			employee_list = await frappe.db.get_list('Employee', { fields: ['employee_name', 'name'], filters: { attendance_device_id: employee_tag_id } });
			locals.employee = employee_list[0];
			set_employee();
		}
	} catch (error) {
		frappe.show_alert({ message: error, indicator: 'orange' });
		// open a modal with a link field to select the employee
		// manual_employee_selection();
	}
}

async function manual_employee_selection() {
	const d = new frappe.ui.Dialog({
		title: 'Select Employee',
		fields: [
			{
				fieldtype: 'Link',
				fieldname: 'employee',
				label: 'Employee',
				options: 'Employee',
				reqd: 1,
			}
		],
	});
	d.fields_dict.employee.$input.on('awesomplete-selectcomplete', async function () {
		// filter to just get employee_name and name fields. we don't want all the employee data being accessed here.
		employee_list = await frappe.db.get_list('Employee', { fields: ['employee_name', 'name'], filters: { name: d.get_value('employee') } });
		locals.employee = employee_list[0];
		set_employee();
		d.hide();
	});
	d.show();
}

async function set_employee() {
	// set the employee name in the employee field
	timelog_form.fields_dict.employee.$wrapper.html(`<h4 id="employee">${locals.employee.employee_name}</h4>`);
	log_time();
}

async function log_time() {
	// get the next log time from the API
	frappe.call({
		method: "timeclock.timeclock.api.determine_next_log_type",
		args: {
			"employee": locals.employee.name,
		},
		callback: function (response) {
			log_type = response.message;
			// set the subtitle
			// timelog_form.fields_dict.subtitle.$wrapper.html(`<h3>Clock ${log_type.toLowerCase()}</h3>`);
			// set the log type
			// timelog_form.fields_dict.log_type.$input.val(log_type);
			locals.log_type = log_type;
			// save the form
			save_form();
		}
	});
}

async function save_form() {
	// save the form
	const time = frappe.datetime.now_datetime();
	const type = locals.log_type
	const employee = locals.employee.name;
	const doc = await frappe.db.insert({
		doctype: 'Time Log',
		time: time,
		type: type,
		employee: employee,
	});
	// show an alert
	alert_message = `<h3>Clocked ${type.toLowerCase()}!</h3><large>${locals.employee.employee_name}, you have logged ${doc.weekly_hours} hours this week.</large>`;
	// set the alert color based on the log type
	if (type == 'IN') {
		alert_color = 'green';
	} else {
		alert_color = 'red';
	}
	frappe.show_alert({
		message: __(alert_message),
		indicator: alert_color
	}, 7);
}

async function manual_time_entry() {
	const d = new frappe.ui.Dialog({
		title: 'Manual Time Entry',
		fields: [
			// employee link field
			{
				fieldtype: 'Link',
				fieldname: 'employee',
				label: 'Employee',
				options: 'Employee',
				reqd: 1,
			},
			{
				fieldtype: 'Datetime',
				fieldname: 'time',
				label: 'Time',
				reqd: 1,
			},
			{ fieldtype: 'HTML', fieldname: 'type', label: 'Type', description: 'Type', reqd: 1, options: 
				`<h4>Clock in/out</h4>
				<form>
				<input type="radio" id="clock_in" value="Clock In">
				<label for="clock_in">Clock In</label><br>
				<input type="radio" id="clock_out" value="Clock Out">
				<label for="clock_out">Clock Out</label><br></form>
				</form>`
			},
		],
	});
	d.set_primary_action('Submit', async function () {
		const time = d.get_value('time');
		const type = d.get_value('type');
		const employee = d.get_value('employee');

		d.hide();
	});
	d.show();
}

// run the digital clock
function updateClock() {
	const now = new Date();
	const hours = now.getHours() % 12 || 12;
	const minutes = now.getMinutes().toString().padStart(2, '0');
	const amPm = now.getHours() < 12 ? 'AM' : 'PM';
	const timeString = `${hours}:${minutes} ${amPm}`;
	const dateString = now.toDateString();
	timelog_form.fields_dict.clock.$wrapper.html(`<h1 id="time" style="text-align: right">${timeString}</h1>`);
	timelog_form.fields_dict.date.$wrapper.html(`<h3 id="date" style="text-align: right">${dateString}</h3>`);
}