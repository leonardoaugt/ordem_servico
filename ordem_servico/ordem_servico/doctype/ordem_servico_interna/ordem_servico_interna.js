// Copyright (c) 2018, laugusto and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ordem Servico Interna', {

	customer: function(frm) {
		
		frm.fields_dict.serie_number.get_query = function () {
		   console.log('testing');
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
   }
});
