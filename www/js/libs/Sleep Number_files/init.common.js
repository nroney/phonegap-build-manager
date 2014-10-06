define([
	'require','lodash','config/config'
],
	function   (require, _, baseConfig) {


		return {
			getConfig:function(environment,siteContext,extendFolder){
				var extendBaseConfig,
					environmentConfig = environment ? require('config/config.'+environment) : {},
					extendEnvironmentConfig;

				if(siteContext){
					var contextBaseConfigPath = 'config/config.'+siteContext;
					if(this.moduleExists(contextBaseConfigPath) ){
						extendBaseConfig = require(contextBaseConfigPath);
					}

					if(environment){
						var contextEnvironmentConfigPath = 'config/config.'+environment + '.'+siteContext;
						if(this.moduleExists(contextEnvironmentConfigPath)){
							extendEnvironmentConfig = require(contextEnvironmentConfigPath);
						}
					}
				}
				if(extendFolder){
					var extensionBaseConfigPath = 'extensions/config/config';
					if(this.moduleExists(extensionBaseConfigPath) ){
						extendBaseConfig = require(extensionBaseConfigPath);
					}

					if(environment){
						var extensionEnvironmentConfigPath = 'extensions/config/config.'+environment;
						if(this.moduleExists(extensionEnvironmentConfigPath)){
							extendEnvironmentConfig = require(extensionEnvironmentConfigPath);
						}
					}
				}



				var config = _.extend({},baseConfig,extendBaseConfig,environmentConfig,extendEnvironmentConfig);
				config.environment=environment;
				config.siteContext=siteContext;
				config.extensions = extendFolder;
				return config;
			},
			moduleExists:function(path){
				return !!(require && require.defined ? require.defined(path) : (!this.isNode && requirejs && requirejs._defined) ? requirejs._defined[path] : 0)
			}
		};
	});