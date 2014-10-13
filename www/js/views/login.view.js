LoginView = Backbone.View.extend({
	el: 'body',
	events: {
		'click p': 'goto'
	},

	initialize: function () {
		var _this = this;

		_this.render();
		app.afterRender();
		_this.afterRender();

		app.loadNavHeader();
	},

	testLoader: function (e) {
		app.showLoader(e);
	},
	render: function () {

		var template = _.template(
			$( "script.tmpl-login" ).html()
		);

		$("#content").html(
			template()
		);
	},
	afterRender: function () {
		app.changePageTitle('Login');
	}
});

