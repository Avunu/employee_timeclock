// function load_tempus_dominus(field) {
//     var tempus_dominus = new tempusDominus.TempusDominus(field, {
//         display: {
//             viewMode: 'clock',
//             theme: 'light',
//             icons: {
//                 type: 'icons',
//                 up: 'octicon octicon-chevron-up',
//                 down: 'octicon octicon-chevron-down'
//             },
//             components: {
//                 decades: false,
//                 year: false,
//                 month: false,
//                 date: false,
//                 hours: true,
//                 minutes: true,
//                 seconds: false
//             }
//         },
//         localization: {
//             dateFormats: {
//                 'LT': 'h:mm T',
//             },
//             format: 'h:mm T'
//         }
//     });
// }

// frappe.require([
//     "assets/css/tempus-dominus.min.css",
// ]);

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
                                        reqd: 1,
                                        // on_click: function (field) {
                                        //     load_tempus_dominus(field);
                                        // },
                                    },
                                    {
                                        fieldtype: "Data",
                                        fieldname: "checkout",
                                        label: __("Check Out"),
                                        in_list_view: 1,
                                        reqd: 1,
                                        // on_render: function (field) {
                                        //     load_tempus_dominus(field);
                                        // }
                                    },
                                ],
                                // // add the tempus dominus datepicker to the checkin and checkout fields
                                // on_render: function (field) {
                                //     console.log(field);
                                //     load_tempus_dominus(field.get_field('checkin').$input);
                                //     load_tempus_dominus(field.get_field('checkout').$input);
                                // }
                            },
                        ],
                    });
                    // // set onrender for the punches table
                    // dialog.fields_dict.punches.df.on_render = function (field) {
                    //     load_tempus_dominus(field.get_field('checkin').$input);
                    //     load_tempus_dominus(field.get_field('checkout').$input);
                    // };
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
        // // if the report is "Workday Management", change the filters to Date <= Today and Date >= Today - 7
        // if (listview.page_title == "Workday Management") {
        //     listview.get_args = () => {
        //         let args = frappe.views.ListView.prototype.get_args.call(listview);  // Calling his super for the args
        //         console.log(args);
        //         args.filters = [
        //             ['Workday', 'date', '>=', frappe.datetime.add_days(frappe.datetime.get_today(), -7)],
        //             ['Workday', 'date', '<=', frappe.datetime.get_today()]
        //         ];
        //         return args;
        //     };
        //     listview.reload();
        // }
    },
    // onload: function (listview) {
    //     // if the report is "Workday Management", change the filters to Date <= Today and Date >= Today - 7
    //     if (listview.page_title == "Workday Management") {
    //         listview.get_args = () => {
    //             let args = frappe.views.ListView.prototype.get_args.call(listview);  // Calling his super for the args
    //             args.filters = [
    //                 ['Workday', 'date', '>=', frappe.datetime.add_days(frappe.datetime.get_today(), -7)],
    //                 ['Workday', 'date', '<=', frappe.datetime.get_today()]
    //             ];
    //             return args;
    //         };
    //     }
    // },
};


// // script for the quick entry dialog
// frappe.ui.form.on('Workday', {
//     refresh: function (frm) {
//         // load the tempusDominus customDateFormat plugin
//         tempusDominus.extend(window.tempusDominus.plugins.customDateFormat);
//         // load a timepicker for all the time fields from check_in_1 to check_out_6
//         for (var i = 1; i <= 4; i++) {
//             var field = frm.fields_dict['check_in_' + i].input;
//             load_tempus_dominus(field);
//             var field = frm.fields_dict['check_out_' + i].input;
//             load_tempus_dominus(field);
//         }

//     },
//     date: function (frm) {
//         // set the day of the week based on the date
//         frm.set_value('day_of_week', moment(frm.doc.date).format('dddd'));
//     },

// });
