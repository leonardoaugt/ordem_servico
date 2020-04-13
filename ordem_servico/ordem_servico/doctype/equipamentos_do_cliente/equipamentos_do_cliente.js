// Copyright (c) 2019, laugusto and contributors
// For license information, please see license.txt
const DocTypes = {
  OS_INTERNA : 'Ordem Servico Interna',
  OS_EXTERNA : 'Ordem Servico Externa'
}

frappe.ui.form.on('Equipamentos do Cliente', {
  refresh(frm) {
    frm.add_custom_button(
      'OS Interna',
      () => frm.events.make_os(frm, DocTypes.OS_INTERNA),
      'Make'
    )
    frm.add_custom_button(
      'OS Externa',
      () => frm.events.make_os(frm, DocTypes.OS_EXTERNA),
      'Make'
    )
  },
  make_os(frm, doctype) {
    frappe.call({
      method: 'ordem_servico.ordem_servico.utils.make_os',
      args: {
        doctype: doctype,
        customer: frm.doc.customer,
        docname: frm.doc.name
      },
      callback(r) {
        frappe.model.sync(r.message)
        frappe.set_route('Form', r.message.doctype, r.message.name)
      }
    })
  }
})
