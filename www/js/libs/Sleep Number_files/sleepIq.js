define(['lodash'], function(_) {
	return {
		template: 'modules/static/templates/sleepIq',
		globalEvents: {},
		events: {},
		afterRender: function() {
			if(!this.app.isNode){
				$(window).trigger('SleepIQ Landing Page');
			}
		}
	};
});
