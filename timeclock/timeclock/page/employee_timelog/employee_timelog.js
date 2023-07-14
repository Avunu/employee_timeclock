let timelog_form

frappe.pages['employee_timelog'].on_page_load = function (wrapper) {
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
			// { fieldtype: 'Section Break', fieldname: 'section_break_1' },
			// button for manual time entry
			// { fieldtype: 'Button', fieldname: 'manual_time_entry', label: 'Manual Time Entry'},
			// employee html field
			// { fieldtype: 'HTML', fieldname: 'employee', label: 'Employee', description: 'Employee Name', options: '<h4 id="employee"></h4>' },
			// html field for reload button
			// { fieldtype: 'HTML', fieldname: 'reload', label: 'Reload', description: 'Reload the page', options: '<button class="btn btn-primary btn-lg" onclick="window.location.reload();">Reload</button>' },
		],
	});
	timelog_form.make();

	updateClock();
	setInterval(updateClock, 1000);
	// set and interval to reload the page every hour
	setInterval(function () { window.location.reload(); }, 3600000);
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
			locals.manual_override = false;
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
		locals.manual_override = false;
		get_employee_by_name(d.get_value('employee'));
		d.hide();
	});
	d.show();
}

async function get_employee_by_name(employee_name) {
	// filter to just get employee_name and name fields. we don't want all the employee data being accessed here.
	employee_list = await frappe.db.get_list('Employee', { fields: ['employee_name', 'name'], filters: { name: employee_name } });
	locals.employee = employee_list[0];
	set_employee();
}

async function set_employee() {
	// set the employee name in the employee field
	// timelog_form.fields_dict.employee.$wrapper.html(`<h4 id="employee">${locals.employee.employee_name}</h4>`);
	log_time();
}

async function log_time() {
	// get the next log time from the API
	frappe.call({
		method: "timeclock.timeclock.api.determine_next_log_type",
		args: {
			"employee": locals.employee.name,
			"data": null
		},
		callback: function (response) {
			log_type = response.message;
			// set the subtitle
			// timelog_form.fields_dict.subtitle.$wrapper.html(`<h3>Clock ${log_type.toLowerCase()}</h3>`);
			// set the log type
			// timelog_form.fields_dict.log_type.$input.val(log_type);
			locals.log_type = log_type;
			locals.time = frappe.datetime.now_datetime();
			// save the form
			save_form();
		}
	});
}

async function save_form() {
	if (Date.parse(locals.time) > Date.parse(frappe.datetime.now_datetime())) {
		time_travel_gif = 'https://media4.giphy.com/media/3ov9jU4ycPvfrPTsly/giphy.gif';
		alert_message = '<b>Time Traveler!</b><br>It looks like you are trying to log time in the future. Please check your time and try again.<br><img src="' + time_travel_gif + '" style="width: 100%; max-width: 10rem; margin-top: 1rem;">';
		frappe.show_alert({
			message: __(alert_message),
			indicator: 'orange'
		}, 5);
		// reset_form(form_entry);
		return;
	}
	// save the form
	await frappe.call({
		// type: "POST",
		// // /var/www/pequea.avu.nu/html/apps/timeclock/timeclock/timeclock/page/employee_timelog/employee_timelog.py
		// method: "timeclock.timeclock.page.employee_timelog.employee_timelog.submit_checkin",
		// /var/www/pequea.avu.nu/html/apps/timeclock/timeclock/timeclock/api.py
		method: "timeclock.timeclock.api.submit_checkin2",
		args: {
			data: {
				employee: locals.employee.name,
				time: locals.time,
				log_type: locals.log_type,
				manual_override: locals.manual_override,
				device_id: 'Employee Clock-in/out Device'
			}
		}
	});
	const weekly_hours = await frappe.call({
		method: "timeclock.timeclock.api.get_weekly_hours",
		args: {
			"employee": locals.employee.name
		}
	});
	// show an alert
	alert_message = `<h3>Clocked ${locals.log_type.toLowerCase()}!</h3><large>${locals.employee.employee_name}, you have logged ${weekly_hours.message[1]} hours this week.</large>`;
	// set the alert color based on the log type
	if (locals.log_type == 'IN') {
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
				fieldtype: 'HTML',
				fieldname: 'time',
				label: 'Time',
				description: 'Time',
				// options will be an html time field
				options: `
					<form>
						<label for="startTime">Time: </label>
						<input type="time" id="startTime" />
					</form>
				`,
			},
			// field for the date
			{
				fieldtype: 'Date',
				fieldname: 'date',
				label: 'Date',
				description: 'Date',
				default: frappe.datetime.now_date(),
				reqd: 1,
			},
			{
				fieldtype: 'HTML',
				fieldname: 'log_type',
				label: 'Log Type',
				description: 'Log Type',
				options: `
					<h4>Clock in/out</h4>
					<form>
						<input type="radio" id="clock_in" name="log_type" value="Clock In">
						<label for="clock_in">Clock In</label><br>
						<input type="radio" id="clock_out" name="log_type" value="Clock Out">
						<label for="clock_out">Clock Out</label><br>
					</form>
				`,
			},
		],
	});

	d.set_primary_action('Submit', async function () {
		// locals.time = d.get_value('time');
		// get the time from the time input in the time field
		const time = d.$wrapper.find('#startTime').val();
		const date = d.get_value('date');
		// combine the date and time into a datetime
		locals.time = frappe.datetime.add_days(date, 0) + ' ' + time;
		locals.log_type = document.querySelector('input[name="log_type"]:checked').value;
		locals.manual_override = true;
		if (!locals.time || !locals.log_type) {
			frappe.show_alert({ message: 'Please fill out all fields', indicator: 'orange' });
			return;
		}
		get_employee_by_name(d.get_value('employee'));
		d.hide();
	});

	d.show();
	// render the tempus_dominus_template in the time field
	// could not get this to work
	// d.set_value('time', frappe.render_template('tempus_dominus_template'));

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