# -*- coding: utf-8 -*-
# Copyright (c) 2017, laugusto and contributors
# For license information, please see license.txt
from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import datetime


@frappe.whitelist()
def rename_quotation(doc_maint):
	maint = frappe.get_doc("Maintenance Visit", doc_maint)
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
def new_quotation(doc_maint, purposes_os):
	maint = frappe.get_doc("Maintenance Visit", doc_maint)
	quotation = frappe.new_doc("Quotation")
	quotation.os_doctype = "Maintenance Visit"
	quotation.os_link = maint.name
	quotation.naming_series = "%s .#" % purposes_os
	quotation.customer = maint.customer_name
	quotation.flags.ignore_mandatory = True
	quotation.flags.ignore_validate = True
	quotation.save()
	return quotation


@frappe.whitelist()
def make_event(doc_name):
	doc_maint = frappe.get_doc("Maintenance Visit", doc_name)
	purposes = doc_maint.purposes
	for row in purposes:
		event = frappe.new_doc("Event")
		event.subject = doc_maint.customer
		datetime_now = datetime.datetime.now()
		event.starts_on = datetime_now.strftime("%Y-%m-%d %H:%M:00")
		event.all_day = 1
		event.manutencao = doc_maint.name
		event.ordem_servico = row.os
		event.owner = row.agendado_para
		event.flags.ignore_mandatory = True
		event.flags.ignore_validate = True
		event.flags.ignore_permissions = True
		event.save()
		row['agenda'] = event.name
		return event
	doc_maint.save()
		
