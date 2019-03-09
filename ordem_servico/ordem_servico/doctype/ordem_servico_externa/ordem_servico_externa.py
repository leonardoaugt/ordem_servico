# -*- coding: utf-8 -*-
# Copyright (c) 2018, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from ...utils import time_now
import datetime


class OrdemServicoExterna(Document):
	pass

@frappe.whitelist()
def make_os_externa(docname):
    sales_order = frappe.get_doc('Sales Order', docname)
    os_externa = frappe.new_doc('Ordem Servico Externa')
    os_externa.customer = sales_order.customer
    os_externa.transaction_date = datetime.datetime.now().date()
    os_externa.customer_address = sales_order.customer_address
    os_externa.address_display = sales_order.address_display
    os_externa.contact_person = sales_order.contact_person
    os_externa.contact_display = sales_order.contact_display
    os_externa.contact_mobile = sales_order.contact_mobile
    return os_externa


