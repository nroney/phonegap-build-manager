CollaboratorsView = Backbone.View.extend({
	el: 'body',
	events: {},

	initialize: function () {
		//app.preRoute(this.$el);
		this.render();
		new HeaderNavView();
	},

	render: function () {

		var template = _.template(
			$("script.tmpl-collaborators").html()
		);


		$("#content").html(
			template()
		);
	}

});