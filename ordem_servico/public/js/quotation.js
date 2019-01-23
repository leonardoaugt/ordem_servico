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
    }
});