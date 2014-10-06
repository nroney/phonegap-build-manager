requirejs.config({
	config: {
		text: {
			//Valid values are 'node', 'xhr', or 'rhino'
			env: 'xhr'
		}
	},
	//Pass the top-level main.js/index.js require
	//function to requirejs so that node modules
	//are loaded relative to the top-level JS file.
	baseUrl:'/app',
	paths: {
		'text': 'vendors/require_text',
		'config':'../config',
		'core':'../core',
		'app': '../core/app',
		'factory':'../core/factory',
		jquery: 'vendors/jquery',
		spin: 'vendors/spin',
		lodash: 'vendors/lodash',
		backbone: '../core/vendors/backbone',
		'liveperson': 'vendors/liveperson',
		'liveperson-client': 'vendors/liveperson-client'
	},
	shim: {
		backbone: {
			deps: ['lodash', 'jquery'],
			exports: 'Backbone'
		},
		spin: {
			deps: ['jquery']
		},
		lodash: {
			exports: '_'
		}
	}
});
requirejs([
	'core/init.browser',
	'spin','jquery'
	//,'bootstrap'
], function   (init,Spinner) {
	window.Spinner = Spinner;
	init();

});