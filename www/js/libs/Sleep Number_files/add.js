define([
	'lodash'
], function (_) {
	return {
		template: 'modules/cart/templates/add',
		globalEvents: {},
		events: {
			'click #checkout':'goToCart',
			'click .btn-continue': 'continueShopping',
			'click .btn-checkout': 'goToCart',
			'click .btn-checkout-bed': 'addBed'
		},
		goToCart:function(){
			//this.app.trigger('service:process',this.model);
			//this.app.trigger('widgets:spinner', $el.find('i'), {overlay: false});
			this.app.router.navigate('/cart/', true);
			return false;
		},
		addBed: function() {
			this.app.trigger('products:configuratorAdd', this.model);
			return false;
		},
		continueShopping:function(){
			$('.choose-base-container').html('');
			Backbone.history.history.back();
		},
/*		addBed: function(e){
				var _this = this,
					form = this.model.actions.cartAdd,
					$el = e.currentTarget ? $(e.currentTarget) : e;

				form.serialize('#form-cart-add');

				if (form.validate()) {
					form.fetch(function (model) {
					    _this.model.set(model.attributes.resultset);
					});
				}

				return false;
		},*/
//		serialize:function(){
//			var data = this.model.attributes.resultset,
//				count = data.cart.cartItems.length,
//				item = count ? data.cart.cartItems[count - 1] : null,
//				total = _.reduce(data.cart.cartItems, function (total, item) { return total + parseInt(item.quantity,10);}, 0),
//                addedProductId = this.model.addedProduct.productId;
//
//            var addedProduct = _.find(data.cart.cartItems, function(cartItem){ return cartItem.productId === addedProductId; });
//
//			return {
//				item:addedProduct,
//				totalAdded:data.quantity,
//				totalItems:total,
//				summary:data.cart.summary
//			};
//		},
		afterRender: function() {
//			console.log(this.model.attributes);
//			console.log(this.serialize());
		}
	};
});