// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt

{% include 'ordem_servico/public/js/ordem_servico.js' %}

frappe.ui.form.on('Ordem Servico Interna', {
  schedule_quotation_event(frm) {
    const { __unsaved } = cur_frm.doc
    if (__unsaved) {
      frappe.throw('Favor salvar documento!')
    }
    const {
      doctype,
      name,
      quotation_schedule_date,
      quotation_schedule_time,
      quotation_time
    } = frm.doc
    frappe.call({
      method: 'ordem_servico.ordem_servico.utils.make_event',
      args: {
        doctype: doctype,
        docname: name,
        start_date: quotation_schedule_date,
        start_time: quotation_schedule_time,
        work_time: quotation_time,
        trigger: 'quotation'
      }
    })
    frm.reload_doc()
    show_alert('Orçamento agendado.')
  },
  start_quotation(frm) {
    const { __unsaved } = cur_frm.doc
    if (__unsaved) {
      frappe.throw('Favor salvar documento!')
    }
    const { doctype, name } = frm.doc
    frappe.call({
      method: 'ordem_servico.ordem_servico.utils.get_time_now',
      args: {
        doctype: doctype,
        docname: name,
        trigger: 'start_quotation'
      }
    })
    show_alert('Orçamento iniciado.')
    frm.reload_doc()
  },
  end_quotation(frm) {
    const { __unsaved } = cur_frm.doc
    if (__unsaved) {
      frappe.throw('Favor salvar documento!')
    }
    const { doctype, name } = frm.doc
    frappe.call({
      method: 'ordem_servico.ordem_servico.utils.get_time_now',
      args: {
        doctype: doctype,
        docname: name,
        trigger: 'end_quotation'
      }
    })
    show_alert('Orçamento finalizado.')
    frm.reload_doc()
  },
  create_quotation(frm) {
    const { __unsaved } = frm.doc
    if (__unsaved) {
      frappe.throw(__('You have unsaved changes in this form. Please save before you continue.'))
    }
    frappe.call({
      method: 'ordem_servico.ordem_servico.utils.make_quotation',
      args: {
        os_docname: frm.doc.name
      },
      callback(r) {
        frappe.model.sync(r.message)
        const { doctype, name } = r.message
        frappe.set_route('Form', doctype, name)
      }
    })
  },
  schedule_repair_event(frm) {
    const { __unsaved } = cur_frm.doc
    if (__unsaved) {
      frappe.throw('Favor salvar documento!')
    }
    const {
      doctype,
      name,
      repair_schedule_date,
      repair_schedule_time,
      repair_time
    } = frm.doc
    frappe.call({
      method: 'ordem_servico.ordem_servico.utils.make_event',
      args: {
        doctype: doctype,
        docname: name,
        start_date: repair_schedule_date,
        start_time: repair_schedule_time,
        work_time: repair_time,
        trigger: 'repair'
      }
    })
    frm.reload_doc()
    show_alert('Conserto agendado.')
  },
  start_repair(frm) {
    const { __unsaved } = cur_frm.doc
    if (__unsaved) {
      frappe.throw('Favor salvar documento!')
    }
    const { doctype, name } = frm.doc
    frappe.call({
      method: 'ordem_servico.ordem_servico.utils.get_time_now',
      args: {
        doctype: doctype,
        docname: name,
        trigger: 'start_repair'
      }
    })
    frm.reload_doc()
    show_alert('Conserto iniciado.')
  },
  end_repair(frm) {
    const { __unsaved } = cur_frm.doc
    if (__unsaved) {
      frappe.throw('Favor salvar documento!')
    }
    const { doctype, name } = frm.doc
    frappe.call({
      method: 'ordem_servico.ordem_servico.utils.get_time_now',
      args: {
        doctype: doctype,
        docname: name,
        trigger: 'end_repair'
      }
    })
    frm.reload_doc()
    show_alert('Conserto finalizado.')
  }
})
