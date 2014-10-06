/**
 * This filter is not in the core in case we change the caching id on the cache module so they match when getting bootstrap,
 * data
 */
define([
	'lodash'
],function(_){
	return {
		//scope:'node',

		preFetch:function(options,filterSettings){
			//!options.stop: make sure another filter (the bootstrapData filter) has not already go the data
			//console.log(this.app.config.bootstrapData)
			if(!options.stop && !this.app.isNode && this.app.config.bootstrapData){
				options = options ? _.clone(options) : {};
				var _this = this,
					url = _.isFunction(_this.url) ? _this.url() : _this.url;
				url += JSON.stringify(options.data) || '';

				var data = _this.app.getBootstrapData(url);
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
			return options;
		},
		preParse:function(resp,options,filterSettings){
			if(this.app.isNode && resp && this.app.config.bootstrapData){
				var _this = this,
					url = _.isFunction(_this.url) ? _this.url() : _this.url;
				url += JSON.stringify(options.data) || '';

				//the backend returns an expired data flag to say if data needs to be re-fetched
				if(resp.resultset && !resp.resultset.expiredData){
					_this.app.setBootstrapData(url,resp);
				}

			}


			//console.log('pre parsing');
			//options.stop = true;//enabling this option will stop the success and the parsing of the model to run
			return [resp,options];
		}
	};
});