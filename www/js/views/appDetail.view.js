AppDetailView = Backbone.View.extend({
	el: 'detail',
	events: {},

	initialize: function () {
		//app.preRoute(this.$el);
		this.render();
	},

	render: function () {

		var template = _.template(
			$( "script.tmpl-index" ).html()
		);

		$("header").html(
			template()
		);
	}

});
