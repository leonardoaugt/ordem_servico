frappe.ui.form.on('Sales Invoice', {

    after_save: function (frm) {
        //Set Sales Invoice on OS History section
        if (frm.doc.os_interna_link) {
            frappe.call({
                method: 'ordem_servico.ordem_servico.utils.set_sales_invoice_history',
                args: {
                    source_docname: frm.doc.name,
                    source_transaction_date: frm.doc.posting_date,
                    target_docname: frm.doc.os_interna_link,
                }
            });
        }
    }
});