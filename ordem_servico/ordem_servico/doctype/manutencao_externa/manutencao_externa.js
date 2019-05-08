// Copyright (c) 2019, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on('Manutencao Externa', {
	validate: function (frm) {
		frappe.call({
			method: 'ordem_servico.ordem_servico.doctype.ordem_servico_externa.ordem_servico_externa.update_maint_status',
			args: {
				doctype: 'Ordem Servico Externa',
				docname: frm.doc.os_link,
				maint_name: frm.doc.name,
				status: frm.doc.workflow_state,
			}
		})
	}
});