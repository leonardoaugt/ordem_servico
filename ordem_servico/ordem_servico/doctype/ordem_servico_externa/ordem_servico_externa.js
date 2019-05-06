// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ordem Servico Externa', {

	setup: function (frm) {
		frm.custom_make_buttons = {
			'Ordem Serviço Externa': 'OS Externa',
		}
	},

	refresh: function (frm) {
		frm.events.add_custom_button(frm);
	},

	add_custom_button: function (frm) {
		if (frm.events.show_maint_button(frm)) {
			cur_frm.add_custom_button(__('Gerar Manutenção'),
				() => frm.events.make_maintenance(frm),
				__("Make"));
		}
	},

	show_maint_button: function (frm) {
		let status = 'Aguardando Manutenção'
		let valid = frm.doc.workflow_state == status ? true : false;

		return valid;
	},

	make_maintenance: function (frm) {
		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.manutencao_externa.manutencao_externa.make_maintenance',
			args: {
				docname: frm.doc.name,
			},
			callback: function (r) {
				frappe.show_alert({
					message: 'Manutenções geradas!',
					indicator: 'green',
				})
			}

		})
		frm.reload_doc();
	},
});