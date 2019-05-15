frappe.ui.form.on('Sales Order', {

    setup: function (frm) {
        frm.custom_make_buttons = {
            'Ordem Serviço Externa': 'OS Externa',
        }
    },

    refresh: function (frm) {
        frm.events.add_custom_button(frm);
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

    make_os_externa: function (frm) {
        frappe.call({
            method: 'ordem_servico.ordem_servico.doctype.ordem_servico_externa.ordem_servico_externa.make_os',
            args: {
                docname: frm.doc.name,
            },
            callback: function (r) {
                let object = r.message;
                let doctype = object.doctype;
                let docname = object.name;
                frappe.model.sync(object);
                frappe.set_route('Form', doctype, docname);
            }
        })
    },

    add_custom_button: function (frm) {
        if (frm.events.show_os_button(frm)) {
            cur_frm.add_custom_button(__('OS Externa'),
                () => frm.events.make_os_externa(frm),
                __("Make"));
        }
        if (frm.events.overdued()) {
            frm.add_custom_button(__('Emenda'),
                () => frm.events.update_delivery_date(frm));
        }
    },

    show_os_button: function (frm) {
        if (frm.doc.local_manutencao == 'Externa' &&
            frm.doc.docstatus == 1 &&
            (!frm.doc.os_externa_link ||
                frm.doc.os_externa_link == undefined)
        ) {
            valid = true;
        } else {
            valid = false;
        }
        return valid;
    },

    update_delivery_date: function (frm) {
        frappe.prompt([
                {'fieldname': 'new_delivery_date', 'fieldtype': 'Date', 'label': 'Data de entrega', 'reqd': 1},
                {'fieldname': 'new_delivery_reason', 'fieldtype': 'Text', 'label': 'Observação', 'reqd': 1},
            ],
            (data) => {
                frappe.call({
                    method: 'ordem_servico.ordem_servico.utils.update_delivery_date',
                    args: {
                        docname: frm.doc.name,
                        date: data.new_delivery_date,
                        reason: data.new_delivery_reason,
                    },
                    callback: (r) => {
                        frappe.show_alert({
                            message: 'Emenda concluída!',
                            indicator: 'green',
                        });
                        frm.reload_doc();
                    }
                });
            },
            'Digite a nova data de entrega',
            'Salvar'
        )
    },

    overdued: function (frm) {
        let over = null;

        if (cur_frm.doc.delivery_date < frappe.datetime.get_today() &&
            cur_frm.doc.delivery_status == 'Not Delivered' &&
            cur_frm.doc.status != 'Closed' &&
            cur_frm.doc.status != 'Cancelled' &&
            cur_frm.doc.status != 'Completed')
        {
            over = true;
        } else {
            over = false;
        }

        return over;
    }
});