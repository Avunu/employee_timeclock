// Copyright (c) 2022, Avunu LLC and contributors
// For license information, please see license.txt

// function to load a new tempusDominus.TempusDominus
//
// @param {string} fieldname - the fieldname of the field to load the tempusDominus.TempusDominus on
function load_tempus_dominus(field) {
	var tempus_dominus = new tempusDominus.TempusDominus(field, {
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
		},
		localization: {
			dateFormats: {
				'LT': 'h:mm T',
			},
			format: 'h:mm T'
		}
	});
}

frappe.require([
	"assets/css/tempus-dominus.min.css",
]);

frappe.ui.form.on('Workday', {
	refresh: function (frm) {
		// load the tempusDominus customDateFormat plugin
		tempusDominus.extend(window.tempusDominus.plugins.customDateFormat);
		// load a timepicker for all the time fields from check_in_1 to check_out_6
		for (var i = 1; i <= 6; i++) {
			var field = frm.fields_dict['check_in_' + i].input;
			load_tempus_dominus(field);
			var field = frm.fields_dict['check_out_' + i].input;
			load_tempus_dominus(field);
		}

	},
	date: function (frm) {
		// set the day of the week based on the date
		frm.set_value('day_of_week', moment(frm.doc.date).format('dddd'));
	},

});
