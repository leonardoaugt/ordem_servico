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

		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.get_repair_and_quotation_times',
			args: {
				equipment: frm.doc.equipment_model,
			},
			callback: function (r) {
				data = r.message;
				frm.doc.quotation_time = data['quotation_time'];
				frm.doc.repair_time = data['repair_time']
				frm.refresh_field('quotation_time');
				frm.refresh_field('repair_time');
			}
		});
	},

	make_initial_event: function (frm) {

		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.make_event',
			args: {
				doc_name: frm.doc.name,
				start_date: frm.doc.quotation_schedule_date,
				start_time: frm.doc.quotation_schedule_time,
				work_time: frm.doc.quotation_time,
			},
			callback: function (r) {
				doc_name = r.message;
				frm.doc.quotation_event_link = doc_name;
				frm.save();
			}
		});
	},

	start_quotation: function (frm) {
		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.time_now',
			callback: function (r) {
				data = r.message;
				frm.doc.start_quotation_time = data;
				frm.save();
			}
		});
	},

	end_quotation: function (frm) {
		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.time_now',
			callback: function (r) {
				data = r.message;
				frm.doc.end_quotation_time = data;
				frm.save();
			}
		});
	},

});
