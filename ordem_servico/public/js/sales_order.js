status = {
    EXTERNA: 'Externo',
};
externa = status.EXTERNA;

frappe.ui.form.on('Sales Order', {

    setup: function (frm) {
        frm.custom_make_buttons = {
            'Ordem Serviço Externa': 'OS Externa',
        }
    },

    onload: function (frm) {
        if (frm.events.is_externa(frm)) {
            cur_frm.add_custom_button(__('OS Externa'),
                () => make_os(frm),
                __("Make"));
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
    },

    make_os: function (frm) {
        frappe.call({
            method: 'ordem_servico.ordem_servico.doctype.ordem_servico_externa.ordem_servico_externa.make_os_externa',
            args: {
                docname: frm.doc.name,
            },
        })
    },

    is_externa: function (frm) {
        if (frm.doc.local_manutencao == externa &&
            frm.doc.docstatus == 1 &&
            (!frm.doc.os_interna_link ||
                frm.doc.os_interna_link == undefined)
        ) {
            valid = true;
        } else {
            valid = false;
        }

        return valid;
    }
});