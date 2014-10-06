/**
 * we removed the inclusion of eluminate.js and doing everything manually
 */

define([
	'lodash'
], function (_) {
	return {
		autoClose: false,
		preLoadScript: true, //if set to true this will load the script without an event firing
		//src: '//libs.coremetrics.com/eluminate.js', // This will get loaded before any of these methods run.
		initialize: function() {
		},
		afterScriptLoaded: function() {
			//cmSetClientID('90389853', true, 'data.coremetrics.com', 'sleepnumber.com');
		},
		/**
		 * The current rules just get the last piece of the path except for landing pages where it also gets the lp/ before the last part
		 * https://m.sleepnumber.com/lp/beds 					->		lp/beds
		 * https://m.sleepnumber.com/b/bedSeries/p-Series		->		p-Series
		 */
		pageView: function(settings, view) {
			var _this = this,
				url = (this.app.context.path.match(/^[^?#]*/) || [])[0], //strip querystring and #
				match = url.match(/(lp\/)?[^\/]*$/) || [],
				pageId = match[0];

			if (this.app.context.path === '' || this.app.context.path === '/') {
				pageId = 'Home';
			}

			// implementation using eluminate.js
			//cmCreatePageviewTag(pageId, '', '', '');

			// manual implementation
			this.sendImageTag({
				tid: 1,
				pi: pageId
			});
		},
		trackConversion: function(settings, model) {
			var _this = this;

			if (model.cart) {
				var confirmationNumber = model.orderId;

				// shop 9 tag
				_.each(model.cart.cartItems, function(item) {
					_this.sendImageTag({
						tid: 4,
						at: 9,
						pr: _this.formatName(item.name),//item.productId || item.name,
						pm: _this.formatName(item.name),
						qt: item.quantity,
						bp: item.itemPrice.value,
						on: confirmationNumber,
						tr: model.cart.summary.total.total.value,
						cd: 'ANONYMOUS' // Customer ID: The visitor registration Customer ID
					});
				});

				// order tag
				_this.sendImageTag({
					tid: 3,
					on: confirmationNumber,
					tr: model.cart.summary.total.total.value,
					sg: model.cart.summary.total.shipping.value,
					cd: 'ANONYMOUS',
					ct: model.city,
					sa: model.state
				});
			}
		},
		formatName:function(name){
			name = name || '';
			return name.replace(/Sleep Number®/,'').trim();
		},
		productView: function(settings, model) {
			// productview tag
			this.sendImageTag({
				tid: 5,
				pi: 'PRODUCT:' + model.name + '(' + model.productId + ')',
				pr: this.formatName(model.name),// model.productId,
				pm: this.formatName(model.name),
				pc: 'N'
			});
		},
		cartAdd: function(settings, model) {
			// shop 5 tag
			this.sendImageTag({
				tid: 4,
				at: 5,
				pr: this.formatName(model.name),//model.id,
				pm: this.formatName(model.name),
				qt: model.quantity,
				bp: model.price
			});
		},
		leadGenSubmit: function(settings) {
			// element tag
			this.sendImageTag({
				tid: 15,
				eid: 'Lead Generation',
				ecat: '	DIRECT #1 SUBMITTED',
//				eid: 'Submitted',
//				ecat: 'Lead Gen',
				pflg: 0
			});
		},
		emailSignUp: function(settings) {
			// element tag
			this.sendImageTag({
				tid: 15,
				eid: 'Lead Generation',
				ecat: 'EZ-Email SUBMITTED',
//				eid: 'EZ-Email',
//				ecat: 'Lead Generation',
				pflg: 0
			});
		},
		sendImageTag: function(options) {
			options = _.extend({
				ci: '90389853',
				vn2: 'mobile',
				st: (new Date()).getTime(),
				vn1: '4.1.1',
				ec: 'UTF-8',
				ul: this.app.context.url
			}, options);

			var url = 'https://data.coremetrics.com/eluminate?';

			var params = [];

			_.each(options, function(val, key) {
				params.push(key + '=' + encodeURIComponent(val));
			});

			url += params.join('&');

			var image = new Image();
			image.src = url;
		},
		onClose: function() {}
	};
});
