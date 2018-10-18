// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ordem Servico Interna', {

	customer: function (frm) {

		frm.fields_dict.serie_number.get_query = function () {
			return {
				filters: {
					'parent': cur_frm.doc.customer
				}
			}
		}

		frm.fields_dict.initial_scheduled_to.get_query = function () {
			return {
				filters: {
					'department': ['in', ['Diretoria', 'Assistência Técnica']]
				}
			}
		}

		frm.fields_dict.initial_scheduled_by.get_query = function () {
			return {
				filters: {
					'department': ['in', ['Diretoria', 'Vendas']]
				}
			}
		}

		frm.fields_dict.technical_person.get_query = function () {
			return {
				filters: {
					'department': ['in', ['Diretoria', 'Assistência Técnica']]
				}
			}
		}

		frm.fields_dict.final_scheduled_to.get_query = function () {
			return {
				filters: {
					'department': ['in', ['Diretoria', 'Vendas']]
				}
			}
		}

		frm.fields_dict.final_scheduled_by.get_query = function () {
			return {
				filters: {
					'department': ['in', ['Diretoria', 'Assistência Técnica']]
				}
			}
		}
	},

	serie_number: function (frm) {

		if (frm.doc.serie_number) {
			frappe.call({
				method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.get_repair_and_quotation_times',
				args: {
					equipment: frm.doc.equipment_model,
				},
				callback: function (r) {
					data = r.message;
					frm.doc.quotation_time = data['quotation_time'];
					frm.doc.repair_time = data['repair_time'];
					frm.refresh_field('quotation_time');
					frm.refresh_field('repair_time');
				}
			});
		}
	},

	schedule_quotation_event: function (frm) {

		if (frm.doc.__unsaved) {
			frappe.throw('Favor salvar o documento.');
		} else {
			frappe.call({
				method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.make_event',
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
		}
	},

	start_quotation: function (frm) {

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

		if (frm.doc.__unsaved) {
			frappe.throw('Favor salvar o documento.');
		} else {
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
		}
	},

	schedule_repair_event: function (frm) {

		if (frm.doc.__unsaved) {
			frappe.throw('Favor salvar o documento.');
		} else {
			frappe.call({
				method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.make_event',
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
		}
	},

	start_repair: function (frm) {

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
