# -*- coding: utf-8 -*-
# Copyright (c) 2018, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

# Custom imports
import time
from datetime import datetime



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
def make_event(doc_name, start_date, start_time, work_time):
	doc_event = frappe.new_doc('Event')
	doc_event.subject = doc_name
	doc_event.starts_on = '{} {}'.format(start_date, start_time)
	doc_event.ends_on = '{} {}'.format(start_date, sum_time(start_time, work_time))
	doc_event.ref_type = 'Ordem Servico Interna'
	doc_event.ref_name = doc_name
	doc_event.save()
	return doc_event.name


def sum_time(t1, t2):
    t1 = time.strptime(str(t1), '%H:%M:%S')
    t2 = time.strptime(str(t2), '%H:%M:%S')
    total_hour = t1.tm_hour + t2.tm_hour
    total_min = t1.tm_min + t2.tm_min
    if total_min >= 60:
        total_hour += 1
        total_min -= 60 # Get minutes difference
    time_object = '{}:{}:00'.format(total_hour, total_min)
    return time_object


@frappe.whitelist()
def time_now():
	now = datetime.now().strftime('%d-%m-%Y %H:%M:%S')
	return now
