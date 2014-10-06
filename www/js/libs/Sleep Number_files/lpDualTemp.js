define(['lodash'], function(_) {
	return {
		template: 'modules/static/templates/lpDualTemp',
		globalEvents: {},
		events: {},
		afterRender: function() {
			if(!this.app.isNode){
				$(window).trigger('Dual Temp Landing Page');
			}
		}
	};
});
