// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ordem Servico Externa', {

	refresh: function (frm) {
		frm.events.add_os_button(frm);
		frm.events.add_schedule_button(frm);
	},

	add_os_button: function (frm) {
		if (frm.events.show_maint_button(frm)) {
			frm.add_custom_button(__('Gerar Manutenção'),
				() => frm.events.make_maintenance(frm),
				__("Make"));
		}
	},

	add_schedule_button: function (frm) {
		if (frm.events.show_schedule_button(frm)) {
			frm.add_custom_button(__('Agendar Manutenção'),
				() => frm.events.make_maintenance(frm),
				__("Make"));
		}
	},

	show_maint_button: function (frm) {
		let status = 'Enviado';
		let valid = frm.doc.workflow_state == status ? true : false;

		return valid;
	},

	show_schedule_button: function (frm) {
		let status = 'Agendamento Pendente';
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

	schedule_maintenance: function (frm) {
		let maint = frm.doc;
		let event = frappe.new_doc('Event');

		event.doc.name = maint.name;
		event.link_documento = frm.doc.doctype;
		event.link_dinamico = frm.doc.name;

		frm.refresh_field('name');
		frm.refresh_field('link_documento');
		frm.refresh_field('link_dinamico');
	},
});