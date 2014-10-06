define(['require', 'lodash', 'backbone', 'factory', 'bootstrap', 'routes'
	//core modules that need to be included for the build process
], function (require, _, Backbone, factory, bootstrap, routes) {

	var app = function (options) {
		var _this = this;
		_this.global = options.global || {};
		//_this.global = {};
		_this.config = options.config;
		_this.isNode = options.isNode;
		_this.$ = options.$;
		_this.$document = options.$document;
		_this.server = options.server;
		_this.siteContext = options.config.siteContext;
		_this.extensions = options.config.extensions;

		_this.moduleExists = options.common.moduleExists;


		_this.routes = _this.loadSync('routes');

		if (_this.isNode) {
			//initialize  the cookieManager by passing the app object
			_this.server.cookieManager = _this.server.cookieManager(_this);
		}else{
			//calculate what type of device we have
			this.setDevice();
		}
		_this.firstRoute = true;

		_this.addGlobalHandler(_this);
		_this.factory = factory(_this);
		//any property that is not a primitive and stores state must be initialized in the constructor
		_this.loadedControllers = {};

		_this.factory.cache = {
			objects: {},
			views: {},
			collections: {},
			controllers: {},
			models: {}
		};
		this.context = {};


		this.wrapError(function () {
			bootstrap(_this, function () {
				//_this.server.response.end(_this.$.html());return;
				//pass in the url if we are in node
				_this.route(_this.isNode ? _this.server.request.url : null);
			});
		})();

	};
	_.extend(app.prototype, Backbone.Events, {
		isNode: false,
		pendingViews: 0,
		renderId: 0,
		setDevice:function(){
			var _this = this,
				w = $(window).width(),
				h = $(window).height(),
				device;
			//nexus -   360x519 || 598x287
			//phablet - 600x837 || 1024x413
			//ipad -    768x900 || 1024x644 (this is with bookmarks bar add 28px for without)

			if(w < 768 && h <768){
				_this.device = 'phone';
			}else if(w < 601 || h<601){
				_this.device = 'phablet';
			}else{
				_this.device = 'tablet';
			}
			return this.device;
		},
		clone: function (data) {
			if (!data) {
				return data;
			}
			return JSON.parse(JSON.stringify(data));
		},
		nextTick: function (callback) {
			setTimeout(this.wrapError(function () {
				callback && callback();
			}), 1);
		},
		globalEvents: {
			'view.rendered': 'pendingViewsHandler',
			'shutdown': '_shutdown'
		},
		navigate: function (url, options,force) {
			//when we are not triggering a route we need to make sure that the context is changed

			if (this.isNode) {
				if (options && (options === true || options.trigger)) {
					//even though Backbone is out of context it works since node is single threaded so this will trigger only for the current event loop which is this context
					Backbone.history.loadUrl(url);
				}
			} else {
				if(force && this.context.path === url){
					Backbone.history.loadUrl(url);
					return;
				}
				this.router.navigate(url, options);
			}
			if(!options || !options.trigger){
				this.setContext();
			}
		},
		setContext:function(){
			var _this = this,
				loc = Backbone.history.location,
				//path = loc ? (_this.config.pushstate ? loc.pathname + loc.search : loc.hash.replace(/^#/, '')) : Backbone.history.fragment,
				path = (_this.config.pushstate || _this.isNode) ? Backbone.history.fragment : loc.hash.replace(/^#/, ''),
				qs = path.split('?')[1],
				routeOptions = {
					domain:_this.isNode ? this.server.request.headers.host : location.host,
					protocol: _this.isNode ? 'http:' : location.protocol,
					referrer: !_this.isNode ? ((_this.context.path ? location.protocol + "//" + location.host + _this.context.path : null) || document.referrer) : '',
					path: '/' + path.replace(/^\//, ''),
					params: {}
				};
			routeOptions.url = routeOptions.protocol + '//' + routeOptions.domain + routeOptions.path;
			if (qs) {
				var params = qs.split('&');
				for (var i = 0; i < params.length; i++) {
					var pair = params[i].split('=');
					routeOptions.params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
				}
			}
			_this.context = routeOptions;
			return routeOptions;
		},
		// TODO: Make sure to not rebind the onRoute;
		route: function (url) {
			var _this = this,
				router = Backbone.Router.extend({
					routes: _this.routes
				});

			_this.router = new router();
			var noRouteFound = true;
			//I can use this alternatively
			_this.router.on('route', function (method, args) {
				if(method.indexOf('route:')===0){
					var url = method.replace('route:','');
					if(url.indexOf('http')===0){
						noRouteFound = false;
						if(_this.isNode){
							//Backbone.history.loadUrl('/');return;
							_this.server.response.writeHead(302, {
								'Location': url
							});
							_this.server.response.end();
						}else{
							window.location = url;
						}
					}else{
						Backbone.history.loadUrl(url);
					}
					return;
				}
				noRouteFound = false;
				var parts = method.split('.'),
					context = _this.setContext();
				//save context in the app object so it can be accessed globally


				//trigger the global cleanup event
				_this.trigger('route');

				_this.dispatch(parts[0], parts[1], [context].concat(args));
				_this.firstRoute = false;


				if (_this.isNode) {
					//I need to clean up the router right away becuase if I do that at shutdown I could be removing it
					// for another request since it is shared by all requests.
					Backbone.history.handlers = [];
					_this.router.off();//remove even binds on the router
				}

			});
			//app.shutdown();
			if (_this.isNode) {
				Backbone.history.loadUrl(url);
			} else {
				Backbone.history.start({
					pushState: _this.config.pushstate,
					root: _this.config.root
				});


			}


			//this will not be relevant if I have a catch all 404 or service route so I can remove this
			if (noRouteFound) {
				if (this.isNode) {
					_this.$('#layout').append("<h1>404 page not found.</h1><p>The url: <strong>" + _this.server.request.url + "</strong> did not match any of your routes.</p>");
					_this.pendingViewsHandler();
				} else {
					this.error('Your request did not match any routes');
				}
			}
		},
		pendingViewsHandler: function (view) {
			this.pendingRan = true;
			var _this = this;
			if (view && !view.options.noPending) {
				_this.pendingViews--;
			}
			//console.log('reducing a view')
			//not sure if I should put under if statement
			//if there are no pending views we can
			if (_this.pendingViews === 0 && _this.isNode) {
				if (this.bootStrapData) {
					//using .text will encode the string correctly
					_this.$('#bootstrapData').text(JSON.stringify(this.bootStrapData));
					//_this.$('#bootstrapData').html('var mm_bootstrap_data = '+this.escapedStringify(this.bootStrapData,true));
				}

				_this.end(_this.$.html());
				_this.server.response.end();
				_this.shutdown();
			}


		},
		setBootstrapData: function (key, value) {
			this.bootStrapData = this.bootStrapData || {};
			this.bootStrapData[key] = value;
		},
		getBootstrapData: function (key) {

			try {
				this.bootStrapData = this.bootStrapData || (JSON.parse(this.$('#bootstrapData').text() || '{}') || {});
			} catch (e) {
				this.bootStrapData = {};
			}
			//this.bootStrapData = this.bootStrapData || (mm_bootstrap_data || {});
			//console.log(this.bootStrapData);
			var data = this.bootStrapData[key];
			delete this.bootStrapData[key];
			return data;
		},
		/**
		 * Pause and resume allow you to do async work will ensuring that node side will
		 */
		pause: function () {
			this.pendingViews++;
		},
		resume: function () {
			this.pendingViews--;
			//we don't want to run pendingViewsHandler if it has never ran before since we might close prematurely
			//the point of pause was to prevent responding to the request but if that never tried to occur we don't want to run it
			if (this.pendingRan) {
				this.pendingViewsHandler();
			}
		},
		/**
		 * this function takes an object or a string and returns object or tries to load object from requirejs using
		 * string. Basically it allows you to load an object synchronously if it was already loaded previously and
		 * throw an error when it was not loaded
		 * @param objTemplate (object or string path)
		 */
		loadSync: function (objTemplate) {
			if (_.isString(objTemplate)) {
				var extension,extTemplate;
				if (this.siteContext) {
					extTemplate = objTemplate + '.' + this.siteContext;
					if (this.moduleExists(extTemplate)) {
						extension = require(extTemplate);
					}
				}
				if(this.extensions){
					extTemplate = 'extensions/' + objTemplate;
					if(this.moduleExists(extTemplate)){
						extension = require(extTemplate);
					}
				}
				//requirejs._defined
				return _.extend({}, require(objTemplate), extension);

				// RequireJS is not available when compiled with Almond.
				/*if(require.defined(objTemplate)){
				 return _.extend({},requirejs(objTemplate));
				 }else{
				 this.error('Module '+objTemplate+' had not been loaded. To load a module synchronously you must make sure it was already loaded as a dependency before hand.');
				 }*/
			}
			return _.extend({}, objTemplate);
		},
		wrapError: function (callback) {
			var _this = this;
			if (_.isFunction(callback)) {
				return function () {
					if (!_this.isNode && _this.config.throwErrors) {
						callback.apply(this, arguments);
					} else {
						try {
							callback.apply(this, arguments);
						} catch (error) {
							_this.error(error);
						}
					}

				};
			} else {
				return callback;
			}

		},
		//todo:error logging should be fixed ( check if node and act accoridingly )
		logError: function (error, severity, note) {
			error = error || 'EMPTY ERROR';
			error = _.isString(error) ? new Error(error) : error;
			severity = _.isNumber(severity) ? severity : 3;

			console.error((new Date()).toISOString()+' '+this.context.url);
			if (note) {
				console.error(note);
			}
			console.error(error.stack);
		},
		error: function (error, severity, note) {
			var _this = this;
			severity = _.isNumber(severity) ? severity : 3;
			error = _.isString(error) ? new Error(error) : error;


			//todo: I neeed to show the errors nicely without coupling to tight with an error module
			if (this.isNode) {
				this.logError(error, severity, note);

				var html = (note ? '\n<p>'+note+'</p>\n' : '') + "\n<p><strong>" + error.message + "</strong></p>\n" + "<pre>" + error.stack + "</pre>",
					response = _this.server.response;


				if (!response.finished) {
					_this.$(_this.$document.html(html));
					html = _this.$.html();
					response.writeHead(500);
					response.end(html);
				}
				this.shutdown();


			} else {
				_this.trigger('global:error', error);
				//alert('ToDo: implement client side error handling. :'+error.message);
			}

		},

		end: function (html) {
			var response = this.server.response;
			if (!response.finished) {
				response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
				response.end(html);
			} else {
				this.logError(new Error('Can\'t end response, it has already ended'));
			}
		},
		trigger: function (event) {
			var _this = this,
				module = event.split(':')[0],
				args = arguments;
			//Backbone.Events.trigger.apply(_this,args);return;
			//only if this is not a multi event(multi will call this function multiple times for each event) and has a
			//a column we load the controller
			if (event.indexOf(' ') === -1 && event.indexOf(':') > 0) {
				//console.log(event);
				var path = 'modules/' + module + '/controller';
				path = this.moduleExists('core/'+path) ? 'core/'+path : path;
				_this.loadController(path, function () {
					Backbone.Events.trigger.apply(_this, args);
				});
			} else {
				Backbone.Events.trigger.apply(_this, args);
			}


		},
		/**
		 * This is a method to preload controllers
		 */
		/*preLoadControllers:function(options, callback){
		 var _this=this,
		 controllers = options.common || [];
		 controllers = controllers.concat(options[_this.isNode ? 'node' : 'browser'] || []);


		 var done = _this.await(controllers.length,callback);
		 _.each(controllers,function(controller){
		 _this.loadController(controller,done);
		 });

		 },*/
		/**
		 * This is a method to preload modules and attach them to the app.modules[modulePath]
		 */
		attachModules: function (options, callback) {
			var _this = this,
				modules = _.extend({}, options.common, options[_this.isNode ? 'node' : 'browser']);

			this.modules = {};

			var done = _this.await(_.keys(modules).length, callback);
			_.each(modules, function (type, path) {

				if (type === 'controller') {
					_this.loadController(path, function (controller) {
						_this.modules[controller.moduleName || path] = controller;
						done();
					});
				} else {
					var module = _this.factory[type].create(path);
					_this.modules[module.moduleName || path] = module;
					done();
				}

			});

		},
		/**
		 * this method just loads up the instance of the controller
		 * @param controllerPath
		 */
		loadController: function (controllerPath, callback) {
			this.dispatch(controllerPath, null, null, callback);
		},
		/**
		 * This utility function allows you to run a callback function after completing multiple async calls that run
		 * at the same time. Usage:
		 * //you want to run 3 async processes
		 * var done = app.await(3,callback);
		 * someAsyncFunction(function(){
		 *     //do something the call done. You can also override the actual callback at any moment for more complex flows
		 *     done();
		 * });
		 *
		 */
		await: function (count, callback) {
			return function (overideCallback) {
				if (overideCallback) {
					callback = overideCallback;
				}
				count--;
				if (count === 0) {
					callback();
				}
			};
		},
		dispatch: function (controllerPath, method, args, callback) {

			//if the app is closed we don't want to dispatch anything
			if (this.closed) {
				return false;
			}

			var _this = this,
				lc = _this.factory.cache.controllers;


			/*if(!lc){
			 console.log('ERROR: the request was already closed probably because there where no pending views');
			 return;
			 }*/
			//we cant reuse the same controllers since they have an app objects specific to each request
			if (lc[controllerPath]) {
				//if we have no method it means we only wanted to make an instance of the controller
				method && lc[controllerPath].run(method, args);

				callback && callback(lc[controllerPath]);
				return;
			}

			_this.pause();
			require([controllerPath], _this.wrapError(function () {

				var controller = _this.factory.controller.create(controllerPath);
				controller.requirePath = controllerPath;
				//lc[controllerPath] = controller;
				//if we have no method it means we only wanted to make an instance of the controller
				method && controller.run(method, args);

				callback && callback(controller);
				_this.resume();
			}));

		},

		addGlobalHandler: function (app) {
			var _this = this;
			app = app || _this.app;//if we dont pass in the app context we assume that the current objects has it set (most likely only the app itself will pass in the app parameter)

			_this.delegateGlobalEvents = function () {
				_.each(_this.globalEvents, function (method, event) {
					_this.listenTo(app, event, _this[method]);
				});
			};
			_this.undelegateGlobalEvents = function () {
				_this.stopListening(app);
			};
			_this.delegateGlobalEvents();
		},
		shutdown: function () {
			var _this = this;
			this.closed = true;
			//todo: IMPORTANT!!! Emptying handlers might not be ok if we call a route server side after a async operation, I need to rethink this... somehow remove only the handler in the current context? assign an id to it?
			//todo: idea - for above problem I could create a new router every time I route and clean it up right after when in node
			//we need to clean up the handlers otherwise they will keep on adding routes on every request

			_this.$ = null;
			this.modules = null;
			this.request = null;
			this.response = null;
			this.factory = null;
			this.loadedControllers = null;
			//this.factory.cache = null;
			_this.trigger('shutdown');
			//_this.trigger('shutdown');
		},
		_shutdown: function () {
			var _this = this;
			_this.off();
			_this.stopListening();
			_this.undelegateGlobalEvents();//remove all global events (stopListening will do that already
		}

	});

	return app;
});