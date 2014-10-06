window.app = {

    changePageTitle: function (aTitle){
        $('#pageTitle').text(aTitle);
    },

    preRoute: function (el) {
        el.unbind().empty().removeClass().off();
    },

    init: function () {
		$.post( "https://build.phonegap.com/authorize?client_id=ce8daa0c49693d07b863&client_secret=1c3b3631bade86c934ad7db10c5c95788ad1fa74&auth_token=DHauvSSjysJMs5jza-iQ", function( data ) {
			localStorage.accessToken = data.access_token;
			//alert(app.accessToken);
		});

            Backbone.history.start();
            app.ready();

    },

    loadMenuHeader: function () {
        new HeaderView();
        new MenuView();
    },

    loadNavHeader: function () {
        new HeaderNavView();
    },

    /*showLoader: function(e){
       var $el = $(e.currentTarget);
       $el.find('span').addClass('ios-loader');
    },*/

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
            app.checkConnection();
            document.addEventListener("resume", reLoginOnResume, false);        
            document.addEventListener("resume", startLocationWatch, false);
            document.addEventListener("pause", clearLocationWatch, false);
    },

    getGeoPositionLatLon: function (){
        var lGeoCoords  = {};
        navigator.geolocation.getCurrentPosition(function(position){
                lGeoCoords.latitude = position.latitude;
                lGeoCoords.longitude = position.longitude; 
        },
         function(){
            lGeoCoords.latitude = 0;
            lGeoCoords.longitude = 0; 
         },
        { enableHighAccuracy: true });

        return lGeoCoords;
    },
   showDialog: function (aTitle, aText, aDissmissText){

    navigator.notification.alert(
    aText,  // message
    alertDismissed,         // callback
    aTitle,            // title
    (aDissmissText || 'Ok')                  // buttonName
    );

},
   analyticEvent: function (aEvent){
        window.plugins.flurry.logEvent(aEvent);
},

   getCityState: function () {
        var lCity,
            lState;
    $.getJSON(
              "http://nominatim.openstreetmap.org/reverse?format=json&lat="+gLatitude.toFixed(3)+"&lon="+gLongitude.toFixed(3)+"",
              function(data) {
                lCity = data.address.city;
                lState = data.address.state;
              
              });
    return {'city': lCity, 'state': lState};
},

checkConnection: function(){
    var lNetworkState = navigator.connection.type,
        lStates = {};

    lStates[Connection.UNKNOWN] = 'Unknown connection';
    lStates[Connection.ETHERNET] = 'Ethernet connection';
    lStates[Connection.WIFI] = 'WiFi connection';
    lStates[Connection.CELL_2G] = 'Cell 2G connection';
    lStates[Connection.CELL_3G] = 'Cell 3G connection';
    lStates[Connection.CELL_4G] = 'Cell 4G connection';
    lStates[Connection.NONE] = 'No network connection';
    var lConnectState = lStates[lNetworkState];
    if (lConnectState === 'Unknown connection' || lConnectState === 'No network connection') {
        app.showDialog('Network Error!', 'Finsight is having trouble connecting to the network.', 'Ok');
    }
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
   /* goto: function (aView, aElement) {


    aElement.unbind().empty().removeClass().off();

    var previous = this.currentPage || null;
    var next = aView;

    if (previous) {
      next.transitionOut(function () {
        previous.remove();
      });
    }

    next.render({ page: true });
    this.$el.append( next.$el );
    next.transitionIn();
    this.currentPage = next;

  },*/
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