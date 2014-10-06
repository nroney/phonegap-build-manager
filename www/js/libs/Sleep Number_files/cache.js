/*
Look at app/base/filters for examples and docs on how filters work
*/
define(['lodash',
	'core/modules/cache/classes/store'
],function(_){
	return {
		scope:'browser',
		preFetch:function(options,filterSettings){
			//make sure another filter (the bootstrapData filter) has not already go the data
			if(!options.stop){
				options = options ? _.clone(options) : {};
				var _this = this,
					url = _.isFunction(_this.url) ? _this.url() : _this.url,
					//success=options.success,
					store=_this.factory.object.singleton('core/modules/cache/classes/store'),
					cacheRule = filterSettings.templates ? {store:'*'} : filterSettings;

				url += JSON.stringify(options.data) || '';
				//_this.cacheKey = url;

				var data = store.get(url,cacheRule.store);
				if(data){
					data = _this.parse(data);
					_this.attributes=data;
					_this.trigger('change');

					//_this.set(_this.parse(data))
					//$.unblockUI;
					if (options.success) options.success(_this, data);
					options.stop = true;
				}
			}


			//options.stop = true;//enabling this option will stop the fetch method from calling sync
			return options;
		},
		preParse:function(resp,options,filterSettings){
			if(resp){
				var _this = this,
					url = _.isFunction(_this.url) ? _this.url() : _this.url,
					store=_this.factory.object.singleton('core/modules/cache/classes/store'),
					cacheRule = filterSettings;
				if(filterSettings.templates){
					cacheRule = _.find(filterSettings.templates,function(rule,template){
						return template === resp.resultset.template;
					});
				}
				if(cacheRule){
					url += JSON.stringify(options.data) || '';
					store.set(url,resp,cacheRule.store,cacheRule);

				}
			}


			//console.log('pre parsing');
			//options.stop = true;//enabling this option will stop the success and the parsing of the model to run
			return [resp,options];
		},
		onClose:function(){
			//console.log('cleaning up the cache filter... this should not happen');
		}
	};
});