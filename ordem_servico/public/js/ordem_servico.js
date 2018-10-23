// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt


frappe.ui.form.on(cur_frm.doctype, {

	onload: function () {

		this.cur_frm.fields_dict.serie_number.get_query = function () {
			return {
				filters: {
					'parent': cur_frm.doc.customer
				}
			}
		}

		this.cur_frm.fields_dict.initial_scheduled_to.get_query = function () {
			return {
				filters: {
					'department': ['in', ['Diretoria', 'Assistência Técnica']]
				}
			}
		}

		this.cur_frm.fields_dict.initial_scheduled_by.get_query = function () {
			return {
				filters: {
					'department': ['in', ['Diretoria', 'Vendas']]
				}
			}
		}

		this.cur_frm.fields_dict.technical_person.get_query = function () {
			return {
				filters: {
					'department': ['in', ['Diretoria', 'Assistência Técnica']]
				}
			}
		}

		this.cur_frm.fields_dict.final_scheduled_to.get_query = function () {
			return {
				filters: {
					'department': ['in', ['Diretoria', 'Vendas']]
				}
			}
		}

		this.cur_frm.fields_dict.final_scheduled_by.get_query = function () {
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
				method: 'ordem_servico.ordem_servico.utils.get_repair_and_quotation_times',
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

	

});
