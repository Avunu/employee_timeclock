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
			{ fieldtype: 'Button', fieldname: 'manual_time_entry', label: 'Manual Time Entry'},
			// employee html field
			{ fieldtype: 'HTML', fieldname: 'employee', label: 'Employee', description: 'Employee Name', options: '<h4 id="employee">Employee</h4>' },
			// html field for reload button
			{ fieldtype: 'HTML', fieldname: 'reload', label: 'Reload', description: 'Reload the page', options: '<button class="btn btn-primary btn-lg" onclick="window.location.reload();">Reload</button>' },
		],
	});
	timelog_form.make();


			
	updateClock();
	setInterval(updateClock, 1000);
	select_employee();

	// on click on the manual time entry button, open a modal with a link field to select the employee
	timelog_form.fields_dict.manual_time_entry.$input.on('click', function () {
		manual_time_entry();
	});
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

}

async function manual_time_entry() {
	console.log('manual time entry');
	const d = new frappe.ui.Dialog({
		title: 'Manual Time Entry',
		fields: [
			{
				fieldtype: 'Datetime',
				fieldname: 'time',
				label: 'Time',
				reqd: 1,
			},
			// clock out checkbox and clock in checkbox, only one can be checked at a time
			// {
			// 	fieldtype: 'Radio',
			// 	fieldname: 'type',
			// 	label: 'Type',
			// 	options: 'Clock In\nClock Out',
			// 	reqd: 1,
			// },
		],
	});
	d.set_primary_action('Submit', async function () {
		const time = d.get_value('time');
		const type = d.get_value('type');
		const employee = locals.employee.name;
		// const doc = await frappe.db.insert({
		// 	doctype: 'Time Log',
		// 	time: time,
		// 	type: type,
		// 	employee: employee,
		// });
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