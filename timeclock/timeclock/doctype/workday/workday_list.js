// add a button for a bulk entry dialog that allows for the entry of workday checkin/checkout times for multiple employees
// the dialog form uses a Date field to select the date, Table MultiSelect field to select employees, and a Table field to enter the checkin/checkout times
frappe.listview_settings['Workday'] = {
    get_indicator: function (doc) {
        if (doc.employee) {
            return [__("Employee"), "green", "employee,=," + doc.employee];
        }
    },
    onload: function (listview) {
        listview.page.add_inner_button(__("Bulk Add Workdays"), function () {
            frappe.model.with_doctype("Workday", function() {
                var d = new frappe.ui.Dialog({
                    title: __("Bulk Entry"),
                    fields: [
                        {fieldtype: "Date", fieldname: "date", label: __("Date"), reqd: 1},
                        {fieldtype: "Table MultiSelect", fieldname: "employees", label: __("Employees"), reqd: 1, options: "Workday Bulk Entry Employees"},
                        {fieldtype: "Table", fieldname: "workday_entries", label: __("Workday Entries"), reqd: 1, options: "Workday Bulk Entry Punches"}
                    ],
                    primary_action_label: __("Save"),
                    primary_action: function() {
                        var values = d.get_values();
                        if (!values) return;
                        var workday_entries = values.workday_entries;
                        var employee_list = [];
                        values.employees.forEach(function(employee) {
                            employee_list.push(employee.employee);
                        });
                        workday_entries.forEach(function(workday_entry) {
                            workday_entry.date = values.date;
                            workday_entry.employee = employee_list;
                        });
                        frappe.call({
                            method: "timeclock.timeclock.doctype.workday.workday.bulk_create_workday_entries",
                            args: {
                                workday_entries: workday_entries
                            },
                            callback: function(r) {
                                if (r.message) {
                                    frappe.msgprint(__("Workday Entries Created"));
                                    d.hide();
                                    listview.refresh();
                                }
                            }
                        });
                    }
                });
                d.show();
            });
        });
    }
};

