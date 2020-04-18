frappe.ui.form.on('Payment Entry', {
  onload_post_render(frm) {
    const { __islocal } = frm.doc
    if (__islocal) {
      // Get document previous route
      prev_route = frappe.get_prev_route()
      prev_doctype = prev_route[1]
      prev_docname = prev_route[2]
      prev_doc = frappe.get_doc(prev_doctype, prev_docname)
      
      // Check if is a Sales Order and has os_interna_link
      if (prev_doc.doctype == 'Sales Order' || prev_doc.doctype == 'Quotation' && prev_doc.os_interna_link) {
        frm.doc.os_interna_link = prev_doc.os_interna_link
        frm.doc.local_manutencao = prev_doc.local_manutencao
        refresh_field('os_interna_link')
        refresh_field('local_manutencao')
      }
    }
  },
  after_save(frm) {
    //Set Payment Entry on OS History section
    const { os_interna_link } = frm.doc
    if (os_interna_link) {
      const { name, posting_date, os_interna_link } = frm.doc
      frappe.call({
        method: 'ordem_servico.ordem_servico.utils.set_payment_entry_history',
        args: {
          source_docname: name,
          source_transaction_date: posting_date,
          target_docname: os_interna_link
        }
      })
    }
  }
})