define([
	'lodash'
], function (_) {
	return {
		template: 'modules/cart/templates/index',
		globalEvents: {},
		events: {
			'change select[name="quantity"]':'update',
			'click .cart-remove':'removeItem',
			'click .apply-coupon':'coupon',
			'click .apply-certificate':'certificate',
			'click .btn-checkout':'proceed',
            'click .cert-remove':'removeCertificate',

			'click .item-availability header':'showAvailable',
			'click .shipping-restrictions a': 'showStateInfo'
		},
		goBack:function(){
			window.history.back();
			return false;
		},
		update: function (e) {
			var _this = this,
				$el = $(e.currentTarget),
				index = $el.closest('form').attr('data-index'),
				form = _this.model.attributes.resultset.cart.cartItems[index].updateForm;

			form.serialize('.qty-update[data-index="'+index+'"]');

			_this.app.trigger('widgets:spinner', $el, {color: '#fff', overlay: true, size: 'small'});
			form.set('quantity', $el.val());

			form.fetch(function (model) {
				_this.app.trigger('service:process',model);
				_this.app.trigger('widgets:spinner.stop');
			});

			return false;
		},
		removeItem: function (e) {
			var _this = this,
				$el = $(e.currentTarget),
				index = $el.parent().parent().parent().attr('data-index'),
				form = _this.model.attributes.resultset.cart.cartItems[index].removeItem;

			form.serialize('.remove-item[data-index="'+index+'"]');

			_this.app.trigger('widgets:spinner', $el, {color: '#fff', overlay: true, size: 'small'});

			form.fetch(function (model) {
				_this.model.set(model.attributes);
				_this.app.trigger('widgets:spinner.stop');
			});

			return false;
		},
		coupon: function (e) {
			var _this = this,
				$el = $(e.currentTarget),
				form = this.model.actions.applyCoupon;

			form.serialize('#apply-coupon-form');

			if (form.validate()) {
				_this.app.trigger('widgets:spinner', $el, {color: '#fff', overlay: true, size: 'small'});

				form.fetch(function (model) {
					_this.model.set(model.attributes);
					_this.app.trigger('widgets:spinner.stop');
				});
			}
			return false;
		},
		certificate: function (e) {
			var _this = this,
				$el = $(e.currentTarget),
				form = this.model.actions.applyCertificate;

			form.serialize('#apply-certificate-form');

			if (form.validate()) {
				_this.app.trigger('widgets:spinner', $el, {color: '#fff', overlay: true, size: 'small'});

				form.fetch(function (model) {
					_this.model.set(model.attributes);
					_this.app.trigger('widgets:spinner.stop');
				});
			}
			return false;
		},
        removeCertificate: function (e) {
            var _this = this,
                href = _this.model.attributes.resultset.cart.summary.certificates[0].remove;

            var model = _this.factory.model.create({
                url:'/api/generic?url='+encodeURIComponent(href)
            });
            model.fetch({
                success:function(newmodel){
                    _this.model.set(newmodel.attributes);
                }
            });

            return false;
        },
		proceed: function (e) {
			var _this = this,
				$el = $(e.currentTarget);

			//Removed for weekend checkout 'outage' on desktop
			_this.app.trigger('widgets:spinner', $el.find('i'), {color: '#fff', overlay: false, size: 'small'});

			_this.app.router.navigate('/ssl/cart/checkout', true);
			return false;
		},
		showStateInfo: function(e){
			var _this = this,
				$el = $(e.currentTarget);
			_this.app.trigger('global:modal',{
				anchor:true,
				view:_this.factory.view.create('modules/cart/views/stateModal',{
					dataShow:$el.data('show'),
					model:{}
				})
			});
			return false;
		},
		serialize: function () {
			var _this = this,
				data = _this.model.attributes.resultset,
				cartItems = data.cart.cartItems;

			_.each(cartItems, function (item) {
				item.updateForm = _this.app.modules.forms.create(item.updateQty);
				item.removeItem = _this.app.modules.forms.create(item.removeItem);
			});
			return data;
		},
		afterRender: function () {
		var _this = this,
			errors = _this.model.attributes.resultset.errors;

			if(!this.app.isNode){

				$(window).trigger('Shopping Cart');

				_this.app.trigger('global:alert', errors);

				_this.model.actions.applyCoupon.validateSetup('#apply-coupon-form', {
					alertType: {
						type: 'inline',
						body: ''
					}
				});

				_this.model.actions.applyCertificate.validateSetup('#apply-certificate-form', {
					alertType: {
						type: 'inline',
						body: ''
					}
				});

			}
		}
	};
});