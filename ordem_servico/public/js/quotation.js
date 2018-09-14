frappe.ui.form.on('Quotation', {

    after_save: function(frm) {

        // Next Contact
        frappe.call({
            method: 'ordem_servico.ordem_servico.ordem_servico.next_contact',
            args: {
                doc_name: frm.doc.name,
            }
        });
    }

});