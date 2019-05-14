# -*- coding: utf-8 -*-
# Copyright (c) 2018, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from ...utils import _make_event


PENDING = 'Pendente'
SUCCEEDED = 'Concluído'
CANCELLED = 'Cancelado'
SUBMITTED = "Enviado"
TO_SCHEDULE = "Agendamento Pendente"
TO_REPAIR = "Manutenção Pendente"


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

        def sync_maint_status(status):
            if all(equip.maint_status == CANCELLED for equip in self.os_equipments):
                status = CANCELLED
            elif not any(equip.maint_status == PENDING for equip in self.os_equipments):
                status = SUCCEEDED

            return status

        def switcher_status(status):
            switcher = {
                SUBMITTED: TO_SCHEDULE,
                TO_SCHEDULE: TO_REPAIR,
                TO_REPAIR: sync_maint_status(status),
            }
            switch = switcher.get(status, "Status {} não disponível".format(status))
            return switch

        self.workflow_state = switcher_status(self.workflow_state)
        self.flags.ignore_validate_update_after_submit = True
        self.save()

    def update_maint_status(self, name, workflow_state):
        for equip in self.os_equipments:
            if equip.maint_link == name:
                equip.maint_status = workflow_state
                break
        self.update_status()


@frappe.whitelist()
def make_os(docname):
    so = frappe.get_doc("Sales Order", docname)
    os = frappe.new_doc("Ordem Servico Externa")
    os.transaction_date = frappe.utils.nowdate()
    os.customer = so.customer
    os.address_name = so.customer_address
    os.address_display = so.address_display
    os.contact_person = so.contact_person
    os.contact_display = so.contact_display
    os.mobile_no = so.contact_mobile
    os.sales_order = so.name
    os.so_transaction = so.transaction_date
    os.flags.ignore_mandatory = True
    os.save()
    return os


@frappe.whitelist()
def schedule_maintenance(docname, repair_person):
    doctype = "Ordem Servico Externa"
    _make_event(doctype, docname, repair_person)


@frappe.whitelist()
def cancel_maintenances(docname):
    os = frappe.get_doc('Ordem Servico Externa', docname)
    for equip in os.os_equipments:
        if equip.maint_status == PENDING: equip.maint_status = CANCELLED
        maint = frappe.get_doc('Manutencao Externa', equip.maint_link)
        maint.workflow_state = CANCELLED
        maint.docstatus = 1
        maint.flags.ignore_validate_update_after_submit = True
        maint.flags.ignore_validate = True
        maint.save()

    os.workflow_state = CANCELLED
    os.flags.ignore_validate_update_after_submit = True
    os.save()

