// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ordem Servico Externa', {
	refresh(frm) {
		frm.events.apply_filters(frm)
		frm.events.add_os_button(frm)
		frm.events.add_schedule_button(frm)
		frm.events.add_cancel_button(frm)
	},
	add_os_button(frm) {
		if (frm.events.show_maint_button(frm)) {
			frm.add_custom_button(__('Gerar Manutenção'),
				() => frm.events.make_maintenance(frm),
				__("Make"))
		}
	},
	add_schedule_button(frm) {
		if (frm.events.show_schedule_button(frm)) {
			frm.add_custom_button(__('Agendar Manutenção'),
				() => frm.events.schedule_maintenance(frm),
				__("Make"))
		}
	},
	add_cancel_button(frm) {
		if (frm.events.show_cancel_button(frm)) {
			frm.add_custom_button(__('Cancelar'),
				() => frm.events.cancel_maintenances(frm),
				__("Status"))
		}
	},
	show_maint_button(frm) {
		return frm.doc.workflow_state === 'Enviado'
	},
	show_schedule_button(frm) {
		return frm.doc.workflow_state === 'Agendamento Pendente'
	},
	show_cancel_button(frm) {
		return frm.doc.workflow_state !== 'Concluído'
	},
	make_maintenance(frm) {
		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.manutencao_externa.manutencao_externa.make_maintenance',
			args: {
				docname: frm.doc.name,
			},
			callback() {
				frm.reload_doc()
				frappe.show_alert({
					message: 'Manutenções geradas!',
					indicator: 'green',
				})
			}
		})
	},
	schedule_maintenance(frm) {
		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.ordem_servico_externa.ordem_servico_externa.schedule_maintenance',
			args: {
				docname: frm.doc.name,
				repair_person: frm.doc.repair_person,
			},
			callback() {
				frm.reload_doc()
				frappe.show_alert({
					message: 'Manutenção agendada!',
					indicator: 'green',
				})
			}
		})
	},
	cancel_maintenances(frm) {
		frappe.confirm(`Tem certeza que deseja cancelar a Ordem de Serviço ${frm.doc.name}?`,
			function () {
				frappe.call({
					method: 'ordem_servico.ordem_servico.doctype.ordem_servico_externa.ordem_servico_externa.cancel_maintenances',
					args: {
						docname: frm.doc.name,
					},
					callback(r) {
						frm.reload_doc()
						frappe.show_alert({
							message: 'Manutenções canceladas!',
							indicator: 'grey',
						})
					}
				})
			},
			function () {
				window.close()
			}
		)
	},
	apply_filters(frm) {
		frm.fields_dict['os_equipments'].grid.get_field('serie').get_query = () => {
			return {
				filters: {
					'parent': frm.doc.customer,
				}
			}
		}
	}
})