frappe.ui.form.on('Event', {

    after_save: function (frm) {
        if (frm.link_documento == 'Ordem Servico Externa') {
            frappe.call({
                method: 'ordem_servico.ordem_servico.utils.set_reference',
                args: {
                    target_doctype: 'Ordem Servico Externa',
                    target_docname: frm.doc.link_documento,
                    attr: 'event_link',
                    source_docname: frm.doc.name,
                }
            })
        }
    }

})