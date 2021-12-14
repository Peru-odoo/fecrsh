odoo.define('l10n_cr_pos.PaymentScreen', function(require) {
    'use strict';

    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const Registries = require('point_of_sale.Registries');
    const session = require('web.session');
    const { useListener } = require('web.custom_hooks');
    var models = require('point_of_sale.models');

    var posorder_super = models.Order.prototype;
	models.Order = models.Order.extend({
		initialize: function(attr, options) {
			this.envio_hacienda = this.envio_hacienda || false;
			posorder_super.initialize.call(this,attr,options);
		},

		export_as_JSON: function(){
			var loaded = posorder_super.export_as_JSON.apply(this, arguments);
			loaded.envio_hacienda = this.envio_hacienda || false;
			return loaded;
		},


        set_envio_hacienda: function (envio_hacienda) {
            this.envio_hacienda = envio_hacienda;
        },
        get_envio_hacienda: function () {
            return this.envio_hacienda;
        },


	});


    const L10nCoPosPaymentScreen = PaymentScreen =>
        class extends PaymentScreen {

            constructor() {
				super(...arguments);
				this.show_envio_hacienda = this.show_envio_hacienda();
				useListener('envio-hacienda', this.envio_hacienda_action);
			}
			show_envio_hacienda(){
                var self = this;
                var envio = self.env.pos.config.show_send_hacienda;
                return envio;
            }
			envio_hacienda_action() {
                var self = this;
                var order = this.env.pos.get_order();
                var check_sent_hacienda = $("#check_sent_hacienda")[0].checked;
                var enviar = false;
                if (check_sent_hacienda && self.show_envio_hacienda){
                    enviar = true;
                }
                order.set_envio_hacienda(enviar);
                var a =1;

			}
            async _postPushOrderResolve(order, order_server_ids) {
                try {
                    if (this.env.pos.f_tipo_documento()) {
                        const result = await this.rpc({
                            model: 'pos.order',
                            method: 'search_order',
                            args: [order.uid],
                        });
                        order.set_tipo_documento(JSON.parse(result).tipo_documento || false);
                        order.set_secuencia(JSON.parse(result).sequence || false);
                        order.set_numero_electronico(JSON.parse(result).number_electronic || false);
                    }
                } finally {
                    return super._postPushOrderResolve(...arguments);
                }
            }



        };

    Registries.Component.extend(PaymentScreen, L10nCoPosPaymentScreen);

    return PaymentScreen;
});
