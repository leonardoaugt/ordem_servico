frappe.ui.form.on("Quotation", {
  after_save: function(frm) {
    //Set Quotation on OS History section
    if (frm.doc.os_interna_link) {
      const { name, transaction_date, os_interna_link } = frm.doc
      frappe.call({
        method: 'ordem_servico.ordem_servico.utils.set_quotation_history',
        args: {
          source_docname: name,
          source_transaction_date: transaction_date,
          target_docname: os_interna_link
        }
      })
    }
  }
})
