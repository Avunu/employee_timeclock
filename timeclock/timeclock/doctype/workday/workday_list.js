// Copyright (c) 2022, Avunu LLC and contributors
// For license information, please see license.txt

// frappe.ui.form.ControlTimeInput = class ControlTimeInput extends frappe.ui.form.Control {
//     make_input() {
//         this.$input = $('<input>')
//             .attr('type', 'time')
//             .addClass('input-with-feedback form-control')
//             .attr("autocomplete", "off")
//             .on("focus", () => this.set_focus())
//             .on("change", () => this.parse_validate_and_set_in_model())
//             .appendTo(this.input_area);
//     }
// };

// frappe.ui.form.Control.prototype.get_control = function (df) {
//     let control_class = null;
//     let options = null;

//     switch (df.fieldtype) {
//         // ... other case statements ...
//         case "TimeInput":
//             control_class = frappe.ui.form.ControlTimeInput;
//             break;
//         // ... other case statements ...
//     }

//     if (control_class) {
//         return new control_class({ df: df, doctype: this.doctype, parent: this });
//     }
// };

// add a button for a bulk entry dialog that allows for the entry of workday checkin/checkout times for multiple employees
// the dialog form uses a Date field to select the date, Table MultiSelect field to select employees, and a Table field to enter the checkin/checkout times
frappe.listview_settings["Workday"] = {
  refresh: function (listview) {
    listview.page.add_inner_button(__("Bulk Add"), function () {
      frappe.ui.form.show_workday_bulk_add(() => {
        // Refresh the list view after bulk add
        listview.refresh();
      });
    });
  },
};

frappe.ui.form.on("Workday", {
  refresh: function (frm) {
    // // convert inputs to a new native <input type="time"> (using native javascript)
    // // load a timepicker for all the time fields from check_in_1 to check_out_6
    // for (var i = 1; i <= 12; i++) {
    //     var field = cur_frm.fields_dict['check_in_' + i].input;
    //     // convert the input to a new native <input type="time">
    //     field.type = 'time';
    //     var field = frm.fields_dict['check_out_' + i].input;
    //     field.type = 'time';
    // }
  },
  date: function (frm) {
    // set the day of the week based on the date
    frm.set_value("day_of_week", moment(frm.doc.date).format("dddd"));
  },
});

function add_custom_field(dialog, custom_field_options) {
  const custom_field = frappe.ui.form.make_control(custom_field_options);
  custom_field.parent = dialog.fields_dict[custom_field_options.fieldname].$wrapper;
  custom_field.refresh();
  custom_field.$input.addClass("input-time");
  dialog.fields_dict[custom_field_options.fieldname].$input
    .parent()
    .replaceWith(custom_field.$input.parent());
  dialog.fields_dict[custom_field_options.fieldname] = custom_field;
}
