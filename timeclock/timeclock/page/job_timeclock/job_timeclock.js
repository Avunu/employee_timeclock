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
		highlight_job($(event.target).closest('.card'));
		const tasks = await get_tasks(job_name);
		const task_cards = frappe.render_template('task_cards', {tasks: tasks});
		timeclock_form.set_value('task_cards', task_cards);
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
async function get_tasks(job_name) {
	const job = await frappe.db.get_doc('Work Order', job_name);
	const tasks = job.operations;
	
	return tasks;
}

async function refresh_jobs() {
	const jobs = await get_and_render_jobs();

	// find the html element for the selected job card and add a dark blue border around it
	if (jobs.some(job => job.name === locals.selected_job.name)) {
		highlight_job(timeclock_form.fields_dict.job_cards.$wrapper.find(`.card:contains(${locals.selected_job.name})`));
	} else {
		// clear the task cards container
		timeclock_form.set_value('task_cards', '');
	}
}

function highlight_job(selected_job_card) {
	// take the dark blue border off of locals.selected_job_card and replace it with the original border (border: 2px solid var(--border-color);)
	if (locals.selected_job_card) {
		locals.selected_job_card.css('border', '2px solid var(--border-color)');
	}
	locals.selected_job_card = selected_job_card;
	// put a dark blue border around the selected job card
	locals.selected_job_card.css('border', '2px solid #0B3D91');
}