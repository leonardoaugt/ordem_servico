# -*- coding: utf-8 -*-
# Copyright (c) 2017, laugusto and contributors
# For license information, please see license.txt
from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

# Custom imports
from datetime import datetime
import time


def sum_time(t1, t2):
    t1 = time.strptime(str(t1), '%H:%M:%S')
    t2 = time.strptime(str(t2), '%H:%M:%S')
    total_hour = t1.tm_hour + t2.tm_hour
    total_min = t1.tm_min + t2.tm_min
    if total_min >= 60:
        total_hour += 1
        total_min -= 60 # Get minutes difference
    time_object = '{}:{}:00'.format(total_hour, total_min)
    return time_object


@frappe.whitelist()
def time_now():
	now = datetime.now().strftime('%d-%m-%Y %H:%M:%S')
	return now

