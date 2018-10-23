// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt

{% include "ordem_servico/public/js/ordem_servico.js" %}

frappe.ui.form.on('Ordem Servico Interna', {

	schedule_quotation_event: function (frm) {
		
		if (cur_frm.doc.__unsaved) {
			frappe.throw('Favor salvar documento!');
		}
		frappe.call({
			method: 'ordem_servico.ordem_servico.utils.make_event',
			args: {
				doctype: frm.doc.doctype,
				docname: frm.doc.name,
				start_date: frm.doc.quotation_schedule_date,
				start_time: frm.doc.quotation_schedule_time,
				work_time: frm.doc.quotation_time,
				trigger: 'quotation',
			},
		});
		frm.reload_doc();
		show_alert('Orçamento agendado.');
	},


	start_quotation: function (frm) {

		if (cur_frm.doc.__unsaved) {
			frappe.throw('Favor salvar documento!');
		}
		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.get_time_now',
			args: {
				doctype: frm.doc.doctype,
				docname: frm.doc.name,
				trigger: 'start_quotation',
			},
		});
		show_alert('Orçamento iniciado.');
		frm.reload_doc();
	},

	end_quotation: function (frm) {

		if (cur_frm.doc.__unsaved) {
			frappe.throw('Favor salvar documento!');
		}
		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.get_time_now',
			args: {
				doctype: frm.doc.doctype,
				docname: frm.doc.name,
				trigger: 'end_quotation',
			},
		});
		show_alert('Orçamento finalizado.');
		frm.reload_doc();
	},

	create_quotation: function (frm) {

		if (cur_frm.doc.__unsaved) {
			frappe.throw('Favor salvar documento!');
		}
		frappe.call({
			method: 'ordem_servico.ordem_servico.utils.make_quotation',
			args: {
				doctype: frm.doc.doctype,
				docname: frm.doc.name,
				local: 'Interno',
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
		show_alert('Conserto agendado.');
	},

	start_repair: function (frm) {

		if (cur_frm.doc.__unsaved) {
			frappe.throw('Favor salvar documento!');
		}
		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.get_time_now',
			args: {
				doctype: frm.doc.doctype,
				docname: frm.doc.name,
				trigger: 'start_repair',
			},
		});
		frm.reload_doc();
		show_alert('Conserto iniciado.');
	},

	end_repair: function (frm) {

		if (cur_frm.doc.__unsaved) {
			frappe.throw('Favor salvar documento!');
		}
		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.get_time_now',
			args: {
				doctype: frm.doc.doctype,
				docname: frm.doc.name,
				trigger: 'end_repair',
			},
		});
		frm.reload_doc();
		show_alert('Conserto finalizado.');
	},

});
