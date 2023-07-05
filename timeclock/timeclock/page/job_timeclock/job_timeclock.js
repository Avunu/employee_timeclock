let timeclock_form;
let timerInterval;

frappe.pages['job-timeclock'].on_page_load = async function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Job Timeclock',
		single_column: true
	});
	page.add_button('Refresh Jobs', function(){refresh_jobs()});
	// page.add_button('Select User', function(){select_user()}); // this could be a menu item, and be a dropdown of users. it could be used to set a default employee for the session, if there is a tablet that get's used by mostly one task/employee? Maybe on the employee selection prompt for the tag there could be an option to use a dropdown instead, in case someone doesn't have their tag...
	timeclock_form = new frappe.ui.FieldGroup({
		parent: page.body,
		// TODO: large text field above jobs that displays the current employee, a large button over tasks to change employee
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
			// instead of using locals.timer, maybe we should just check if there is an open job card time log for this task
			if (!locals.timer) {
				await task_timer(event, task, operator);
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
		$(event.target).text('Stop')

		// TODO: get the employee
		// TODO: check and see if there is an unclosed entry for this employee, if so, close it
		// const job_card_time_log = await frappe.db.insert({
		// 	doctype: 'Job Card Time Log',
		// 	parent: task.name,
		// 	parent_field: 'time_logs',
		// 	// time_started: new Date(),
		// 	from_time: frappe.datetime.now_datetime(),
		// 	operation: task.operation,
		// 	employee: null // locals.employee.name or however we set the employee. is there just a popup anytime someone clicks start/stop/finish that asks for the employee, at which point they scan their tag?
		// });

			// add_child: function (parent_doc, doctype, parentfield, idx) {
		// const job_card_time_log = frappe.model.add_child(task, 'Job Card Time Log', 'time_logs');
		// // TODO: Add employee to job card time log
		// job_card_time_log.from_time = frappe.datetime.now_datetime();
		// await task.save();

		// await frappe.db.insert({
		// 	doctype: 'Job Card Time Log',
		// 	Parent: task.name,
		// 	Parenttype: 'Job Card',
		// 	Parentfield: 'time_logs',
		// 	from_time: frappe.datetime.now_datetime(),
		// 	employee: null,
		// })

		const employee = null;

		frappe.call({
			// apps/timeclock/timeclock/timeclock/page/job_timeclock/job_timeclock.py
			method: 'timeclock.timeclock.page.job_timeclock.job_timeclock.manage_job_card_time_logs',
			args: {
				job_card: task.name,
				operation: task.operation,
				employee: employee,
			},
			callback: function(r) {
				task = r.message;
				// update the task in the locals.tasks array
				const task_index = locals.tasks.findIndex(t => t.name === task.name);
				locals.tasks[task_index] = task;
			}
		});

		locals.timer = true;
		// Start the timer display
		display_timer(job_card_time_log, operator);
		return;
	} else {
		if (operator === 'Stop') {
			// set the button that was clicked to say Start
			$(event.target).text('Start')
		}
		// Stop the timer display
		display_timer(null, operator)
		// add the to_time to the job card time log
		// const job_card_time_log = await frappe.db.get_doc('Job Card Time Log', {parent: task.name, parent_field: 'time_logs', to_time: null})
		// just make sure the job card in locals is up to date and use that
		const job_card_time_log = await frappe.call({
			method: 'frappe.client.get',
			args: {
				doctype: 'Job Card Time Log',
				parent: task.name,
				filters: {
					to_time: null
				}
			}
		})
		await frappe.db.set_value('Job Card Time Log', job_card_time_log.name, 'to_time', frappe.datetime.now_datetime());
		// set all the buttons to class active-btn
		task_cards.find('.btn-btn').removeClass('inactive-btn').addClass('active-btn');
		locals.timer = false;
		return
	}
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