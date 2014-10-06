/**
 * How to use:
 * under classes you have a class for each type such as google, omniture ...
 * to trigger an event you would do the following:
 * this.app.trigger('analytics','myCustomEvent',optionalParam1, optionalParam2, ...)
 * if your analytics class has a method called myCustomerEvent that method will fire
 * once for every account of that type. Accounts are set up in the configuration file:

 	analytics:{
		//multi account example
		google:[
			{
				accountNumber:'UA-1111111-1',
				pageView:false//if there is an event pageView it will not run for this account
			},
			{
				accountNumber:'UA-1111111-1',
				trackError:false//if there is an event trackError it will not run for this account
			}
		],
		//single account example
		omniture:{
			account:'xxxxxx',
			option1:'...'
		}
	},

 * In the above example google has 2 accounts setUp for it meaning events will run once for each account.
 * If you have the events method name with a value of false in the config that event will not fire for that
 * account. For example you might want to fire a trackError on madmobiles account but not the customers.
 * The settings for the specific account are passed into the event method everytime it is called so that there
 * is context
 */
define([
	'lodash',
	'modules/analytics/classes/google',
	'modules/analytics/classes/brightTag',
	'modules/analytics/classes/coremetrics'
],function(_){
	//controllers should only be initialized once so we create them before hand
	return {
		globalEvents:{
			'controller.renderDone':'pageView',
			'global:error':'error',
			//'route':'pageView',
			'analytics':'runFunction'
		},
		error:function(error){
			error = _.isArray(error) ? {message:error.join()} : error;
			this.runFunction('trackError',{
				message:error.message,
				//stack:error.stack,
				lineNumber:error.lineNumber
			});
		},
		pageView:function(view){
			var _this = this;
			//load any analytics script that need to be loaded without any events firing (set preLoadScript:true in analytics class for this to work)
			if(!this.scriptsLoaded){
				this.scriptsLoaded = true;
				_.each(this.app.config.analytics, function(config, provider){
					var analyticsHandler = _this.app.factory.object.singleton('modules/analytics/classes/' + provider, config);
					if(analyticsHandler.preLoadScript){
						_this.app.modules.util.onScriptLoaded(analyticsHandler.src);
					}
				});

			}
			this.runFunction('pageView', view);
		},
		filters:{},

		/**
		 * You should not need to edit this function.
		 * @param method
		 */
		runFunction: function (method) {
			if (this.app.isNode || !this.app.config.analyticsEnabled) {
				return;
			}
			var _this = this,
				args = Array.prototype.slice.call(arguments, 1);

			//todo:test afterScriptLoad

			_.each(this.app.config.analytics, function (config, provider) {
				var analyticsHandler = _this.app.factory.object.singleton('modules/analytics/classes/' + provider, config);
				_this.app.modules.util.onScriptLoaded(analyticsHandler.src, function () {
					if(analyticsHandler.afterScriptLoaded && !analyticsHandler.afterScriptLoadedRan){
						analyticsHandler.afterScriptLoadedRan = true;
						analyticsHandler.afterScriptLoaded();
					}
					if (analyticsHandler[method]) {
						config = _.isArray(config) ? config : [config];
						_.each(config, function (settings) {
							if (settings[method] !== false) {
								var clonedArgs = _.clone(args);
								clonedArgs.unshift(settings);

								analyticsHandler[method].apply(analyticsHandler, clonedArgs);

							}
						});
					}
				});
			});
		}

	};
});