$(function () {
	app.router = Backbone.Router.extend({
		el: $("#content"),
		routes: {
			'': 'index',
			'/': 'index',
			'!/': 'index',
			'!/login': 'login',
			'!/main': 'main',
			'!/plugins': 'plugins',
			'!/collaborators': 'collaborators'
		},
		initialize: function () {
			//Backbone.history.start();
			app.init();
		},
		index: function () {
			app.preRoute(this.el);
			new IndexView({ el: this.el });
		},
		login: function () {
			app.preRoute(this.el);
			new LoginView({ el: this.el });
		},
		main: function () {
			app.preRoute(this.el);
			new MainView({ el: this.el });
		},
		plugins: function () {
			app.preRoute(this.el);
			new PluginsView({ el: this.el });
		},
		collaborators: function () {
			app.preRoute(this.el);
			new CollaboratorsView({ el: this.el });
		}
	});
	app.router = new app.router();
});