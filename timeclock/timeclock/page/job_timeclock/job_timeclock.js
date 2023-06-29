let timeclock_form

frappe.pages['job-timeclock'].on_page_load = async function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Job Timeclock',
		single_column: true
	});
	timeclock_form = new frappe.ui.FieldGroup({
		parent: page.body,
		// we need a container on the left for job cards and a container on the right for task cards for that job
		// these should be html elements
		fields: [
			// html field for job cards
			// this field height should never be more than the page height
			{fieldtype: 'HTML', fieldname: 'job_cards', label: 'Job Cards', reqd: 0, height: 300},
			// column break
			{fieldtype: 'Column Break', fieldname: 'column_break_1', reqd: 0},
			// html field for task cards
			{fieldtype: 'HTML', fieldname: 'task_cards', label: 'Task Cards', reqd: 0},
		],
	});
	timeclock_form.make();
	const jobs = await get_jobs();
	const job_cards = frappe.render_template('job_cards', {jobs: jobs});
	timeclock_form.set_value('job_cards', job_cards);

	// add event listener to job cards container
	// when a job card is clicked, get the tasks for that job and render them in the task cards container
	timeclock_form.fields_dict.job_cards.$wrapper.on('click', async function(event) {
		const job_name = $(event.target).attr('data-job-name');
		const tasks = await get_tasks(job_name);
		const task_cards = frappe.render_template('task_cards', {tasks: tasks});
		timeclock_form.set_value('task_cards', task_cards);
	});

}

// this gets all active jobs
async function get_jobs() {
	const jobs = await frappe.db.get_list('Work Order', {fields: ['*'], filters: {}});
	console.log(jobs);
	return jobs;
}

// this gets all tasks for a given job
async function get_tasks(job_name) {
	const tasks = await frappe.db.get_list('Task', {fields: ['*'], filters: {work_order: job_name}});
	console.log(tasks);
	return tasks;
}