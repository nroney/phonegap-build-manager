define(['lodash'], function(_) {
	return {
		template: 'modules/static/templates/lpMemoryFoam',
		globalEvents: {},
		events: {
			'click .toggle-landaccord': 'toggleLandaccord'
		},
		toggleLandaccord: function(e) {
			var $link = $(e.currentTarget);

			$link.find('.icon').toggleClass('plus');
			$link.next('.landaccord-container').toggle();
			return false;
		},
		afterRender: function() {

		}
	};
});
