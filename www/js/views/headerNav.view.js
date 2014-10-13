HeaderNavView = Backbone.View.extend({
    el: $("header"),

    events: {
        'click .left-nav': 'leftNavAction'
    },

    initialize: function () {
        this.render();
    },

    leftNavAction: function(){
        app.router.navigate("/", {trigger: true});
    },

    render: function () {

		var template = _.template(
			$( "script.tmpl-header-nav" ).html()
		);

		$(".header-shadow").html(
			template()
		);

    }

});