frappe.ui.form.on('Sales Invoice', {
  after_save(frm) {
    //Set Sales Invoice on OS History section
    if (frm.doc.os_interna_link) {
      const { name, posting_date, os_interna_link } = frm.doc
      frappe.call({
        method: 'ordem_servico.ordem_servico.utils.set_sales_invoice_history',
        args: {
          source_docname: name,
          source_transaction_date: posting_date,
          target_docname: os_interna_link
        }
      })
    }
  }
})