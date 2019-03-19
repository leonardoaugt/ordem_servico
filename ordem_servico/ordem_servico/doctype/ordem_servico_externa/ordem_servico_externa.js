// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ordem Servico Externa', {
    onload_post_render: function (frm) {
        if (frm.doc.__islocal) {
            // Get document previous route
            prev_route = frappe.get_prev_route();
            prev_doctype = prev_route[1];
            prev_docname = prev_route[2];
            prev_doc = frappe.get_doc(prev_doctype, prev_docname);

            // Check if is a Sales Order
            if (prev_doc.doctype == 'Sales Order') {
                frm.set_value('sales_order_link', prev_doc.name);
                frm.set_value('sales_order_date',prev_doc.transaction_date);
            }
        }
    },

    setup: function (frm) {
        frm.doc.custom_make_buttons = {
            'Manutencao Externa': 'Make Manutencao Externa'
        }
    },

    refresh: function (frm) {
        if (frm.doc.local_manutencao == 'Externa'
            && !frm.doc.os_externa_link) {
            frm.add_custom_button(__('Manutenção Externa'),
                frm.cscript['Make Manutencao Externa'], __("Make"));
        }
    },

    after_save: function (frm) {
        if (frm.doc.__islocal) {
            frappe.call({
                method: 'ordem_servico.ordem_servico.doctype.ordem_servico_externa.ordem_servico_externa.set_sales_order_link',
                args: {
                    source_docname: frm.doc.name,
                    target_docname: frm.doc.sales_order_link
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
        }
    })
}