# -*- coding: utf-8 -*-
# Copyright (c) 2019, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

from enum import Enum

PENDING = "Pendente"
SUCCEEDED = "Concluído"
CANCELLED = "Cancelado"


class ManutencaoExterna(Document):
    def validate(self):
        if not self.workflow_state == PENDING:
            self.update_status()

    def update_status(self):
        os = frappe.get_doc('Ordem Servico Externa', self.os_link)
        os.update_maint_status(self.name, self.workflow_state)


@frappe.whitelist()
def make_maintenance(docname):
    os = frappe.get_doc("Ordem Servico Externa", docname)
    os_name = os.name

    def _make_maintenance(equipment):
        maint = frappe.new_doc("Manutencao Externa")
        maint.naming_series = "MANUT-{}-.#".format(os.name)
        maint.workflow_state = PENDING
        maint.customer = os.customer
        maint.serie = equipment.serie
        maint.tag = equipment.tag
        maint.model = equipment.model
        maint.description = equipment.description
        maint.os_link = os_name
        maint.save()
        return maint

    def set_maint(equipment, maint):
        equipment.maint_link = maint.name
        equipment.maint_status = maint.workflow_state

    for equipment in os.os_equipments:
        maint = _make_maintenance(equipment)
        set_maint(equipment, maint)

    os.update_status()
    os.flags.ignore_validate_update_after_submit = True
    os.save()

