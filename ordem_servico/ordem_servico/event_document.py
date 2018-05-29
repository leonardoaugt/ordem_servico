# -*- coding: utf-8 -*-
# Copyright (c) 2017, laugusto and contributors
# For license information, please see license.txt
from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

from datetime import datetime

def datetime_now():
    
    return datetime.now().strftime('%d-%m-%Y %H:%M:%S')
    
@frappe.whitelist()
def start_maintenance(docname):

    doc_event = frappe.get_doc('Event', docname)
    if not doc_event.iniciar_manutencao:
        doc_event.iniciar_manutencao = datetime_now()
        doc_event.save()
    else:
        frappe.throw('A manutenção já foi iniciada!')