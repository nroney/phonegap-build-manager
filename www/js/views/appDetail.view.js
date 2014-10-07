AppDetailView = Backbone.View.extend({
	el: 'detail',
	events: {},

	initialize: function () {
		//app.preRoute(this.$el);
		this.render();
	},

	render: function () {
		var lHtml = $('#tmpl-footer').tmpl();
		this.$el.html(lHtml);
	}

});
