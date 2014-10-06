define([
	'lodash'
], function (_) {
	return {
		autoClose: false,
		src: 'https://ssl.google-analytics.com/ga.js', // This will get loaded before any of these methods run.
		//async: true,// I do not believe this does anything
		initialize: function () {
			window._gaq = window._gaq || [];
		},
		afterScriptLoaded: function () {
		},
		pageView: function (settings, view) {
			var _this = this;

			if (this.app.context.referrer) {
				window._gaq.push([settings.prefix + '_setReferrerOverride',_this.app.context.referrer]);//not sure if I need to strip domain...
			}
			window._gaq.push([settings.prefix + '_setAccount', settings.accountNumber]);
			window._gaq.push([settings.prefix + '_trackPageview' , this.app.context.path ]);

		},
		trackConversion: function(settings, model) {
			if (model.cart) {
				var confirmationNumber = model.orderId;

				_.each(model.cart.cartItems, function(item) {
					_gaq.push([settings.prefix + '_addItem',
						confirmationNumber, 								// order ID - necessary to associate item with transaction
						item.productId, 									// SKU/code - required
						item.name, 											// product name - necessary to associate revenue with product
						'', 												// category or variation
						item.itemPrice.value,								// unit price - required
						item.quantity										// quantity - required
					]);
				});
				_gaq.push([settings.prefix + '_addTrans',
					confirmationNumber, 						// order ID - required
					'Sleep Number', 							// affiliation or store name
					model.cart.summary.total.total.value, 		// total - required
					model.cart.summary.total.taxes.value,		// tax
					model.cart.summary.total.shipping.value,	// shipping
					model.city, 							    // city
					model.state, 								// state or province
					''                                          // country
				]);

				_gaq.push([settings.prefix + '_trackTrans']);
			}
		},
		trackError:function(settings,options){
			_.extend(options,{
				time: new Date().toString(),
				timestamp : new Date().getTime(),
				request:'',
				location:this.app.context.path,
				userAgent: window.navigator.userAgent,
				referrer: this.app.context.referrer
			});
			window._gaq.push([settings.prefix + '_trackEvent', 'Errors' , options.message , JSON.stringify(options) ]);

		},
		onClose: function () {
		}
	};
});