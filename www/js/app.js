window.app = {

	isAdmin: true,
	apiUrl: 'http://108.59.252.244/mad/phonegap/',

    changePageTitle: function (aTitle){
        $('#pageTitle').text(aTitle);
    },

    preRoute: function (el) {
        el.unbind().empty().removeClass().off();
    },

    init: function () {
		$.post( "https://build.phonegap.com/authorize?client_id=ce8daa0c49693d07b863&client_secret=1c3b3631bade86c934ad7db10c5c95788ad1fa74&auth_token=DHauvSSjysJMs5jza-iQ", function( data ) {
			localStorage.setItem('accessToken', data.access_token);
		});

            Backbone.history.start();
            app.ready();
    },

    loadMenuHeader: function () {
        new HeaderView();
    },

    loadNavHeader: function () {
        new HeaderNavView();
    },

    hideLoader: function(aElement){
       var $el = $(aElement.currentTarget);
       $el.find('span').removeClass('ios-loader');
    },

    afterRender: function (aOptions) { 
        // only show footer on index view
        $('.left-nav').hide();

        if (Backbone.history.fragment.length) {
            $('footer').empty();
            $('header').empty();
        }
    },

    ready: function() {

    },

    menuToggle: function () {
    var lSpeed = 200,
        lMenuWidth = 248,
        lMenu = $('menu'),
        lInner = $('#inner'),
        lToggler = $('#menuToggle'),
        lFixedElements = $('header, footer');

    if (lMenu.hasClass('open')) {

        lToggler.removeClass('active');

        lMenu.removeClass('open').animate({
            'left': '-' + lMenuWidth + 'px'
        }, lSpeed);

        lInner.animate({
            'margin-left': 0
        }, lSpeed);

        lFixedElements.animate({
            'left': 0
        }, lSpeed);

    } else {

        lToggler.addClass('active');

        lMenu.addClass('open').animate({
            'left': 0,
            'height': $(document).height()
        }, lSpeed);

        lInner.animate({
            'margin-left': lMenuWidth + 'px'
        }, lSpeed);

        lFixedElements.animate({
            'left': lMenuWidth + 'px'
        }, lSpeed);
    }
    },
    resize: function (aCallback) {
        var resizeTimeoutId = null;

        $(window).resize(resizeCallback);

        function resizeCallback() {
            if (resizeTimeoutId) {
                window.clearTimeout(resizeTimeoutId);
            }
            resizeTimeoutId = window.setTimeout(resizeAction, 250);
        }
        function resizeAction() {
            //console.log($(window).width(), $(window).height())
            callback();
        }
    },


};