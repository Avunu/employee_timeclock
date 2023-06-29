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
frappe.listview_settings['Workday'] = {
    refresh: function (listview) {
        listview.page.add_inner_button(__("Bulk Add"), function () {
            frappe.model.with_doctype("Workday", function () {
                // get a list of all active employees for the employees MultiSelect field
                frappe.db.get_list("Employee",
                    { filters: { status: "Active" }, fields: ["name", "employee_name"], limit: 1000 }
                ).then(r => {
                    var employees = r.map(e => { return { value: e.name, label: e.employee_name } });
                    // create the dialog form
                    var dialog = new frappe.ui.Dialog({
                        title: __("Bulk Add Workday"),
                        fields: [
                            {
                                fieldname: 'date',
                                label: __('Date'),
                                fieldtype: 'Date',
                                reqd: 1,
                            },
                            {
                                fieldname: 'employees',
                                label: __('Employees'),
                                fieldtype: 'MultiSelect',
                                options: 'Workday Employee',
                                get_data: () => employees,
                                reqd: 1,
                            },
                            {
                                fieldname: 'punches',
                                label: __('Punches'),
                                fieldtype: 'Table',
                                options: 'Workday Punches',
                                fields: [
                                    {
                                        fieldtype: "Data",
                                        fieldname: "checkin",
                                        label: __("Check In"),
                                        in_list_view: 1,
                                        reqd: 1
                                    },
                                    {
                                        fieldtype: "Data",
                                        fieldname: "checkout",
                                        label: __("Check Out"),
                                        in_list_view: 1,
                                        reqd: 1
                                    },
                                ],
                                onload: function (field) {
                                    // convert the input fields to a new native <input type="time">
                                    field.grid.wrapper.find('input[data-fieldname="checkin"]').each(function (i, e) { e.type = 'time'; }
                                    );
                                    field.grid.wrapper.find('input[data-fieldname="checkout"]').each(function (i, e) { e.type = 'time'; }
                                    );
                                },
                            },
                        ],
                    });
                    // add a button to the dialog form to save the entries
                    dialog.set_primary_action(__("Save"), function () {
                        // create a list of workday entries
                        var date = dialog.get_value('date');
                        var employees = dialog.get_value('employees');
                        var punches = dialog.get_value("punches").map(w => {
                            return {
                                checkin: w.checkin,
                                checkout: w.checkout,
                            };
                        });
                        // save the workday entries
                        frappe.call({
                            method: "timeclock.timeclock.doctype.workday.workday.bulk_add_punches",
                            args: {
                                date: date,
                                employees: employees,
                                punches: punches
                            },
                            callback: function (r) {
                                if (r.message) {
                                    frappe.msgprint(r.message);
                                }
                                dialog.hide();
                                //frappe.set_route("List", "Workday");
                            }
                        });
                    });
                    // show the dialog form
                    dialog.show();
                }
                );
            });
        });
    },
};



frappe.ui.form.on('Workday', {
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
        frm.set_value('day_of_week', moment(frm.doc.date).format('dddd'));
    },

});

function add_custom_field(dialog, custom_field_options) {
    const custom_field = frappe.ui.form.make_control(custom_field_options);
    custom_field.parent = dialog.fields_dict[custom_field_options.fieldname].$wrapper;
    custom_field.refresh();
    custom_field.$input.addClass('input-time');
    dialog.fields_dict[custom_field_options.fieldname].$input.parent().replaceWith(custom_field.$input.parent());
    dialog.fields_dict[custom_field_options.fieldname] = custom_field;
}
