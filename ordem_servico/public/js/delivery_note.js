frappe.ui.form.on('Delivery Note', {
  after_save(frm) {
    //Set Delivery Note on OS History section
    const { os_interna_link } = frm.doc
    if (os_interna_link) {
      const { name, posting_date, os_interna_link } = frm.doc
      frappe.call({
        method: 'ordem_servico.ordem_servico.utils.set_delivery_note_history',
        args: {
          source_docname: name,
          source_transaction_date: posting_date,
          target_docname: os_interna_link
        }
      })
    }
  }
})