// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ordem Servico Externa', {

	create_quotation: function (frm) {

		if (cur_frm.doc.__unsaved) {
			frappe.throw('Favor salvar documento!');
		}
		frappe.call({
			method: 'ordem_servico.ordem_servico.utils.make_quotation',
			args: {
				doctype: frm.doc.doctype,
				docname: frm.doc.name,
				local: 'Externo',
			},
		});
		frm.reload_doc();
		show_alert('Orçamento gerado.');
	},

	schedule_repair_event: function (frm) {

		if (cur_frm.doc.__unsaved) {
			frappe.throw('Favor salvar documento!');
		}
		frappe.call({
			method: 'ordem_servico.ordem_servico.utils.make_event',
			args: {
				doctype: frm.doc.doctype,
				docname: frm.doc.name,
				start_date: frm.doc.repair_schedule_date,
				start_time: frm.doc.repair_schedule_time,
				work_time: frm.doc.repair_time,
				trigger: 'repair',
			},
		});
		frm.reload_doc();
		show_alert('Visita agendada.');
	},



});