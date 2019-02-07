frappe.ui.form.on('Delivery Note', {

    after_save: function (frm) {
        //Set Delivery Note on OS History section
        if (frm.doc.os_interna_link) {
            frappe.call({
                method: 'ordem_servico.ordem_servico.utils.set_delivery_note_history',
                args: {
                    source_docname: frm.doc.name,
                    source_transaction_date: frm.doc.posting_date,
                    target_docname: frm.doc.os_interna_link,
                }
            });
        }
    }

});