frappe.ui.form.on('Quotation', {

    after_save: function (frm) {
        // Make next Contact
        frappe.call({
            method: 'ordem_servico.ordem_servico.utils.next_contact',
            args: {
                docname: frm.doc.name,
            },
            callback: function (r) {
                frm.reload_doc()
            }
        });

        //Set quotation to OS History section
        if(frm.doc.os_interna_link) {
            frappe.call({
                method: 'ordem_servico.ordem_servico.utils.set_os_interna_history',
                args: {
                    source_docname: frm.doc.name,
                    source_transaction_date: frm.doc.transaction_date,
                    target_docname: frm.doc.os_interna_link,
                }
            });
        }
    }
});