# -*- coding: utf-8 -*-
# Copyright (c) 2018, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


class OrdemServicoExterna(Document):
    pass


@frappe.whitelist()
def make_os(docname):
    sales_order = frappe.get_doc("Sales Order", docname)
    frappe.msgprint("Chamou aqui!")
