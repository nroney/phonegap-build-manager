define(['lodash'], function(_) {
	return {
		template: 'modules/static/templates/privacyPolicy',
		globalEvents: {},
		events: {
			'click a': 'handleLinks'
		},
		handleLinks: function(e) {
			var $link = $(e.currentTarget);
			var $href = $link.attr('href');

			if ($href === '#' || $href === undefined || $href === false) {
				return false;
			}
		},
		afterRender: function() {

		}
	};
});
