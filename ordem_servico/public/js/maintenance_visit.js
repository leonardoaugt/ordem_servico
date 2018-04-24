frappe.ui.form.on("Maintenance Visit", {

	// Rename Quotation
	after_save: function(frm) {
		frappe.call( {
			method: "ordem_servico.ordem_servico.ordem_servico.rename_quotation",
			args: { doc_maint: frm.doc.name, },
			callback: function(r){
				cur_frm.__unsaved = 1;
			}
		});
		frm.reload_doc();
	},

	// Clear purposes when change customer
	customer: function (frm) {
		if (frm.doc.purposes) {
			frm.doc.purposes = [];
			frm.add_child('purposes');
		}
	},
	
	local_manutencao: function (frm) {

		// Set serie_number
		frm.fields_dict.purposes.grid.get_field('numero_serie').get_query = function () {
			return {
				filters: { 
					"parent": cur_frm.doc.customer }
			}
		},

		frm.fields_dict.purposes.grid.get_field('agendado_para').get_query = function () {
			return {
				filters: { 
					"department": ["in", ["Diretoria", "Assistência Técnica"]] }
			}
		},

		frm.fields_dict.purposes.grid.get_field('agendado_para2').get_query = function () {
			return {
				filters: {
					"department": ["in", ["Diretoria", "Assistência Técnica"]]
				}
			}
		},

		frm.fields_dict.purposes.grid.get_field('agendado_por').get_query = function () {
			return {
				filters: {
					"department": ["in", ["Diretoria", "Vendas"]]
				}
			}
		},

		frm.fields_dict.purposes.grid.get_field('agendado_por2').get_query = function () {
			return {
				filters: {
					"department": ["in", ["Diretoria", "Vendas"]]
				}
			}
		}

	}

});

frappe.ui.form.on("Maintenance Visit Purpose", {

	orcamento: function (frm, cdt, cdn) {
		if (!frm.doc.__unsaved) {
			d = locals[cdt][cdn]
			if (d.garantia == 0) {
				if (frm.doc.local_manutencao == "Interno") {
					// Take index datas
					d = locals[cdt][cdn];
					frappe.call({
						method: "ordem_servico.ordem_servico.ordem_servico.new_quotation",
						args: {
							doc_maint: frm.doc.name,
							purposes_os: d.os,
						},
						callback: function (r) {
							var doc = r.message;
							frappe.set_route("Form", "Quotation", doc.name);
						}
					});
				} else { frappe.throw("Local de Manutenção deve ser Interno!") }
			} else { frappe.throw("Equipamento na garantia!") }
		} else { frappe.throw("Salve o documento primeiro!") }
	},

	numero_serie: function (frm, cdt, cdn) {
		d = locals[cdt][cdn];
		if (d.numero_serie) {
			frappe.call({
				method: "frappe.client.get_value",
				args: {
					doctype: "Materiais",
					filters: {
						numero_serie: d.numero_serie,
					},
					fieldname: ["modelo", "descricao", "tag"]
				},
				callback: function (r) {
					data = r.message;
					idx = (d.idx - 1);
					cur_frm.doc.purposes[idx].item_name = data['descricao'];
					cur_frm.doc.purposes[idx].modelo_equipamento = data['modelo'];
					cur_frm.doc.purposes[idx].tag = data['tag'];
					cur_frm.refresh_field("purposes");
				}
			});
		}
	},

	// Functions
	
	agendado_para: function (frm, cdt, cdn) {
		d = locals[cdt][cdn];
		if (d.agendado_para) {
			frappe.call({
				method: "frappe.client.get_value",
				args: {
					doctype: "Employee",
					filters: {
						name: d.agendado_para,
					},
					fieldname: "employee_name"
				},
				callback: function (r) {
					data = r.message;
					idx = (d.idx - 1);
					cur_frm.doc.purposes[idx].agendado_para= data['employee_name'];
					cur_frm.refresh_field("agendado_para");
				}
			});
		}
	},

});