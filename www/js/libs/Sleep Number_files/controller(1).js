define(['lodash', 'bindings',
	'base/models/generic'
],function(_,bindings){
	//controllers should only be initialized once so we create them before hand
	return {
		globalEvents:{
			'service:process':'process'
		},
		fetchUrl:function(options,url){
			//console.log(url,options);
			var _this = this,
				model = _this.factory.model.create('base/models/generic');
			model.url = '/api/generic?url='+encodeURIComponent(options.path)+'&referrer='+options.referrer.split(options.domain)[1];



			//_this.app.pendingViews++;
			model.fetch({
				success:function(){
					_this.process(model,true);
				}
			});


		},
		/**
		 *
		 * @param model
		 *
		 * when true, if desktop call did a 302 redirect we want to replace the current url (we don't want this if we
		 * just posted a form since we never redirected to the original action in the first place)
		 * @param replaceUrl
		 */
		process:function(model,replaceUrl){
			var _this=this,
				data = model.attributes.resultset,
				template = data && data.template ? data.template : '404',
				//action = bindings[template] || bindings['404'],
				action = bindings[template] || 'modules/'+template.split('.')[0] +'/controller.' + (template.split('.')[1] || 'index'),
				split=action.split('.'),
				currentUrl=this.app.context.path;

			/*console.log(this.app.context.path);
			console.log(data.redirect);
			console.log(this.app.context.path===data.redirect);*/


            if(!this.app.isNode){

                //I need to test the following code and change it to not use history.navigate but other than that it should work


				//I can't remember why this code was here but I think it was trying to make sure we don't replace the url so that
				//the back button works but it was reliant that we are sending a url param like in the generic. Now we pass
				//the replaceUrl param so if that was the case then this is not useful
				/*var modelUrl = decodeURIComponent((model.url.match(/url=([^&]+)/) || [])[1] || '');//this is the model.data.url
                //change the url to whatever url was called by the model fetch
                if(modelUrl && currentUrl!==(modelUrl.indexOf('/')===0 ? modelUrl : '/'+modelUrl)){
                    console.log('changing the url');
                    currentUrl = modelUrl;
                    Backbone.history.navigate(modelUrl);
                }*/

                //if there was a 302 redirect when making the server call we want to change the url on the front end
                if(data.redirect && currentUrl.replace(/(.+)#.+/,'$1')!==data.redirect){//this regex wont strip #tag from a url starting with a # (i did this to be safe but might be better removed)
                    //change the url without firing the router
					//console.log('changing it again');
					if(!replaceUrl){
						//since we are triggering the route that will end up cleaning up our model when the view renderers
						//thus the view won't rerender on model change. We need to temporarily disable the model's autoClose
						var autoClose = model.autoClose;
						model.autoClose = false;
						//manually trigger the route so that bindCleanUp and such things work
						_this.app.trigger('route');
						model.autoClose = autoClose;
					}
                    this.app.navigate(data.redirect,{replace:!!replaceUrl});
                }
            }


			//_this.app.pendingViews--;

			_this.app.dispatch(split[0],split[1],[{model:model}]);
		}
	};
});