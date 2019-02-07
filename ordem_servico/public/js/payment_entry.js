frappe.ui.form.on('Payment Entry', {

    onload: function (frm) {
        if (frm.doc.__islocal) {
            // Get previous doc route
            var prev_route = frappe.get_prev_route();
            var prev_doctype = prev_route[1];
            var prev_docname = prev_route[2];
            var prev_doc = frappe.get_doc(prev_doctype[1], prev_docname[2]);
            console.log(prev_doc);

            // Check if is a Sales Order and has os_interna_link
            if (prev_doc.doctype == 'Sales Order' && prev_doc.os_interna_link) {
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
                    source_transaction_date: frm.doc.transaction_date,
                    target_docname: frm.doc.os_interna_link,
                }
            });
        }
    }

});