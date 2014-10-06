define(['lodash',
	'modules/widgets/classes/spinner',
	'modules/widgets/views/slider',
	'modules/widgets/classes/scrollDetect',
	'modules/widgets/classes/scrollBottom'
], function (_, smartSpin) {
	//controllers should only be initialized once so we create them before hand
	return {
		//layout:'default',
		globalEvents: {
			'controller.renderDone': 'spinnerStop',
			'widgets:slider.create': 'slider',
			'widgets:scroller.create': 'scroller',
			'widgets:spinner': 'spinnerStart',
			'widgets:spinner.overlay': 'spinnerOverlay',
			'widgets:spinner.stop': 'spinnerStop',
			'route': 'spinnerOverlay',
			'widgets:scroll.detect': 'scrollDetect',
			'widgets:scroll-bottom': 'scrollBottom'
		},
		//filters:{},
		//before:function(){ },
		slider: function (el, options, callback) {
			if (this.app.isNode) {
				return false;
			}
			var _this = this,
				sliders = [],
				slider = null;
			_.each($(el), function (item) {
				slider = _this.factory.view.create('modules/widgets/views/slider', _.extend({
					el: item
				}, options));
				sliders.push(slider);
			});

			//if we use a trigger to start the slider we need a callback to get the instance of the slider
			if (callback) {
				//pass an array of sliders if there are many or just the slider to the callback
				callback((sliders.length > 1 ? sliders : slider));
			}
			//return slider in case we call the function directly
			return (sliders.length > 1 ? sliders : slider);

		},
		scroller: function (options) {
			console.log('scroller');
		},
		spinnerOverlay: function () {
			if (!this.app.firstRoute) {
				var _this = this;
				if (!$('body').find('.spinner').length) {
					_this.spinnerStart($('.app-wrapper'), {
						overlay: true,
						color: '#000',
						position: 'fixed',
						size: 'large'
					});
				}
			}
		},
		spinnerStart: function (el, options) {
			if (this.app.isNode) {
				return false;
			}
			var $el = $(el);
			$el.addClass('spin-contain');
			var spinner = new smartSpin().createSpinner(el, options);

			return false;
		},
		spinnerStop: function () {
			if (!this.app.isNode) {
				//this.spinner.stop();
				$('.spin-contain').removeClass('spin-contain');
				this.app.nextTick(function () {
					$('.spinner').remove();
					$('#spinner-block-ui').remove();
				});

			}
		},
		scrollDetect: function (options) {
			this.factory.object.create('modules/widgets/classes/scrollDetect', options);
		},
		scrollBottom: function (options) {
			this.factory.object.create('modules/widgets/classes/scrollBottom', options);
		}



		//after:function(){ }
	};
});