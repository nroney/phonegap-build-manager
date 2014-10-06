define(['lodash' ,
	'modules/forms/classes/formFactory',
	'modules/forms/classes/validate'
],function(_,formFactory,validate){
	//formfactory class

	//controllers should only be initialized once so we create them before hand
	return {
		moduleName:'forms',//unique id used for attached modules and as a factory cache key (NOT REQUIRED)
		globalEvents:{
			'forms:create':'create',
			'forms:validateSetup':'validateSetup'
		},
		filters:{},
		create:function(options,wrapper,callback){
			options = JSON.parse(JSON.stringify(options));
			options.wrapper = wrapper;

			var form = this.factory.object.create('modules/forms/classes/formFactory',options);
			//var form = new formFactory(options,wrapper,this.app);
			callback && callback(form);
			return form;
		},
		validateSetup:function(form,options,callback){
			if(this.app.isNode){ return false; }
			options = options || {};
			options.form = form;
			var validator = this.factory.object.create('modules/forms/classes/validate',options);
			//var validator = new validate(options);
			callback && callback(validator);
			return validator;
		}

	};
});