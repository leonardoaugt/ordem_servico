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
        if (frm.events.is_externa(frm)) {
            cur_frm.add_custom_button(__('OS Externa'),
                () => frm.events.make_os_externa(frm),
                __("Make"));
        }
    },

    is_externa: function (frm) {
        if (frm.doc.local_manutencao == 'Externa' &&
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