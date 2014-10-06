define(['lodash'],function(_){
	return {
		template: 'modules/layout/templates/default',
		autoClose:false,
		globalEvents:{
			'controller.renderDone':'onRenderDone',
			'tab.select':'toggleTab'
		},
		events:{
			'click a':'redirect',
			'click .menu-trigger':'openMainMenu',
			'click .expandable a':'toggleExpandable',
			'click .toggle-submenu a':'toggleSubMenu',
			'click [data-tab]':'toggleTab',
			'click a.home':'closeMainMenu',
			'click .static-menu .beds': 'staticMenu',
			'click .static-menu .pillows': 'staticMenu',
			'submit form#search-form': 'searchForm',
			'submit form.subscribe': 'subscribeForm',
			'click .customer-feedback': 'customerFeedback',
			'click .slideDown li a': 'closeExpandedList',
			'click .store-locator': 'findStores',
			'click .current-location': 'geolocation',
			'click .sprite-header-logo': 'logoAction',
			'submit form#email-signup': 'emailSignupForm',
			'click .btn-newcust': 'newCustomer',
			'click .click-to-call': 'clickToCall'
		},
		onRenderDone: function() {
			var $appWrapper = this.$('.app-wrapper');

			this.closeMenus();

			// checkout layout
			if (this.app.context.url && (this.app.context.url.indexOf('/checkout/') > -1 || this.app.context.url.indexOf('/cart/') > -1 || this.app.context.url.indexOf('/cart') > -1 || this.app.context.url.indexOf('/checkout') > -1)) {
				$appWrapper.addClass('checkout-layout');
			} else {
				$appWrapper.removeClass('checkout-layout');
			}
		},
		initialize: function() {
			_.bindAll(this, 'closeMainMenu');
		},
		openMainMenu: function (e) {
				var $el = $(e.currentTarget);

			if ($el.hasClass('active')) {
				$el.removeClass('active');
				$('.app-wrapper').removeClass('main-menu-active');
			} else {
				$el.addClass('active');
				$('.app-wrapper').addClass('main-menu-active');
			}

			window.scrollTo(0, 0);

			$('.app-menu > ul').css('left', '0');
			$('.app-menu .expandable ul').removeClass("slideDown").addClass('slideUp');

			return false;
		},
		showEmailModal: function() {
			this.app.trigger('global:modal', 'Thank you for your submission and your interest in SLEEP NUMBER®');
			return false;
		},
		closeMainMenu:function(scroll){
			var _this = this;
//			window.scrollTo(0,0);

			$('.app-wrapper').removeClass('main-menu-active');
			$('.expandable .active').removeClass('active');
			$('.app-menu ul li ul').removeClass("slideDown").addClass('slideUp');
			$('.menu-trigger').removeClass('active');
			_this.closeExpandedList();

			return false;
		},
		closeMenus:function(){
			// This event get triggered by the global event controller.renderDone
			if(!this.app.isNode){
				this.closeMainMenu(false);
			}
		},
		toggleExpandable:function(e){
			var $el = this.$(e.currentTarget),
				$ul = $el.next("ul");
			if($ul.length){
				$el.toggleClass("expanded collapsed");
				$ul.toggleClass("slideDown slideUp");
			}
		},
		toggleSubMenu: function(e) {
			var $el = this.$(e.currentTarget);

			if ($el.attr('href') === '#') {
				var $ul = $el.hasClass('back') ? $el.closest('.slideDown') : $el.next('ul'),
					$parentUl = $el.hasClass('back') ? $el.parents('ul').eq(1) : $el.parents('ul').eq(0);

				$ul.toggleClass("slideDown slideUp");
				this.positionSubMenu($parentUl, $el.hasClass('back') ? false : true);

//				window.scrollTo(0, 0);
			}
		},
		positionSubMenu: function($parentUl, open) {
			var $mainUl = $('.app-menu > ul'),
				percentage = '0';

			if (open === true) {
				if ($parentUl.hasClass('toggle-submenu')) {
					percentage = '-100%';
				} else {
					percentage = '-200%';
				}
			} else {
				if (!$parentUl.hasClass('toggle-submenu')) {
					percentage = '-100%';
				}
			}

			$mainUl.css('left', percentage);
		},
		staticMenu: function(e) {
			var $menuTrigger = $('.menu-trigger'),
				nth = $(e.currentTarget).hasClass('beds') ? 2 : 4;

			if (!$menuTrigger.hasClass('active')) {
				$menuTrigger.click();
			}
			$('.app-menu > ul > li:nth-child(' + nth + ') > a').click();
		},
		closeExpandedList: function(){
			$('.footer-container ul li ul').removeClass("slideDown").addClass('slideUp');
			//$('.footer-container ul li a').removeClass("expanded").addClass('collapsed');
		},
		/**
		 * Generic tab implementation
		 * You can call this also through tab:select event passing in the link you want to simulate was clicked
		 */
		toggleTab:function(e){
			var $el = e.currentTarget ? $(e.currentTarget) : e,
				tabId = $el.attr('data-tab'),
				$content = $('[data-tab-content="'+tabId+'"]');

			$el.closest('li').siblings().find('.active').removeClass('active');
			$el.addClass('active');
			$content.siblings('[data-tab-content]').hide();
			$content.show();
			return false;
		},
		searchForm:function(e){
			var $el = $(e.currentTarget).find('input[name="search"]'),
				form = this.model.actions.search;

			if(!$el.val()){
				return false;
			}

			$el.blur();
			this.app.trigger('widgets:spinner',$(e.currentTarget).find('.spin-container'), {overlay:false});
			form.serialize('#search-form');
			form.submitGet();
			$el.val('');
			return false;
		},
		emailSignupForm: function (e) {
			var _this = this,
				emailForm = this.model.actions.emailSignup;

			if (emailForm.validate()) {
                emailForm.fetch(function (model) {
                    $('input[name="newsletterEmail"]').val('');
                    _this.showEmailModal();
                    $(window).trigger('eMail Signup');
                    _this.app.trigger('analytics','emailSignUp'); // triggering core metrics
                });
            }
			return false;
		},
		logoAction: function(e){
			var _this = this;
			if($('.hero-image').is(':visible')){
				_this.closeMainMenu();
				_this.closeExpandedList();
			}else{
				this.app.navigate('/', true);
			}
		},
		returnfalse:function(e){
			return false;
		},
		redirect: function(e) {
			var $el = $(e.currentTarget),
				href = $el.attr('href') || '';

			if ($el.attr('target') !== "_blank" && $el.attr('target') !== "_self" && $el.prop('rel').indexOf('external') === -1 && href.indexOf('tel:') !== 0 && href.indexOf('mailto:') !== 0) {
				if (href === '#' || ($el.closest('.expandable').length && $el.parent('li').length && $el.next('ul').length)) {
					return false;
				}
				var match = href.match(/#([A-Za-z0-9_\/.-]*)$/); // a more relaxed regex would be: #!
				if (match) {
					var scrollToElement = $('[name="' + match[1] + '"], #' + match[1]);
					if (scrollToElement.length) {
						window.scrollTo(0, scrollToElement.offset().top);
						return false;
					}
				}

				if (( $el.attr('data-spin') !== undefined || $el.children('.spin-target').length ) && href.replace(/^\//, '') !== Backbone.history.fragment) {
					this.app.trigger('widgets:spinner', $el);
				}

				this.app.router.navigate(href, {trigger: true});
				return false;
			}
		},
		customerFeedback: function(e){
			window.location = 'http://feedback.madmobile.com/?'+ document.URL;
			return false;
		},
		findStores: function(e){
			this.app.trigger('widgets:spinner',$(e.currentTarget), {overlay:true});
			this.app.trigger('locations:geoLocation');
		},
		clickToCall:function(){
			$(window).trigger('Click to Call');
			return false;
		},
		afterRender:function(){
			this.app.trigger('layout:setIsLoggedIn');
			this.app.trigger('cart:setCount');

			var data = this.model.attributes.resultset,
				form = this.model.actions.emailSignup,
				errors = data.errors;

			form.validateSetup('#email-signup',{
				alertType:{
					type:'inline',
					body:''
				}
			});

		}
	};
});