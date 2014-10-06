define(['lodash'], function(_) {
	return {
		template: 'modules/static/templates/lpBeds',
		globalEvents: {},
		events: {
			'click .toggleContent': 'toggleContent'
		},
		toggleContent: function(e) {
			var $link = $(e.currentTarget);

			$link.toggleClass('active');
			$link.parent().next('.bed-info-expanded').toggle();
			return false;
		},
		afterRender: function() {

		}
	};
});
