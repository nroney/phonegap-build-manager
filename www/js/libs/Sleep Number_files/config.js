define([
	//include all the environment configurations (only needed for building the js)
	'config/config.localhost',
	'config/config.dev',
	'config/config.staging',
	'config/config.production'
], function () {
	return {
		showErrorStack: true,
		bootstrapData: true,
		throwErrors: true,
		serverSideRendering: false,
		pushstate: true,
		root: '',
		mode: 'release',//dev|debug|release
		//if you need to proxy your requests for debugging (i.e. fiddler put http://127.0.0.1:8888)
		//requestProxy:'http://127.0.0.1:8888',
		analyticsEnabled:true,
		analytics: {
			'google': [
				{
					// MM account
					'owner':'MadMobile',
					'accountNumber': 'UA-27745403-1',
					'prefix': '',
					trackError: true
				}
				/*{
					// client account
					'owner':'SleepNumber',
					'accountNumber': 'UA-123456789-1',
					'prefix': '',
					trackError: false

				}*/
			],
			'brightTag':{
				'owner':'SleepNumber'
			},
			//'gtm':{}
			//'omniture':{},
			'coremetrics':{
				'owner':'SleepNumber'
			}
		}
	};
});
