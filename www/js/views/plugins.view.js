PluginsView = Backbone.View.extend({
	el: 'body',
	events: {},

	initialize: function () {
		//app.preRoute(this.$el);
		var _this = this;
		this.render();

		GlobalModel('getPlugins.php?appId='+localStorage.selectedAppId+'&access_token='+localStorage.accessToken, function (model) {
			_this.render(model);
			app.afterRender();
		});
		new HeaderNavView();
	},

	render: function () {
		var template = _.template(
			$("script.tmpl-plugins").html()
		);
		$("#content").html(template());
	}

});