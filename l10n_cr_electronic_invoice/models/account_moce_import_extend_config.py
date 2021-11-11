# -*- coding: utf-8 -*-

import base64
import logging
import json
from lxml import etree

from odoo import _, api, fields, models
from odoo.exceptions import UserError, ValidationError

class AccountMoveImportConfig(models.Model):
    _inherit = "account.move.import.config"

    supplier_plazo_pago = fields.Many2one('account.payment.term', string='Plazo de pago')
    supplier_metodo_pago = fields.Many2one('payment.methods', string='Método de pago')







