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
    idx = int(purposes_idx) - 1

    # Create quotation doc
    quotation = frappe.new_doc("Quotation")
    quotation.os_doctype = "Maintenance Visit"
    if maint.local_manutencao == 'Interno':
        quotation.observacao_tecnica = maint.purposes[idx - 1].observacao_3
        quotation.defeito_constatado = maint.purposes[idx - 1].defeito_constatado2
    elif maint.local_manutencao == 'Externo':
        quotation.observacao_tecnica = maint.purposes[idx - 1].observacao_2
        quotation.defeito_constatado = maint.purposes[idx - 1].defeito_constatado
    quotation.os_link = maint.name
    quotation.tipo_manutencao = maint.local_manutencao
    quotation.customer = maint.customer_name
    quotation.numero_serie = maint.purposes[idx - 1].numero_serie
    quotation.descricao_equipamento = maint.purposes[idx - 1].item_name
    quotation.tag = maint.purposes[idx - 1].tag
    quotation.email = frappe.db.get_value('Contacts', {'customer': quotation.customer}, ['email_id'])
    date = datetime.date.today()
    date = date + datetime.timedelta(days=15)
    quotation.valid_till = date.strftime('%y-%m-%d')
    quotation.tc_name = "Boleto 15 dias"
    quotation.terms = frappe.db.get_value(
        'Terms and Conditions', {'name': 'Boleto 15 dias'}, ['terms'])
    quotation.conversion_rate = 1
    quotation.plc_conversion_rate = 1
    quotation.price_list_currency = "BRL"
    quotation.save()

    # Set quotation name to purposes os
    date_now = datetime.datetime.today().strftime('%Y-%m-%d')
    maint.purposes[idx - 1].status_ordem_servico = "Em Aprovação"
    maint.purposes[idx - 1].documento_orcamento = quotation.name
    maint.purposes[idx - 1].numero_orcamento = quotation.name
    maint.purposes[idx - 1].data_orcamento2 = date_now
    maint.purposes[idx - 1].data_orcamento = date_now
    maint.save()
    return quotation


@frappe.whitelist()
def make_event(doc_name):
    maint = frappe.get_doc("Maintenance Visit", doc_name)
    purposes = maint.purposes

    for row in purposes:

        # Create first event
        if (not row.evento_link and row.agendado_para):
            event = frappe.new_doc("Event")
            event.subject = row.os
            event.starts_on = datetime.datetime.now().strftime(
                "%Y-%m-%d %H:%M:00")
            event.ends_on = datetime.datetime.now().strftime(
                "%Y-%m-%d 21:00:00")
            event.manutencao = maint.name
            event.ordem_servico = row.os
            event.equipamento = row.modelo_equipamento
            event.descricao = row.item_name
            event.tag = row.tag
            event.tempo_conserto = row.tempo_conserto
            event.ref_type = "Maintenance Visit Purpose"
            event.save()

            row.status_ordem_servico = 'Em Orçamento'
            row.data_agendamento_orcamento = datetime.datetime.today(
            ).strftime('%Y-%m-%d')
            row.evento_link = event.name
            row.save()

        # Create second event
        elif (not row.evento_link2 and row.agendado_para2):
            event = frappe.new_doc("Event")
            event.subject = row.os
            event.starts_on = datetime.datetime.now().strftime(
                "%Y-%m-%d %H:%M:00")
            event.ends_on = datetime.datetime.now().strftime(
                "%Y-%m-%d 18:00:00")
            event.manutencao = maint.name
            event.ordem_servico = row.os
            event.equipamento = row.modelo_equipamento
            event.descricao = row.item_name
            event.tag = row.tag
            event.tempo_conserto = row.tempo_conserto
            event.ref_type = "Maintenance Visit Purpose"
            event.owner = frappe.db.get_value("Employee", row.agendado_para2,
                                              "user_id")
            event.save()

            row.status_ordem_servico = 'Em Conserto'
            row.data_agendamento_orcamento = datetime.datetime.today(
            ).strftime('%Y-%m-%d')
            row.evento_link2 = event.name
            row.save()


@frappe.whitelist()
def custom_get_value(doctype,
                     fieldname,
                     filters=None,
                     as_dict=True,
                     debug=False,
                     parent=None):
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

    return frappe.db.get_value(
        doctype, filters, fieldname, as_dict=as_dict, debug=debug)


@frappe.whitelist()
def get_tempo_orcamento_conserto(equipamento):
    familia = frappe.db.get_value('Equipamentos', {'name': equipamento},
                                  ['familia'])
    data = frappe.db.get_value(
        'Familias de Equipamentos', {'name': familia},
        ['tempo_orcamento', 'tempo_conserto'],
        as_dict=True)
    return data