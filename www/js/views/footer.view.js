FooterView = Backbone.View.extend({
	el: 'footer',
	events: {},
	initialize: function () {
		app.preRoute(this.$el);
		this.render();
	},
	render: function () {
		var template = _.template(
			$("script.tmpl-footer").html()
		);

		$("header").html(
			template()
		);
	}
});