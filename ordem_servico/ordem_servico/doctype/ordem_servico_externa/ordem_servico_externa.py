# -*- coding: utf-8 -*-
# Copyright (c) 2018, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from datetime import date


class OrdemServicoExterna(Document):
    def on_update(self):
        self.set_ref()

    def set_ref(self):
        so = frappe.get_doc("Sales Order", self.sales_order)
        if not so.os_externa_link:
            so.os_externa_link = self.name
            so.flags.ignore_validate_update_after_submit = True
            so.save()

    # Emulate switch case and set new workflow_status value based on switcher return
    def update_status(self):
        SUBMITTED = "Enviado"
        TO_SCHEDULE = "Agendamento Pendente"
        TO_REPAIR = "Manutenção Pendente"

        def switcher_status(status):
            switcher = {SUBMITTED: TO_SCHEDULE, TO_SCHEDULE: TO_REPAIR}
            return switcher.get(
                self.workflow_state, "Status {} não disponível".format(status)
            )

        self.workflow_state = switcher_status(self.workflow_state)
        self.flags.ignore_validate_update_after_submit = True
        self.save()


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
    os.sales_order = so.name
    os.so_transaction = so.transaction_date
    os.save()
    return os
