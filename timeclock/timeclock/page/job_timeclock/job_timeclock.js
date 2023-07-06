let timeclock_form;
let timerInterval;
let page;

frappe.pages['job-timeclock'].on_page_load = async function(wrapper) {
	page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Job Timeclock',
		single_column: true
	});
	page.add_button('Select Employee', function(){select_employee()});
	page.add_button('Refresh Jobs', function(){refresh_jobs()});
	// page.add_menu_item('Manual Employee Selection', function(){manual_employee_selection()});
	timeclock_form = new frappe.ui.FieldGroup({
		parent: page.body,
		// we need a container on the left for job cards and a container on the right for task cards for that job
		// these should be html elements
		fields: [
			// html field for job cards
			{fieldtype: 'HTML', fieldname: 'job_cards', label: 'Job Cards', reqd: 0},
			// column break
			{fieldtype: 'Column Break', fieldname: 'column_break_1', reqd: 0},
			// html field for task cards
			{fieldtype: 'HTML', fieldname: 'task_cards', label: 'Task Cards', reqd: 0},
		],
	});
	timeclock_form.make();
	await get_and_render_jobs();
	locals.timer = false;
	select_employee();

	// add event listener to job cards container
	// when a job card is clicked, get the tasks for that job and render them in the task cards container
	timeclock_form.fields_dict.job_cards.$wrapper.on('click', async function(event) {
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
	timeclock_form.fields_dict.task_cards.$wrapper.on('click', async function(event) {
		if ($(event.target).hasClass('active-btn')) {
			const task_operation = $(event.target).closest('.card').find('.card-title').text();
			let task = locals.tasks.find(task => task.operation === task_operation);
			const operator = event.target.innerText
			if (operator === 'Start' || operator === 'Stop' || operator === 'Finish' && locals.timer) {
				task = await task_timer(event, task, operator);
			}
			if (operator === 'Finish') {
				await complete_task(task);
				return;
			}
			locals.selected_task = task;
			const selected_task_card = $(event.target).closest('.card');
			highlight_card(selected_task_card, 'selected_task_card');
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
	const job_cards = frappe.render_template('job_cards', {jobs: jobs});
	timeclock_form.set_value('job_cards', job_cards);
	return jobs;
}

// this gets all tasks for a given job
async function get_and_render_tasks(job_name) {
	// await timeclock_form.set_value('task_cards', '');
	const tasks = await frappe.db.get_list('Job Card', {
		fields: ['*'],
		filters: {
			work_order: job_name,
			status: ['not in', ['Completed', 'Cancelled']],
		},
		order_by: 'operation'
	});
	locals.tasks = tasks;
	const task_cards = frappe.render_template('task_cards', {tasks: tasks});
	timeclock_form.set_value('task_cards', task_cards);
	if (!tasks.length) {
		// SHOULD THE JOB BE MARKED COMPLETE IF THERE ARE NO TASKS THAT AREN'T COMPLETE?
		// await frappe.db.set_value('Work Order', job_name, 'status', 'Completed');
		frappe.show_alert({message: `No tasks found for ${job_name}.`, indicator: 'blue'});
		refresh_jobs();
	}

	// TODO: sort through this and see what I want to keep now that I'm using job card time logs

	// if any tasks already have a start time, highlight that task card
	// const started_task = tasks.find(task => task.start_time);
	// if (started_task) {
	// 	const started_task_card = timeclock_form.fields_dict.task_cards.$wrapper.find(`.card:contains(${started_task.operation})`);
	// 	highlight_card(started_task_card, 'selected_task_card');
	// 	locals.selected_task = started_task;
	// 	// give the other tasks btn-inactive class
	// 	const task_cards = timeclock_form.fields_dict.task_cards.$wrapper.find('.card');
	// 	task_cards.each(function() {
	// 		if ($(this).find('.card-title').text() !== started_task.operation) {
	// 			$(this).find('.btn-btn').addClass('btn-inactive');
	// 		}
	// 	});
	// 	// switch the start button to a stop button
	// 	const start_btn = started_task_card.find('start-stop-button');
	// 	start_btn.text('Stop');
	// }
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

async function task_timer(event, task, operator) {
	const task_cards = timeclock_form.fields_dict.task_cards.$wrapper.find('.card');
	if (!locals.employee) {
		frappe.throw('Please select an employee.');
	}
	// task = await frappe.db.get_doc('Job Card', task.name);
	if (operator === 'Start') {
		// get all the task card elements
		// for each card other than the one that was clicked, set the buttons to class inactive-btn
		task_cards.each(function() {
			if ($(this).find('.card-title').text() !== task.operation) {
				$(this).find('.btn-btn').removeClass('active-btn').addClass('inactive-btn');
			}
		});
		// set the button that was clicked to say Stop
		$(event.target).text('Stop').removeClass('start-button').addClass('stop-button');

		await call_for_time_logs(task, operator);
		
		locals.timer = true;
		// Start the timer display ?
		// display_timer(job_card_time_log, operator);
	} else {
		if (operator === 'Stop') {
			// set the button that was clicked to say Start and remove the stop-button class and add the start-button class
			$(event.target).text('Start').removeClass('stop-button').addClass('start-button');
		}
		// Stop the timer display
		// display_timer(null, operator)
		await call_for_time_logs(task, operator);
		// set all the buttons to class active-btn
		task_cards.find('.btn-btn').removeClass('inactive-btn').addClass('active-btn');
		locals.timer = false;
	}
	task = await frappe.db.get_doc('Job Card', task.name);
	// update the task in the locals.tasks array
	const task_index = locals.tasks.findIndex(t => t.name === task.name);
	locals.tasks[task_index] = task;
	return task;
}

async function call_for_time_logs(task, operator) {
	await frappe.call({
		method: 'timeclock.timeclock.page.job_timeclock.job_timeclock.manage_job_card_time_logs',
		args: {
			job_card: task.name,
			operator: operator,
			employee: locals.employee.name,
		},
		freeze: true,
	});
	return
}

function display_timer(job_card_time_log, operator) {
	if (operator === 'Start') {
		timerInterval = setInterval(() => run_timer(job_card_time_log), 1000); // Update every second
	} else {
		clearInterval(timerInterval);
	}
}

function run_timer(job_card_time_log) {
	const task_cards = timeclock_form.fields_dict.task_cards.$wrapper.find('.card');
	const task_card = task_cards.find(`.card:contains(${job_card_time_log.operation})`);
	const time_taken = task_card.find('.time-taken');
	const elapsed_time = Math.round((new Date().getTime() - job_card_time_log.from_time.getTime()) / 1000);
	time_taken.text(elapsed_time);
}

async function complete_task(task) {
	// confirm marking the task as complete
	frappe.confirm(
		`Mark ${task.operation} as complete?`,
		async function(){
			// set the task status to completed
			await frappe.db.set_value('Job Card', task.name, 'status', 'Completed');
			frappe.show_alert({message: `${task.operation} marked as complete.`, indicator: 'green'});
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
			const employee_id = new TextDecoder().decode(records[0].data);
			// locals.employee = await frappe.db.get_doc('Employee', employee_id);
			// // set the employee field to the employee
			// timeclock_form.set_value('employee_name', locals.employee.employee_name);
			set_employee(employee_id);
		}
	} catch (error) {
		frappe.show_alert({message: error, indicator: 'orange'});
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
		// locals.employee = await frappe.db.get_doc('Employee', d.get_value('employee'));
		// timeclock_form.set_value('employee_name', locals.employee.employee_name);
		set_employee(d.get_value('employee'));
		d.hide();
	});
	d.show();
}

async function set_employee(employee) {
	locals.employee = await frappe.db.get_doc('Employee', employee);
	// page.set_title_sub(locals.employee.employee_name);
	// insert the employee name into the page-title div
	// first check if an employee-name-container is already there. if so, remove it
	$('.employee-name-container').remove();
	$('.page-title').append(`<div class="flex fill-width title-area employee-name-container">
		<div>
			<div class="flex">
				<h3 class="ellipsis title-text" title="${locals.employee.employee_name}">${locals.employee.employee_name}</h3> <span
					class="indicator-pill whitespace-nowrap"></span>
			</div>
			<div class="ellipsis sub-heading hide text-muted"></div>
		</div> <button class="btn btn-default more-button hide"> <svg class="icon icon-sm">
				<use href="#icon-dot-horizontal"> </use>
			</svg> </button>
	</div>`);
}