define([
	'app','./init.common','lodash', 'backbone','config/config', 'spin','jquery'
	//,'bootstrap'
], function   (application, common ,_,Backbone,baseConfig,Spinner) {


	return function(){
		var config = common.getConfig(window.mm_environment,window.mm_siteContext,window.mm_extendFolder),
			app;

		Backbone.ajax = function(options) {
			if(config.apiBaseUrl && options.url.indexOf('http') !== 0 ){
				options.url = (config.apiBaseUrl.replace(/\/$/, "") || "") + "/" + options.url.replace(/^\//, "");
			}
			options.success=options.app.wrapError(options.success);
			return Backbone.$.ajax.apply(Backbone.$, [options]);
		};

		//add error handling
		window.onerror = function (message, url, lineNumber) {
			app.trigger('global:error',{
				message:message,
				stack:url.replace(/.*\//,'')+':'+lineNumber+' '+url,
				lineNumber:lineNumber
			},true);
			return false;
		};


		app = new application({
			common:common,
			config:config,
			isNode:false,
			$:$,
			$document:$('#layout')
		});
		if(config.environment !=='production'){
			window.mm = {};
			window.mm.app = app;
		}
		return app;
	};
});