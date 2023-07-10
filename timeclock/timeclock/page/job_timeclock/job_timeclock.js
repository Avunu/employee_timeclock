let timeclock_form;
let timerInterval;
// let page;

frappe.pages['job-timeclock'].on_page_load = async function (wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Job Timeclock',
		single_column: true
	});
	page.add_button('Select Employee', function () { manual_employee_selection() });
	page.add_button('Select Workstation', function () { select_workstation() });
	page.add_button('Refresh Jobs', function () { refresh_jobs() });
	timeclock_form = new frappe.ui.FieldGroup({
		parent: page.body,
		// we need a container on the left for job cards and a container on the right for task cards for that job
		// these should be html elements
		fields: [
			// html field for job cards
			{ fieldtype: 'HTML', fieldname: 'job_cards', label: 'Job Cards', reqd: 0 },
			// column break
			{ fieldtype: 'Column Break', fieldname: 'column_break_1', reqd: 0 },
			// html field for task cards
			{ fieldtype: 'HTML', fieldname: 'task_cards', label: 'Task Cards', reqd: 0 },
		],
	});
	timeclock_form.make();
	// get a list of all the workstations
	workstation_list = await frappe.db.get_list('Workstation', { fields: ['name'], filters: {} });
	locals.workstation_list = workstation_list.map(workstation => workstation.name);
	await get_and_render_jobs();
	locals.timer = false;
	select_employee();

	// add event listener to job cards container
	// when a job card is clicked, get the tasks for that job and render them in the task cards container
	timeclock_form.fields_dict.job_cards.$wrapper.on('click', async function (event) {
		// find the job in locals.jobs that matches the job card that was clicked
		const job_name = $(event.target).closest('.card').find('.card-title').text();
		locals.selected_job = locals.jobs.find(job => job.name === job_name);
		// put a dark blue border around the selected job card
		const selected_job_card = $(event.target).closest('.card');
		highlight_card(selected_job_card, 'selected_job_card')
		// get the tasks for the selected job and render them in the task cards container
		get_and_render_tasks(job_name)
	});
	// add event listener to task cards container
	timeclock_form.fields_dict.task_cards.$wrapper.on('click', async function (event) {
		if ($(event.target).hasClass('active-btn')) {
			const task_operation = $(event.target).closest('.card').find('.card-title').text();
			let task = locals.tasks.find(task => task.operation === task_operation);
			const operator = event.target.innerText
			if (operator === 'Start' || operator === 'Stop' || operator === 'Finish' && locals.timer) {
				task = await log_time(event, task, operator);
			}
			if (operator === 'Finish') {
				await complete_task(task);
				return;
			}
			// this needs to be here so that if someone else closed the task on a different device, it will be reflected here.
			if (task.status === "Completed") {
				get_and_render_tasks(locals.selected_job.name);
			} else {
				locals.selected_task = task;
				const selected_task_card = $(event.target).closest('.card');
				highlight_card(selected_task_card, 'selected_task_card');
			}
		}
	});
}

// this gets all active jobs and renders them in the job cards container
async function get_and_render_jobs() {
	const jobs = await frappe.db.get_list('Work Order', {
		fields: ['*'],
		filters: {
			status: ['not in', ['Completed', 'Stopped', 'Cancelled']]
		}
	});
	locals.jobs = jobs;
	const job_cards = frappe.render_template('job_cards', { jobs: jobs });
	timeclock_form.set_value('job_cards', job_cards);
	return jobs;
}

// this gets all tasks for a given job
async function get_and_render_tasks(job_name) {
	const tasks = await frappe.db.get_list('Job Card', {
		fields: ['*'],
		filters: {
			work_order: job_name,
			status: ['not in', ['Completed', 'Cancelled']],
			workstation: locals.workstation || ['in', locals.workstation_list]
		},
		order_by: 'operation'
	});
	locals.tasks = tasks;
	const task_cards = frappe.render_template('task_cards', { tasks: tasks });
	timeclock_form.set_value('task_cards', task_cards);
	// TODO: change this check so it just sees if there are any tasks at all for the job
	if (!tasks.length && !locals.workstation) {
		// if there are no more tasks on that job, this asks the user if they want to mark it as complete
		frappe.confirm(
			`There are no tasks for ${job_name}. Would you like to mark the job as complete?`,
			async function () {
				await frappe.db.set_value('Work Order', job_name, 'status', 'Completed');
				frappe.show_alert({ message: `${job_name} marked as complete.`, indicator: 'green' });
				refresh_jobs();
			},
		)
	}
}

