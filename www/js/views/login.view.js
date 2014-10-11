LoginView = Backbone.View.extend({

	events: {
		'click p': 'goto'
	},

	initialize: function () {
		var that = this;

		that.render();
		app.afterRender();
		that.afterRender();

		/*GlobalModel('privacypolicy', function (model) {
		 that.render(model);
		 app.afterRender({linkifyPhone: true});
		 });*/
		app.loadNavHeader();
	},

	testLoader: function (e) {
		app.showLoader(e);
	},
	render: function (aModel) {
		var lHtml = $('#tmpl-login').tmpl();

		this.$el.html(lHtml);
	},
	afterRender: function () {
		app.changePageTitle('Login');
	}
});

