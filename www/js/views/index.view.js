IndexView = Backbone.View.extend({
	events: {},
	initialize: function () {
		var that = this;
		that.render();
		that.afterRender();

		app.loadMenuHeader();
		new FooterView();
	},
	render: function () {
		_.templateSettings.variable = "rc";

		var template = _.template(
			$("script.tmpl-index").html()
		);

		$("#content").html(
			template()
		);
	},
	afterRender: function () {
		$('.left-nav').hide();
	}
});