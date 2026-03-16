// Copyright (c) 2022, Avunu LLC and contributors
// For license information, please see license.txt

frappe.ui.form.on("Workday", {
  refresh: function (frm) {
    // // convert inputs to a new native <input type="time"> (using native javascript)
    // // load a timepicker for all the time fields from check_in_1 to check_out_6
    // for (var i = 1; i <= 12; i++) {
    // 	var field = cur_frm.fields_dict['check_in_' + i].input;
    // 	// convert the input to a new native <input type="time">
    // 	field.type = 'time';
    // 	var field = frm.fields_dict['check_out_' + i].input;
    // 	field.type = 'time';
    // }
  },
  date: function (frm) {
    // set the day of the week based on the date
    frm.set_value("day_of_week", moment(frm.doc.date).format("dddd"));
  },
});
