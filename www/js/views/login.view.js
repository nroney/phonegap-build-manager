LoginView = Backbone.View.extend({
	el: 'body',
	events: {
		'click .login-button': 'login'

	},

	initialize: function () {
		var _this = this;

		_this.render();
		app.afterRender();
		_this.afterRender();

		app.loadNavHeader();
	},

	login: function(e){
		var username = $('#loginUsername').val(),
			password = $('#loginPassword').val();

		app.router.navigate("!/main", {trigger: true});
		return false;
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