async function refresh_jobs() {
	const jobs = await get_and_render_jobs();
	// find the html element for the selected job card and add a dark blue border around it
	if (jobs.some(job => job.name === locals.selected_job.name)) {
		const selected_job_card = timeclock_form.fields_dict.job_cards.$wrapper.find(`.card:contains(${locals.selected_job.name})`);
		// highlight_job(selected_job_card);
		highlight_card(selected_job_card, 'selected_job_card');
	} else {
		// clear the task cards container
		timeclock_form.set_value('task_cards', '');
	}
}

function highlight_card(selected_card, card_type) {
	if (locals[card_type]) {
		locals[card_type].css('border', '2px solid var(--border-color)');
	}
	locals[card_type] = selected_card;
	selected_card.css('border', '2px solid #0B3D91');
}

async function log_time(event, task, operator) {
	// get all the task card elements
	const task_cards = timeclock_form.fields_dict.task_cards.$wrapper.find('.card');
	if (!locals.employee) {
		frappe.throw('Please select an employee.');
	}
	if (operator === 'Start') {
		// for each card other than the one that was clicked, set the finish buttons to class inactive-btn
		task_cards.each(function () {
			if ($(this).find('.card-title').text() !== task.operation) {
				$(this).find('.finish-button').removeClass('active-btn').addClass('inactive-btn');
			}
			// check if there is a button that says Stop and if so, set it to say Start and remove the stop-button class and add the start-button class
			if ($(this).find('.stop-button').length) {
				$(this).find('.stop-button').text('Start').removeClass('stop-button').addClass('start-button');
			}
			// set the time taken to ''
			$(this).find('.time-taken').text('');
		});
		// set the button that was clicked to say Stop
		$(event.target).text('Stop').removeClass('start-button').addClass('stop-button');

		const times = await call_for_time_logs(task, operator, locals.employee.name);

		locals.timer = true;
		// Start the timer display
		display_timer(times.from_time, operator);
	} else {
		const times = await call_for_time_logs(task, operator, locals.employee.name);
		if (operator === 'Stop') {
			// set the button that was clicked to say Start and remove the stop-button class and add the start-button class
			$(event.target).text('Start').removeClass('stop-button').addClass('start-button');
		}
		// Stop the timer display
		display_timer(null, operator)
		// set all the buttons to class active-btn
		task_cards.find('.btn-btn').removeClass('inactive-btn').addClass('active-btn');
		locals.timer = false;
		const formatted_time = format_elapsed_time(calculate_elapsed_time(times.from_time, times.to_time));
		frappe.show_alert({ message: `Time logged for ${locals.employee.employee_name} on ${locals.selected_job.production_item} - ${task.operation}: ${formatted_time}`, indicator: 'green', duration: 30 });
	}
	// update the task
	task = await frappe.db.get_doc('Job Card', task.name);
	const task_index = locals.tasks.findIndex(t => t.name === task.name);
	locals.tasks[task_index] = task;
	return task;
}

async function call_for_time_logs(task, operator, employee) {
	const from_time = await frappe.call({
		method: 'timeclock.timeclock.page.job_timeclock.job_timeclock.manage_job_card_time_logs',
		args: {
			job_card: task.name,
			operator: operator,
			employee: employee,
		},
		freeze: true,
	});
	return from_time.message;
}

function display_timer(from_time, operator) {
	clearInterval(timerInterval);
	if (operator === 'Start') {
		// set the initial time-taken value since it will take a second for the timer to start
		run_timer(from_time);
		timerInterval = setInterval(() => run_timer(from_time), 1000); // Update every second
	}
}

