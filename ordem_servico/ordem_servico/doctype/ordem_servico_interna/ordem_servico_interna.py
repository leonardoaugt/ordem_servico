# -*- coding: utf-8 -*-
# Copyright (c) 2018, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


# Custom files
from ordem_servico.ordem_servico.utils import (time_now, sum_time, get_items, get_total)


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
def make_event(doctype, docname, start_date, start_time, work_time, trigger):
	event = frappe.new_doc('Event')
	event.subject = docname
	event.starts_on = '{} {}'.format(start_date, start_time)
	event.ends_on = '{} {}'.format(start_date, sum_time(start_time, work_time))
	event.ref_type = 'Ordem Servico Interna'
	event.ref_name = docname
	event.save()
	os = frappe.get_doc(doctype, docname)
	if trigger == 'quotation':
		os.quotation_event_link = event.name
	elif trigger == 'repair':
		os.repair_event_link = event.name
		os.status_order_service = 'Em Conserto'
	os.save()


@frappe.whitelist()
def get_time_now(doctype, docname, trigger):
    os = frappe.get_doc(doctype, docname)
    if trigger == 'start_quotation':
        os.start_quotation_time = time_now()
    elif trigger == 'end_quotation':
        os.end_quotation_time = time_now()
    elif trigger == 'start_repair':
        os.start_repair_time = time_now()
    elif trigger == 'end_repair':
        os.end_repair_time = time_now()
        os.status_order_service = 'Encerrada'
    os.save()
