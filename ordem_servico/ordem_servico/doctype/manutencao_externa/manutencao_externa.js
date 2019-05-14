// Copyright (c) 2019, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on("Manutencao Externa", {
    refresh: function(frm) {
        if (frm.doc.docstatus == 0) {
            frm.set_df_property("equip_problem", "reqd", 1);
            frm.set_df_property("work_done", "reqd", 1);
        }
    }
});
