// Copyright (c) 2019, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on("Manutencao Externa", {
    refresh: function(frm) {
        if (frm.doc.docstatus == 0) {
            frm.set_df_property("equip_problem", "reqd", 1);
            frm.set_df_property("work_done", "reqd", 1);
        }
    },

    /* Bug fix when trying to submit a Manutencao Externa
     status was changing even validate fails */
    validate(frm) {
        if (
            frm.doc.equip_problem == undefined
            || frm.doc.work_done == undefined
        ) {
            frm.doc.workflow_state = 'Pendente';
        }
    }
});
