frappe.ui.form.on("Maintenance Visit", {
	after_save: function(frm) {
		frappe.call( {
			method: "ordem_servico.ordem_servico.ordem_servico.rename_os",
			args: { doc_maint: frm.doc.name, },
			callback: function(r){
				cur_frm.__unsaved = 1;
			}
		});
		frm.reload_doc();
	},

	customer: function (frm) {
		if (frm.doc.purposes) {
			frm.doc.purposes = [];
		}
	},
	
	local_manutencao: function (frm) {
		frm.fields_dict.purposes.grid.get_field('numero_serie').get_query = function() {
			return {
				filters: { "parent": cur_frm.doc.customer }
			}
		}
	}

});

frappe.ui.form.on("Maintenance Visit Purpose", { 

	orcamento: function(frm, cdt, cdn) {
		//Run script if document is already saved
		if (!frm.doc.__unsaved) {
			d = locals[cdt][cdn]
			if (d.garantia == 0){
				if (frm.doc.local_manutencao == "Interno") {
					//Take datas of index
					d = locals[cdt][cdn];
		  			frappe.call( {
						method: "ordem_servico.ordem_servico.ordem_servico.make_orcamento",
						args: {
							doc_maint: frm.doc.name,
							purposes_os: d.os,
						},
						callback: function(r){
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
				method:"frappe.client.get_value",
				args: {
					doctype:"Materiais",
					filters: {
						numero_serie: d.numero_serie,
					},
					fieldname:["modelo", "descriao", "tag"]
				}, 
				callback: function(r) { 
					console.log(r);
			
				}
			})	
		}
	},

	agendado_para: function (frm, cdt, cdn) {
		d = locals[cdt][cdn];
		frappe.call({
			method: "ordem_servico.ordem_servico.ordem_servico.get_materials",
			args: {
				"tab_idx": d.idx
			},
			callback: function (r) {
				data = r.message;
				sql_result = data[0][0];
				console.log(data = r.message);
			}
		});
	}

});

