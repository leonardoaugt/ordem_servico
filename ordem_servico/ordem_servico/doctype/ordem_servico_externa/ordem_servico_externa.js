// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ordem Servico Externa', {
    setup: function (frm) {
        frm.doc.custom_make_buttons = {
            'Manutencao Externa': 'Make Manutencao Externa'
        }
    },

    onload_post_render: function (frm) {
        if (frm.doc.__islocal) {
            // Get document previous route
            prev_route = frappe.get_prev_route();
            prev_doctype = prev_route[1];
            prev_docname = prev_route[2];
            prev_doc = frappe.get_doc(prev_doctype, prev_docname);

            // Check if is a Sales Order
            if (prev_doc.doctype == 'Sales Order') {
                frm.set_value('sales_order_name', prev_doc.name);
                frm.set_value('sales_order_date', prev_doc.transaction_date);
            }
        }
    },

    refresh: function (frm) {
        if (frm.doc.workflow_state == 'Enviado') {
            frm.add_custom_button(__('Manutencao Externa'),
                frm.cscript['Make Manutencao Externa'], __("Make"));
        }
    },

    after_save: function (frm) {
        if (frm.doc.__islocal) {
            frappe.call({
                method: 'ordem_servico.ordem_servico.doctype.ordem_servico_externa.ordem_servico_externa.set_sales_order_link',
                args: {
                    source_docname: frm.doc.name,
                    target_docname: frm.doc.sales_order_name
                }
            })
        }
    }
})

cur_frm.cscript['Make Manutencao Externa'] = function () {
    frappe.call({
        method: "ordem_servico.ordem_servico.doctype.manutencao_externa.manutencao_externa.make_manutencao_externa",
        args: {
            source_docname: cur_frm.doc.name,
        },
        callback: function (r) {
            frappe.model.sync(r.message);
            frappe.set_route('Form', r.message.doctype, r.message.name);
        }
    })
}
