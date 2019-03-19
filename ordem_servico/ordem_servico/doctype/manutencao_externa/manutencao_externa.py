# -*- coding: utf-8 -*-
# Copyright (c) 2019, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ManutencaoExterna(Document):
	pass


@frappe.whitelist()
def make_manutencao_externa(source_docname):
	os_externa = frappe.get_doc('Ordem Servico Externa', source_docname)
	maint = frappe.new_doc('Manutencao Externa')
	maint.name = 'MAINT-{}.#'.format(os_externa.name)
	maint.customer = os_externa.customer
	maint.save()