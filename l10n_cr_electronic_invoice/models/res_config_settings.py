# -*- coding: utf-8 -*-

from odoo import api,fields, models


class AccountConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    module_import_bills = fields.Boolean(string=u"Importación facturas electrónicas", store=False)
    invoice_import_ids = fields.Many2one(comodel_name="account.invoice.import.config",string=u'Configuración para importar facturas.', store=False,ondelete="cascade")

