frappe.ui.form.on('Sales Order', {

    setup: function (frm) {
        frm.doc.custom_make_buttons = {
            'Ordem Serviço Externa': 'Make OS Externa'
        }
    },

    refresh: function (frm) {
        if (frm.doc.docstatus == 1
            && frm.doc.local_manutencao == 'Interna') {
            frm.add_custom_button(__('Ordem Serviço Externa'),
                frm.cscript['Make OS Externa'], __("Make"));
        }
    },

    after_save: function (frm) {
        //Set Sales Order on OS History section
        if (frm.doc.os_interna_link) {
            frappe.call({
                method: 'ordem_servico.ordem_servico.utils.set_sales_order_history',
                args: {
                    source_docname: frm.doc.name,
                    source_transaction_date: frm.doc.transaction_date,
                    target_docname: frm.doc.os_interna_link,
                }
            });
        }
    }
});

cur_frm.cscript['Make OS Externa'] = function () {

    frappe.call({
        method: "ordem_servico.ordem_servico.doctype.ordem_servico_externa.ordem_servico_externa.make_os_externa",
        args: {
            source_docname: cur_frm.doc.name,
        },
        callback: function (r) {
            frappe.model.sync(r.message);
            frappe.set_route('Form', r.message.doctype, r.message.name);
        }
    })
}
