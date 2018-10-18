# -*- coding: utf-8 -*-
# Copyright (c) 2018, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

# Custom imports
from ordem_servico.ordem_servico.utils import (time_now, sum_time)


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


@frappe.whitelist()
def make_event(docname, start_date, start_time, work_time):
	event = frappe.new_doc('Event')
	event.subject = docname
	event.starts_on = '{} {}'.format(start_date, start_time)
	event.ends_on = '{} {}'.format(start_date, sum_time(start_time, work_time))
	event.ref_type = 'Ordem Servico Interna'
	event.ref_name = docname
	event.save()
	return event.name