// This is messy but it works, based on the assumption that all the pequea db times are in eastern time
function run_timer(from_time) {
	const elapsed_time = calculate_elapsed_time(from_time, new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })) + 1;
	const formatted_time = format_elapsed_time(elapsed_time);
	// Get the task card with a stop button
	const task_card = timeclock_form.fields_dict.task_cards.$wrapper.find('.card:contains(Stop)');
	// Set the time taken field on the card to the elapsed time
	task_card.find('.time-taken').text(formatted_time);
}

function calculate_elapsed_time(start_time, end_time) {
	const elapsed_time = Math.floor((new Date(end_time).getTime() - new Date(start_time).getTime()) / 1000);
	return elapsed_time;
}

function format_elapsed_time(elapsed_time) {
	// Convert elapsed_time to hours, minutes, and seconds
	const hours = Math.floor(elapsed_time / 3600);
	const minutes = Math.floor((elapsed_time % 3600) / 60);
	const seconds = elapsed_time % 60;
	// Format the elapsed time to look like this: 00:00:00
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

	function pad(value) {
		return String(value).padStart(2, '0');
	}
}

async function complete_task(task) {
	// confirm marking the task as complete
	frappe.confirm(
		`Mark ${task.operation} as complete?`,
		async function () {
			// close all the time logs on the task
			await call_for_time_logs(task, null, null);
			// set the task status to completed
			await frappe.db.set_value('Job Card', task.name, 'status', 'Completed');
			frappe.show_alert({ message: `${locals.selected_job.name} ${task.operation} marked as complete.`, indicator: 'green' });
			// refresh the task cards container
			get_and_render_tasks(locals.selected_job.name);
		},
	);
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
		manual_employee_selection();
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
	// insert the employee name into the page-title div
	// first check if an employee-name-container is already there. if so, remove it
	$('.employee-name-container').remove();
	$('.page-title').append(`<div class="flex fill-width title-area employee-name-container">
		<div class="flex">
			<h3 class="ellipsis title-text employee-name-title" title="${locals.employee.employee_name}">${locals.employee.employee_name}</h3> 
		</div>
	</div>`);
	check_for_active_task();
}

async function check_for_active_task() {
	// check if there is a job card time log for this employee that has no to_time
	const job_card_time_log = await frappe.db.get_list('Job Card Time Log', {
		filters: {
			employee: locals.employee.name,
			// from_time is not null and to_time is null,
			from_time: ['!=', null],
			to_time: null,
		},
		fields: ['from_time', 'parent'],
	});
	if (job_card_time_log.length > 0) {
		// there is an active task
		// find the job card for that task and highlight it and load the tasks
		// get the job card for that task
		await get_and_render_tasks();
		locals.selected_task = locals.tasks.find(task => task.name === job_card_time_log[0].parent);
		locals.selected_job = locals.jobs.find(job => job.name === locals.selected_task.work_order);
		// get the html card for that job
		// look for the element with class card-title and text that matches the job name
		// then get the nearest parent with class card
		let job_card = timeclock_form.fields_dict.job_cards.$wrapper.find('.card-title:contains(' + locals.selected_job.name + ')').closest('.card');
		highlight_card(job_card, 'selected_job_card');
		// get the card for that task
		let task_card = timeclock_form.fields_dict.task_cards.$wrapper.find('.card-title:contains(' + locals.selected_task.operation + ')').closest('.card');
		highlight_card(task_card, 'selected_task_card');
		// switch the start-stop-button on the task card to a stop button and remove the start-button class and add the stop-button class
		task_card.find('.start-stop-button').removeClass('start-button').addClass('stop-button').text('Stop');
		// display the timer
		display_timer(job_card_time_log[0].from_time, 'Start');
	}
	else {
		// there is no active task
		// show the job cards
		await get_and_render_jobs();
	}
}

async function select_workstation() {
	const d = new frappe.ui.Dialog({
		title: 'Select Workstation',
		fields: [
			{
				fieldtype: 'Select',
				fieldname: 'workstation',
				label: 'Workstation',
				// options are all the workstations
				options: ['', ...locals.workstation_list],
				default: locals.workstation || '',
				reqd: 1,
			}
		],
	});
	d.fields_dict.workstation.$input.on('change', async function () {
		locals.workstation = d.get_value('workstation');
		d.hide();
		if (locals.selected_job) {
			get_and_render_tasks(locals.selected_job.name);
		}
	});
	d.show();
}