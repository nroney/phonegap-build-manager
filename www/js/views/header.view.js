HeaderView = Backbone.View.extend({
	el: $("header"),
	events: {
		'click #menuToggle': 'menuToggle'
	},
	initialize: function () {
		this.render();
	},
	render: function () {
		var template = _.template(
			$("script.tmpl-header").html()
		);

		$("header").html(
			template()
		);
	},
	menuToggle: function (aEvent) {
		app.menuToggle(aEvent);
		return false;
	}
});