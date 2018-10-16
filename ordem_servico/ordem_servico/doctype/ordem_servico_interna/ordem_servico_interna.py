# -*- coding: utf-8 -*-
# Copyright (c) 2018, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class OrdemServicoInterna(Document):
	pass

@frappe.whitelist()
def get_repair_and_quotation_times(equipment):
	equipment_family = frappe.db.get_value('Modelo Equipamento', {'model': equipment},
								['family_ref'])
	data = frappe.db.get_value(
		'Familias de Equipamentos', {'family_name': equipment_family},
		['quotation_time', 'repair_time'],
		as_dict=True)
	return data