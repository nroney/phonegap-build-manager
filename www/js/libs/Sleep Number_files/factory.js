define(['lodash', 'backbone','base/controller','base/model','base/view','base/collection','base/object'], function   (_,Backbone,baseController,baseModel,baseView,baseCollection,baseObject) {


	function async(method,args,callback){
		var i = arguments.length,
			_this=this;
		if(!i){
			//if there are no arguements it means that this.async() was called from the "method" so we must return
			//a method so that it can resolve its self
			_this._async=true;
			//this is the only part that can run async so we need to save any "this" context variables locally since
			// they can be changed by another call to this.async
			var async_method = _this._async_method;
			_this._async_method = null;
			return function(){
				//we need to do next tick because if the actual call using done = this.async() runs done() sync
				//then if(!_this._async) will be true because otherwise you might start running other async calls
				//before finishing the current one
				_this.app.nextTick(function(){
					async_method.apply(_this,arguments);
					async_method = null;
				});
			};

		}else{
			//reset async to false
			_this._async=false;
		}

		if(i===2){
			//if there are only to arguments then we passed only method and callback
			callback = args;
			args = [];
		}
		_this._async_method = callback;
		var returnArgs = method.apply(_this,args);
		//if _this._async = true it means that the method called async so we let it resolve on its own
		//if _this._async == false then that means it was not an async method so we call the callback automatically
		if(!_this._async){
			//if we did not return an array then convert to array
			returnArgs = returnArgs instanceof Array ? returnArgs : [returnArgs];
			callback.apply(_this,returnArgs);
		}

	}


	/**
	 * We need to pass in context to the backbone ajax methods so we can add error handling that bubbles to the
	 * request and possibly more.
	 * @param model
	 * @param options
	 * @returns {*}
	 */
	var wrapOptions = function(options){
		options = options || {};
		options.app = this.app;
		return options;
	};
	//methods for the sake of overriding some backbone core methods: (Not True Anymore, I use this for error handling)
	var wrapError = function (model, options) {
		var error = options.error;
		options.error = function(resp) {
			//we either refreshed the page while an ajax call was being made or there are connectivity issues. the former
			//is the most likely scenario so we put a timeout to avoid showing the error if that was the case.
			if(resp.status===0){
				setTimeout(function(){
					options.app.trigger('global:error',['[0] - You might be having connectivity issues']);
				},3000);
				return;
			}
			var errorShown,result,parsed;

			try{
				result = resp.responseJSON ? resp.responseJSON : JSON.parse(resp.responseText);
				parsed = true;

			}catch(e){

			}
			if(resp.status === 403){
				model.attributes=model.parse(result);
				if(options.forbidden){
					options.forbidden(model,result,options);
				}
				options.app.trigger('403',model,result,options);

				return;
			}
			if(parsed && result && result.errors && result.errors.length){
				errorShown = true;
				options.app.trigger('global:error',_.pluck(result.errors, 'message'));
			}
			if(!errorShown){
				options.app.trigger('global:error',['['+resp.status+'] '+resp.statusText+' - '+ resp.responseText]);
			}
			if (error){ error(model, resp, options);}
			model.trigger('error', model, resp, options);
		};
	};




	var coreTemplates = {
		//all factory objects inherit from this
		base:{
			autoClose:true,
			globalEvents:{
				'shutdown':'shutdown',
				//we bind the cleanUp when route triggers
				'route':'bindCleanUp'
			},
			bindCleanUp:function(){
				var _this = this;
				if(_this.autoClose){
					_this.closing = true;//put a param that this view is closing (might be needed on event binds so they don't run for views that are closing)
					_this.listenTo(_this.app,'cleanUp',function(){
						_this.close();
					});
				}
			},
			runFilters: function (action, args, callback) {
				var _this = this;
				if (this.filters) {
					args = args || [];
					var filters = this.filters;
					//this implementation allows both array and object setting of filters, I am leaning to objects, arrays allow
					// multiple filters of the same type but objects allow overriding filters from inherited classes and look nicer
					if (!_.isArray(this.filters)) {
						filters = [];
						_.each(this.filters, function (options, filter) {
							filters.push(_.extend({
								filter: filter
							}, options));
						});
					}
					if(!filters.length){
						callback && callback.apply(_this, args);
						return;
					}


					var i = 0,
						runFilter = function (filteredArgs) {
							//to make code shorter and not duplicate code in else block we call runFilter until this if says there are no filters and stops the recusion
							if (filters[i]) {
								var filter = _this.app.loadSync(filters[i].filter);
								//make sure that this filter is supposed to run if we are in node/browser
								if(filter.scope && (filter.scope ==='node' && !_this.app.isNode || filter.scope ==='browser' && _this.app.isNode)){
									i++;
									runFilter(filteredArgs);
									return;
								}

								var filter_args = _.clone(filteredArgs);
								filter_args.push(filters[i]);
								_this.async.call(_this, filter[action], filter_args, function () {
									//the async call passes as arguments whatever the function returned, if it returned an array it passes each item as a separate properties
									i++;
									//convert the arguments to an array so that it has the push method
									runFilter(Array.prototype.slice.call(arguments, 0));

								});
							}else{
								callback && callback.apply(_this, filteredArgs);
							}
						};
					//start function that runs filters one by one passing output of one as input to the other
					runFilter(args);
				} else {
					callback && callback.apply(_this, args);
				}
			},
			/**
			 * Default close implementation unbinds all events.
			 * DO NOT OVERRIDE UNLESS YOU KNOW WHAT YOU ARE DOING: YOU WILL HAVE MEMORY LEAKS ON THE SERVER
			 */
			close:function(){
				var _this = this;
				_this.off();
				_this.stopListening();
				_this.undelegateGlobalEvents();//remove all global events (stopListening will do that already
				_this.onClose();
			},
			onClose:function(){ },
			/**
			 * The shutdown function gets called when you want to close the whole app, all it is is a wrapper for
			 * close plus adding a onShutdown function call for any custom shutdown code your object needs
			 * (usually the end of a request in node)
			 * @private
			 */
			shutdown:function(){
				var _this=this;
				_this.close();
				_this.onShutdown();
				//debug(this.type+' shutting down');
			},

			onShutdown:function(){}
		},
		view:{
			autoClose:true,
			templateFunctions:{
				//this is really just a passthroug for the renderTemplate of the view
				include:function(template,data){
					return this.view.renderTemplate(template,data);
				}
			},
			initialize:function(options){
				//var _this = this;
				//options.template && (_this.template = options.template);
			},
			loadData:function(){
				var _this = this,
					fetch = _this.options.fetch;
				//fetch = _.isUndefined(this.options.fetch) ? true : this.options.fetch;
				if(_this.collection){
					if(_.isString(_this.collection)){
						_this.collection = _this.app.factory.collection.create(_this.collection);
					}
					//TODO:I dont like what I am doing here, unbinding and binding again
					_this.stopListening(_this.collection,'reset',_this.onModelChange);
					_this.listenTo(_this.collection,'reset',_this.onModelChange);

					//todo:I think it is always an array even if empty so the first check is not needed
					if((_this.collection.models && _this.collection.models.length && fetch !== true )  || fetch===false){
						_this._render();
					}else{
						//backbone collection no longer automatically reset
						_this.collection.fetch({reset:true});
					}
				}else if(!_this.model || _.isUndefined(_this.model.attributes)){
					_this.model = this.app.factory.model.create({},_this.model);
					//we dont need to bind to the model since we just passed a data object to be rendered
					_this.stopListening(_this.model,'change',_this.onModelChange);
					_this.listenTo(_this.model,'change',_this.onModelChange);
					_this._render();
				}else{
					if(_.isString(_this.model)){
						_this.model = _this.app.factory.model.create(_this.model);
					}
					//make sure we are not already listening
					//TODO:I dont like what I am doing here, unbinding and binding again
					_this.stopListening(_this.model,'change',_this.onModelChange);
					_this.listenTo(_this.model,'change',_this.onModelChange);
					if((_this.model.attributes && _.keys(_this.model.attributes).length > 0 && fetch !== true )  || fetch===false){
						_this._render();
					}else{
						_this.model.fetch();
					}
				}
			},
			onModelChange:function(){
				this._render();
			},
			serialize:function(){
				var model = this.collection || this.model,
					data = model.toJSON();
				return data.resultset || data;
			},
			injectTemplate:function(){
				//console.log(this);
				var _this=this,
					template = _this.options.template || _this.template,
					data = _this.serialize();

				var done=_this.async();
				_this.renderTemplate(template,data,function(html){
					_this.$el.html(html);
					done();
				});

			},
			renderTemplate:function(template,data,callback){
				var _this=this,
					templates = (!_this.app.isNode && window.JST) ? JST : _this.app.global.JST,
				//here we check if there is any context specific override template
					tmplFunction = _this.app.siteContext ? (templates[template+'.'+_this.app.siteContext] || templates[template]) : this.app.extensions ? templates['extensions/'+template] || templates[template] : templates[template];

				data = _.extend(
					{
						siteContext:_this.app.siteContext,
						forms:_this.model.actions,
						view:_this//this will give us access to the view inside of the template functions and the template
					},
					_this.templateFunctions,
					data
				);

				if(template && tmplFunction){
					//callback for backwards compatibility in case we want to go back to async, now template loading is sync
					var html = tmplFunction(data);
					callback && callback(html);
					return html;
				}else{
					_this.app.error('Template could not be loaded:'+template);
				}
			},
			beforeRender:function(){ },
			/**
			 * I need to rethink the name of this since it is used in onModelChange
			 * @private
			 */
			_render:function(){
				var _this=this,
					onRender = function(){};
				if(_.isFunction(_this.options.onRender)){
					onRender = _this.options.onRender;
				}
				//I should make the async take an array of methods to do in a row
				_this.async.call(_this,_this.beforeRender,function(){
					_this.async.call(_this,_this.injectTemplate,function(){

						_this.async.call(_this,onRender,function(){
							//the next tick is here so that the actual html is rendered in the browser before we call
							//after render
							_this.app.nextTick(function(){
								_this.async.call(_this,_this.afterRender,function(){

									_this.trigger('rendered');

									//this must be last if we want the previous callbacks to run before the app ends
									_this.app.trigger('view.rendered',_this);
								});

							});
						});
					});
				});
			},
			render:function(){
				var _this=this;
				_this.loadData();
				//_this._render(options);
			},
			afterRender:function(){
				//this.async()();
			},
			/**
			 * The _close event gets called every time the global cleanUp function gets called.
			 * (usually on every request in the front end)
			 * @private
			 */
			close:function(){
				var _this=this;
				//_this.remove();
				_this.off();//remove any callbacks that where listening to view events
				_this.remove();
				//_this.stopListening();//stop listening to any other events (remove does that already)
				if(!_this.app.isNode){
					_this.undelegateEvents();//remove all the events

				}
				_this.undelegateGlobalEvents();//remove all global events (stopListening will do that already
				_this.onClose();
				return false;
			}
		},
		model:{
			preInitialize:function(){
				var _this = this;
				//we might have created the model passing in the data so we need to set the actions
				this.setActions(_this.attributes);
				//since parse only runs when data is from server we also need to update the actions when we are using .set on the model
				this.on('change',function(){
					this.setActions(_this.attributes);
				});
			},
			initialize:function(){

			},
			preParse:function(response,options){
				if(response && _.isObject(response)){
					//fix for backbone to fire change event even if model is the same
					response.timestamp = new Date().getTime();
				}
				return response;
			},
			parse:function(result,options){
				return result;
			},
			setActions:function(data){
				//this.core.setActions.apply(this,arguments);
				var _this = this;
				if(data.resultset && data.resultset.actions){
					this.actions = {};
					_.each(data.resultset.actions,function(options,key){
						_this.actions[key] = _this.app.modules.forms.create(data.resultset.actions[key]);
					});
				}
			},
			destroy: function(options) {
				options = wrapOptions.call(this,options);
				return Backbone.Model.prototype.destroy.call(this,options);
			},
			save: function(key, val, options) {
				options = wrapOptions.call(this,options);
				return Backbone.Model.prototype.save.call(this,key, val, options);
			},
			/*fetch2: function(options) {
			 options = wrapOptions.call(this,options);
			 return Backbone.Model.prototype.fetch.call(this,options);
			 },*/
			fetch: function(options) {
				var _this = this;
				options = wrapOptions.call(this,options);

				options.data = options.data || this.data;
				options= _.extend({
					type:'POST',
					dataType:'json',
					contentType:'application/json; charset=utf-8',
					headers:{ 'Cache-Control': 'no-cache' }
				},options);
				if(options.type.toLowerCase() === 'post'){
					options.data = JSON.stringify(options.data)
				}


				_this.runFilters.call(this,'preFetch',[options],function(filteredOptions){
					options = filteredOptions || options;
				});

				options = options ? _.clone(options) : {};
				if (options.parse === void 0){ options.parse = true;}
				var model = this;
				var success = options.success;

				options.success = function(resp) {
					_this.runFilters.call(model,'preParse',[resp,options],function(filteredResp,filteredOptions){
						options = filteredOptions || options;
						resp = filteredResp || resp;
						if(!options.stop){
							if (!model.set(model.parse(resp, options), options)){ return false;}
							if (success) {success(model, resp, options);}
							model.trigger('sync', model, resp, options);
						}

					});

				};
				wrapError(this, options);
				if(!options.stop){
					return this.sync('read', this, options);
				}

			}
		},
		collection:{
			fetch: function(options) {
				options = wrapOptions.call(this,options);
				return Backbone.Collection.prototype.fetch.call(this,options);
			}/*,
			 fetch:function(options){
			 return Backbone.Collection.prototype.fetch(options);
			 }*/
		},
		controller:{
			autoClose:false,
			authorized:true,
			//this is the default method to call on the controller so that it uses
			//the lifecycle. This should be used by the dispatch method
			run:function(method,args){
				var _this = this,
					action = _this[method] || function(){
						_this.missingAction.call(_this,method,args);
					};

				//call the before method
				_this.isAuthorized(function(allowed){
					if(allowed){
						_this.runFilters.call(_this,'preBefore',[],function(){
							_this.async.call(_this,_this.before,function(){
								//call the controller action
								_this.async.call(_this,action,args,function(){
									//call the after method
									_this.after.call(_this);
									_this.runFilters.call(_this,'postAfter');
								});
							});
						});
					}
				});


			},
			isAuthorized:function(callback){
				if(_.isFunction(this.authorized)){
					this.authorized(callback);
				}else{
					callback(!!this.authorized);
				}
			},
			missingAction:function(method,args){
				var viewPath = this.requirePath.replace(/[^\/]+$/,'') + 'views/'+method;
				if(this.app.moduleExists(viewPath)){
					var view = this.factory.view.create(viewPath,{
						model:(args && args[0]) ? args[0].model : {}
					});
					this.render(view);
				}else{
					this.app.error('View:'+viewPath+' has not been included \nController action "'+method+'" does not exist. \n\n')
				}
			},
			//add default before method
			before:function(){},
			after:function(){},
			render:function(view,layout){
				this.app.renderId++;//we use this to avoid out of sync views being rendered
				var _this = this,
					renderId=this.app.renderId;

				_this.runFilters.call(_this,'preRender',[],function(){
					layout = layout || _.result(view,'layout') || 'default';




					//TODO:I need to find a better way to call the renderLayout (maybe add it to _this.app.js?)
					_this.app.dispatch('modules/layout/controller','renderLayout',[layout,{'onRender':function(){
						var $this = this,//this is not the layout view when we render on currently rendered layout
							done;

						//async might not exist because layout calls onRender manually when it does not need to actually render the view
						if(this.async){
							done = this.async();
						}


						var onRender = view.options.onRender;
						view.controller = _this;
						view.options.onRender = function(){
							//set options.onRender back to the original so this method does not run everytime we call render on the view
							view.options.onRender = onRender;
							//todo: should I put this in the if renderId? also why not put this after adding view to dom so I don't have to do next tick for the afterRender?
							onRender && onRender.call(this);
							if(_this.app.renderId===renderId){
								_this.injectView($this.$el,view,done);


							}else{
								done && done();
							}


						};
						view.render();
					}}]);



				});
			},
			injectView:function($layout,view,done){
				var _this = this;
				//$layout is undefined since view was not passed in from layout controller
				if($layout){
					_this.app.$document.html($layout);
				}
				_this.app.$('#content').html(view.$el);
				_this.runFilters.call(_this,'postRender');
				_this.app.trigger('controller.renderDone',view);
				_this.app.trigger('cleanUp');
				done && done();
			}

		},
		object:{
			initialize:function(options){
				this.options = options;
			}
		}
	};
	/**
	 * We need to pass in the app instance because in node we will have a new app instance created for each request
	 * so using require would not work since that app object would be shared by all clients and requests.
	 */
	return function(app){
		var baseTemplates = {
				view:baseView,
				model:baseModel,
				collection:baseCollection,
				controller:baseController,
				object:baseObject
			},
			factory;


		/**
		 * This function does all the common factory code shared by all types
		 * @param type (controller|view|model|collection)
		 * @param objTemplate
		 */
		function create(type,objTemplate,options){
			//console.log(coreTemplates);
			//objTemplate = _.extend({},coreTemplates.base,baseTemplates[type]);
			var core = coreTemplates[type],
				base = baseTemplates[type],
				obj = _.extend({},coreTemplates.base,core,base,objTemplate);//for controllers I wanted to add Backbone.Events
			obj.options = options;//this is because backbone 1.1 stopped saving options automatically so we do it manually
			obj.$ = app.$;
			obj.type = type;
			obj.core = core;
			obj.base = base;
			obj.app = app;
			obj.async = async;
			obj.factory = app.factory;
			//merge globalEvents and events from all three (note that the core overwrites the core.base events if it is defined and not merged);
			obj.globalEvents = _.extend({}, core.globalEvents || coreTemplates.base.globalEvents || {} ,base.globalEvents || {},objTemplate.globalEvents || {});

			obj.filters = _.extend({}, core.filters || coreTemplates.base.filters || {} ,base.filters || {},objTemplate.filters || {});
			//obj.filters = [].concat(core.filters || coreTemplates.base.filters || [], base.filters || [], objTemplate.filters || []);

			//app.addGlobalHandler.call(obj); //
			return obj;
		}
		function cacheObject(type,template,cache,instance){
			var key;
			//todo:clean this code up a bit
			if(!cache){
				return false;
			}
			if(_.isString(cache)){
				key=cache;
			}
			if(cache===true){
				if(_.isString(template)){
					key=template;
				}else if(template.moduleName){
					key=template.moduleName;
				}else{
					app.error('You must define a moduleName to be used for a cache key');
					return false;
				}
			}
			factory.cache[type][key]=instance;

		}


		factory = {

			/**
			 * I can use the standard view but I need to override the _ensureElement && setElement methods so that it works
			 * in node.js
			 */
			view:{
				create:function(viewTemplate,options,cache){
					var originalTemplate = viewTemplate;//used for saving cacheObject since we change modelTemplate to object

					options = options || {};
					viewTemplate = app.loadSync(viewTemplate);
					//we need to add the number of views pending so that node will know when all views have rendered so that
					//it can return the response with the rendered views
					if(!options.noPending){
						app.pendingViews++;
					}

					//if viewFile is string it means it is the module name
					var view = create('view',viewTemplate,options);

					view.events = _.extend({},coreTemplates.view.events || {},baseView.events || {},viewTemplate.events || {});
					view.templateFunctions = _.extend({},coreTemplates.view.templateFunctions || {},baseView.templateFunctions || {},viewTemplate.templateFunctions || {});
					//remove any events if we are in node
					if(app.isNode){
						view.events = null;
					}
					var viewClass = function(options){
						//we need to set the Backbone.$ every time there is a view being created otherwise Backbone.$
						//might be the cheerio object from another request.
						Backbone.$ = app.$;
						var viewInstance = new (Backbone.View.extend(view))(options || {});
						app.addGlobalHandler.call(viewInstance);
						//todo:lodash has a problem with extending the this so we can't use lodash until I add extends from underscore or find another solution
						//_.extend(this,viewInstance);
						return viewInstance;
					};
					if(options.returnClass){
						return viewClass;
					}else{
						var instance = new viewClass(options);
						cacheObject('views',originalTemplate,cache,instance);
						return instance;
					}
					//return options.returnClass ? viewClass : new viewClass(options);
				},
				get:function(key){
					return factory.cache.views[key];
				},
				/**
				 * the singleton will return from cache if it exists or create a new one
				 */
				singleton:function(viewTemplate,options){
					return this.get(viewTemplate) || this.create(viewTemplate,options,true);
				},
				destroy:function(key){
					if(factory.cache.views[key]){
						factory.cache.views[key].close();
						factory.cache.views[key]=null;
					}
				}
			},
			collection:{
				create:function(collectionTemplate,models,options,cache){

					var originalTemplate = collectionTemplate;//used for saving cacheObject since we change modelTemplate to object

					options = options || {};
					collectionTemplate = app.loadSync(collectionTemplate);

					var model = collectionTemplate.model;
					if(model && !_.isFunction(model)){
						collectionTemplate.model = factory.model.create(model,null,{class:true});
					}

					var collection = create('collection',collectionTemplate,options),
						collectionClass = function(data,options){
							var collectionInstance = new (Backbone.Collection.extend(collection))(models,options || {});
							app.addGlobalHandler.call(collectionInstance);

							return collectionInstance;

						};

					if(options.returnClass){
						return collectionClass;
					}else{
						var instance = new collectionClass(models,options);
						cacheObject('collections',originalTemplate,cache,instance);
						return instance;
					}
				},
				get:function(key){
					return factory.cache.collections[key];
				},
				/**
				 * the singleton will return from cache if it exists or create a new one
				 */
				singleton:function(collectionTemplate,models,options){
					return this.get(collectionTemplate) || this.create(collectionTemplate,models,options,true);
				},
				destroy:function(key){
					if(factory.cache.collections[key]){
						factory.cache.collections[key].close();
						factory.cache.collections[key]=null;
					}
				}
			},
			model:{
				//IF I CHANGE SIGNATURE REMEMBER TO CHANGE VIEW ALSO!!!
				create:function(modelTemplate,data,options,cache){
					var originalTemplate = modelTemplate;//used for saving cacheObject since we change modelTemplate to object
					options = options || {};
					modelTemplate = app.loadSync(modelTemplate);


					var model = create('model',modelTemplate,options),
						modelClass = function(data,options){
							//add preInitialize method
							var initialize = model.initialize;
							model.initialize = function(){
								this.preInitialize.apply(this,arguments);
								return initialize.apply(this,arguments);
							};
							//add preParse method
							var parse = model.parse;
							model.parse = function(response, options){
								return parse.call(this,this.preParse(response, options),options);
							};
							var modelInstance = new (Backbone.Model.extend(model))(data,options || {});
							app.addGlobalHandler.call(modelInstance);


							return modelInstance;
						};
					if(options.returnClass){
						return modelClass;
					}else{
						var instance = new modelClass(data,options);
						cacheObject('models',originalTemplate,cache,instance);
						return instance;
					}
				},
				get:function(key){
					return factory.cache.models[key];
				},
				/**
				 * the singleton will return from cache if it exists or create a new one
				 */
				singleton:function(modelTemplate,data,options){
					return this.get(modelTemplate) || this.create(modelTemplate,data,options,true);
				},
				destroy:function(key){
					if (factory.cache.models[key]) {
						factory.cache.models[key].close();
						factory.cache.models[key] = null;
					}
				}
			},
			controller:{

				create:function(controllerTemplate){
					//make sure if we already have an instace of this controller that we return it instead of creating a new one
					var controller = factory.cache.controllers[controllerTemplate];
					if(controller){
						return controller;
					}
					var originalTemplate = controllerTemplate;//used for saving cacheObject since we change controllerTemplate to object
					//factory.cache.models[key]

					controllerTemplate = app.loadSync(controllerTemplate);
					controller = create('controller',_.extend({},controllerTemplate,Backbone.Events));
					app.addGlobalHandler.call(controller);
					cacheObject('controllers',originalTemplate,true,controller);
					return controller;

				},
				get:function(key){
					return factory.cache.controllers[key];
				},
				destroy:function(key){
					if (factory.cache.controllers[key]) {
						factory.cache.controllers[key].close();
						factory.cache.controllers[key] = null;
					}
				}
			},
			object:{
				create:function(objectTemplate,options,cache){
					var originalTemplate = objectTemplate;//used for saving cacheObject since we change modelTemplate to object
					options = options || {};
					objectTemplate = app.loadSync(objectTemplate);

					var myObject = create('object',_.extend({},objectTemplate,Backbone.Events),options);
					app.addGlobalHandler.call(myObject);
					cacheObject('objects',originalTemplate,cache,myObject);

					myObject.initialize(options);
					return myObject;
				},
				get:function(key){
					return factory.cache.objects[key];
				},
				/**
				 * the singleton will return from cache if it exists or create a new one
				 */
				singleton:function(objectTemplate,options){
					return this.get(objectTemplate) || this.create(objectTemplate,options,true);
				},
				destroy:function(key){
					if (factory.cache.objects[key]) {
						factory.cache.objects[key].close();
						factory.cache.objects[key] = null;
					}
				}
			}
		};
		return factory;
	};
});