let timeclock_form

frappe.pages['job-timeclock'].on_page_load = async function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Job Timeclock',
		single_column: true
	});
	page.add_button('Refresh Jobs', function(){refresh_jobs()});
	timeclock_form = new frappe.ui.FieldGroup({
		parent: page.body,
		// we need a container on the left for job cards and a container on the right for task cards for that job
		// these should be html elements
		fields: [
			// html field for job cards
			// this field height should never be more than the page height
			{fieldtype: 'HTML', fieldname: 'job_cards', label: 'Job Cards', reqd: 0},
			// column break
			{fieldtype: 'Column Break', fieldname: 'column_break_1', reqd: 0},
			// html field for task cards
			{fieldtype: 'HTML', fieldname: 'task_cards', label: 'Task Cards', reqd: 0},
		],
	});
	timeclock_form.make();
	await get_and_render_jobs();

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
			if (!locals.timer) {
				locals.timer = {
					start_time: null,
					stop_time: null,
				};
			}
			if (!locals.timer.stop_time) {
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
	const tasks = await frappe.db.get_list('Work Order Operation', {
		fields: ['*'],
		filters: {
			parent: job_name,
			status: ['not in', ['Completed']],
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
	task = await frappe.db.get_doc('Work Order Operation', task.name);
	if (operator === 'Start') {
		// get all the task card elements
		// for each card other than the one that was clicked, set the buttons to class inactive-btn
		task_cards.each(function() {
			if ($(this).find('.card-title').text() !== task.operation) {
				$(this).find('.btn-btn').removeClass('active-btn').addClass('inactive-btn');
			}
		});
		// set the button that was clicked to say Stop
		$(event.target).text('Stop')
		locals.timer.start_time = new Date();
		locals.timer.stop_time = null;
		const updated_task = await frappe.db.set_value('Work Order Operation', task.name, 'time_started', locals.timer.start_time);
		task = updated_task.message.operations.find(operation => operation.name === task.name)
		return task;
	} else {
		if (operator === 'Stop') {
			// set the button that was clicked to say Start
			$(event.target).text('Start')
		}
		// set the stop time for the timer
		locals.timer.stop_time = new Date();
		// calculate the elapsed time
		// const elapsed_time = frappe.datetime.get_diff(locals.timer.stop_time, locals.timer.start_time);
		const elapsed_time = (locals.timer.stop_time.getTime() - locals.timer.start_time.getTime()) / (1000 * 60);
		task.time_taken_in_minutes += elapsed_time;
		// set the elapsed time on the task
		const updated_work_order = await frappe.db.set_value('Work Order Operation', task.name, 'time_taken_in_minutes', task.time_taken_in_minutes);
		const updated_task = updated_work_order.message.operations.find(operation => operation.name === task.name);
		console.log(updated_task);
		// update the task in the locals.tasks array
		const task_index = locals.tasks.findIndex(task => task.name === updated_task);
		locals.tasks[task_index] = updated_task;
		// update the task card in the task cards container
		const task_card = task_cards.find(`.card:contains(${task.operation})`);
		task_card.find('.time-taken').text(task.time_taken_in_minutes);
		// set all the buttons to class active-btn
		task_cards.find('.btn-btn').removeClass('inactive-btn').addClass('active-btn');
		return updated_task;
	}
}

async function complete_task(task) {
	// confirm marking the task as complete
	frappe.confirm(
		`Mark ${task.operation} as complete?`,
		async function(){
			// set the task status to completed
			await frappe.db.set_value('Work Order Operation', task.name, 'status', 'Completed');
			frappe.show_alert({message: `${task.operation} marked as complete.`, indicator: 'green'});
			// refresh the task cards container
			get_and_render_tasks(locals.selected_job.name);
		},
	);
}