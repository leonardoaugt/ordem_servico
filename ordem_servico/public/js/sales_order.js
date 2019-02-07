frappe.ui.form.on('Sales Order', {

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