# -*- coding: utf-8 -*-
# Copyright (c) 2017, laugusto and contributors
# For license information, please see license.txt
from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

import datetime
import json, os
from six import iteritems, string_types, integer_types

@frappe.whitelist()
def purposes_rename(maint_name):
    maint = frappe.get_doc("Maintenance Visit", maint_name)
    len_array_purposes = len(maint.purposes)
    idx = 0
    if maint.local_manutencao == "Externo":
        local_manutencao = "EXT"
    else:
        local_manutencao = "INT"
    for idx in range(len_array_purposes):
        maint.purposes[idx].os = "OS-%s/%s" % (local_manutencao, str(idx))
    maint.save()
    return


@frappe.whitelist()
def new_quotation(maint_name, purposes_idx):
    maint = frappe.get_doc("Maintenance Visit", maint_name)

    # create quotation doc
    quotation = frappe.new_doc("Quotation")
    quotation.os_doctype = "Maintenance Visit"
    quotation.os_link = maint.name
    quotation.customer = maint.customer_name
    date = datetime.date.today()
    date = date + datetime.timedelta(days=15)
    quotation.valid_till = date.strftime('%y-%m-%d')
    quotation.tc_name = "Boleto 15 dias"
    quotation.terms = frappe.db.get_value('Terms and Conditions', {'name': 'Boleto 15 dias'}, ['terms'])
    quotation.conversion_rate = 1
    quotation.plc_conversion_rate = 1
    quotation.price_list_currency = "BRL"
    quotation.flags.ignore_mandatory = True
    quotation.flags.ignore_validate = True
    quotation.save()

    # set quotation name to purposes os
    idx = int(purposes_idx) - 1
    date_now = datetime.datetime.today().strftime('%Y-%m-%d')
    maint.purposes[idx-1].status_ordem_servico = "Em Orçamento"
    maint.purposes[idx-1].documento_orcamento = quotation.name
    maint.purposes[idx-1].numero_orcamento = quotation.name
    maint.purposes[idx-1].data_orcamento2 = date_now
    maint.purposes[idx-1].data_orcamento = date_now
    maint.save()
    return quotation


@frappe.whitelist()
def make_event(doc_name):
    maint = frappe.get_doc("Maintenance Visit", doc_name)
    purposes = maint.purposes

    for row in purposes:
        # if not agenda value on purposes_idx and has agendado_para
        if (not row.evento_link and row.agendado_para):
            # create event document
            event = frappe.new_doc("Event")
            event.subject = row.os
            datetime_now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:00")
            event.starts_on = datetime_now
            event.ends_on = datetime_now
            event.manutencao = maint.name
            event.ordem_servico = row.os
            event.ref_type = "Maintenance Visit Purpose"
            event.owner = frappe.db.get_value("Employee", row.agendado_para, "user_id")
            event.save()

            # set event doc name to purposes row
            row.data_agendamento_orcamento = datetime.datetime.today().strftime('%Y-%m-%d')
            row.agenda = event.name
            row.save()

@frappe.whitelist()
def custom_get_value(doctype, fieldname, filters=None, as_dict=True, debug=False, parent=None):
    try:
        filters = json.loads(filters)

        if isinstance(filters, (integer_types, float)):
            filters = frappe.as_unicode(filters)

    except (TypeError, ValueError):
        # filters are not passesd, not json
        pass

    try:
        fieldname = json.loads(fieldname)
    except (TypeError, ValueError):
        # name passed, not json
        pass

    # check whether the used filters were really parseable and usable
    # and did not just result in an empty string or dict
    if not filters:
        filters = None

    return frappe.db.get_value(doctype, filters, fieldname, as_dict=as_dict, debug=debug)

@frappe.whitelist()
def get_tempo_orcamento_conserto(equipamento):
    familia = frappe.db.get_value('Equipamentos', {'name': equipamento}, ['familia'])
    data = frappe.db.get_value('Familias de Equipamentos', {'name': familia}, ['tempo_orcamento', 'tempo_conserto'], as_dict=True)
    return data