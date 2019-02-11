frappe.ui.form.on('Payment Entry', {

    onload_post_render: function (frm) {
        if (frm.doc.__islocal) {
            // Get document previous route
            prev_route = frappe.get_prev_route();
            prev_doctype = prev_route[1];
            prev_docname = prev_route[2];
            prev_doc = frappe.get_doc(prev_doctype, prev_docname);
            console.log(prev_doc);

            // Check if is a Sales Order and has os_interna_link
            if (prev_doc.doctype == 'Sales Order' || prev_doc.doctype == 'Quotation' && prev_doc.os_interna_link) {
                frm.doc.os_interna_link = prev_doc.os_interna_link;
                frm.doc.local_manutencao = prev_doc.local_manutencao;
                refresh_field('os_interna_link');
                refresh_field('local_manutencao');
            }
        }
    },

    after_save: function (frm) {
        //Set Payment Entry on OS History section
        if (frm.doc.os_interna_link) {
            frappe.call({
                method: 'ordem_servico.ordem_servico.utils.set_payment_entry_history',
                args: {
                    source_docname: frm.doc.name,
                    source_transaction_date: frm.doc.posting_date,
                    target_docname: frm.doc.os_interna_link,
                }
            });
        }
    }

});