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

		if (frm.doc.equipment_model) {
			frappe.call({
				method: 'ordem_servico.ordem_servico.doctype.ordem_servico_interna.ordem_servico_interna.get_repair_and_quotation_times',
				args: {
					equipment: frm.doc.equipment_model,
				},
				callback: function (r) {
					console.log(r);
					data = r.message;
					frm.doc.quotation_time = data['quotation_time'];
					frm.doc.repair_time = data['repair_time']
					frm.refresh_field('quotation_time');
					frm.refresh_field('repair_time');
				}
			});
		} else {
			frappe.throw('Modelo de equipamento não cadastrado para número de série:', frm.doc.serie_number, 'do cliente:', frm.doc.customer);
		}
	}

});
