// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ordem Servico Externa', {
    
    onload: function (frm) {
        frm.fields_dict['equipments'].grid.get_field('serial_number').get_query = function () {
            return {
                filters: {
                    'parent': cur_frm.doc.customer
                }
            }
        }
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

	after_save: function (frm) {
		if (frm.doc.multiple_equipments) {
			frappe.call({
				method:'ordem_servico.ordem_servico.doctype.ordem_servico_externa.ordem_servico_externa.create_maintenances',
				args: {
					source_docname: frm.doc.name,
				},
				callback: function (r) {
					console.log(r.message);
				}
			});
		}
	}

});
