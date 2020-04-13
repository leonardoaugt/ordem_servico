// Copyright (c) 2019, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on('Equipamentos do Cliente', {
  refresh(frm) {
    frm.add_custom_button(
      'OS Interna',
      () => frm.events.make_os_interna(frm),
      'Make'
    )
  },
  make_os_interna(frm) {
    frappe.call({
      method: 'ordem_servico.ordem_servico.utils.make_os_interna',
      args: {
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
