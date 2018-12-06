# -*- coding: utf-8 -*-
# Copyright (c) 2017, laugusto and contributors
# For license information, please see license.txt
from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


# Custom imports
import datetime, time


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
	event.ref_type = doctype
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


@frappe.whitelist()
def make_quotation(doctype, docname, local):
    os = frappe.get_doc(doctype, docname)
    quot = frappe.new_doc('Quotation')
    quot.os_doctype = os.doctype
    quot.defeito_constatado = os.problem_description
    quot.observacao_tecnica = os.problem_observation
    quot.os_link = os.name
    quot.local_manutencao = local
    quot.customer = os.customer
    quot.numero_serie = os.serie_number
    quot.descricao_equipamento = os.equipment_description
    quot.tag = os.equipment_tag
    quot.email = frappe.db.get_value('Contacts', {'customer': os.customer}, ['email_id'])
    quot.valid_till = (datetime.date.today() + datetime.timedelta(days=15)).strftime('%y-%m-%d') #Today + 15 days
    quot = get_items(os, quot)
    quot.total = get_total(os)
    quot.tc_name = 'Boleto 15 dias'
    quot.terms = frappe.db.get_value('Terms and Conditions', {'name': 'Boleto 15 dias'}, ['terms'])
    quot.conversion_rate = 1
    quot.plc_conversion_rate = 1
    quot.price_list_currency = "BRL"
    quot.flags.ignore_mandatory = True
    quot.flags.ignore_validate = True
    quot.save()
    os.quotation_link = quot.name
    os.status_order_service = 'Em Aprovação'
    os.save()


def get_items(os, quot):
    items = os.quotation_items
    for item in items:
        quot.append('items', {
            'item_code': item.item_code,
            'ncm': item.ncm_item,
            'item_name': item.item_name,
            'description': item.item_description,
            'uom': item.uom_item,
            'stock_uom': item.uom_item,
            'qty': item.item_qty,
            'rate': item.item_price,
            'net_rate': item.item_price,
            'base_rate': item.item_price,
            'base_net_rate': item.item_price,
            'amount': item.price_amount,
            'net_amount': item.price_amount,
            'base_amount': item.price_amount,
            'base_net_amount': item.price_amount,
            'conversion_factor': 1,
        })
    return quot


def get_total(os):
    items = os.quotation_items
    total = 0
    for item in items:
        total += item.price_amount
    return total


def time_now():
	now = datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S')
	return now


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
def next_contact(doc_name):
    quotation = frappe.get_doc('Quotation', doc_name)
    if quotation.local_manutencao == 'Interno' and not quotation.proximo_contato_name:
        event = frappe.new_doc('Event')
        event.all_day = 0
        event.creation = datetime.datetime.now()
        event.description = "Contact {} By : {} To Discuss : {}".format(quotation.customer, quotation.modified_by, quotation.name)
        event.event_type = "Public"
        event.name = 'EV#####'
        event.owner = quotation.modified_by
        event.ref_type = 'Quotation'
        event.ref_name = quotation.name
        event.send_reminder = 1
        date = datetime.datetime.now() + datetime.timedelta(days=1)
        event.starts_on = date.strftime('%Y-%m-%d %H:%M:00')
        event.subject = 'Contact {}'.format(quotation.customer)
        event.save()
        quotation.proximo_contato_link = 'Event'
        quotation.proximo_contato_name = event.name
        quotation.save()