# -*- coding: utf-8 -*-
# Copyright (c) 2018, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from datetime import date


class OrdemServicoExterna(Document):
    pass


@frappe.whitelist()
def make_os(docname):
    so = frappe.get_doc("Sales Order", docname)
    os = frappe.new_doc("Ordem Servico Externa")
    os.customer = so.customer
    os.address_name = so.customer_address
    os.address_display = so.address_display
    os.contact_person = so.contact_person
    os.contact_display = so.contact_display
    os.mobile_no = so.contact_mobile
    os.save()
    return os
