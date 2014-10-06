define(['lodash' ], function (_) {
	/*
	 //I was considering having messages seperate in on place for easy changing. I am keeping this here in case I still want to do this
	 errorMessages={
	 default:'Invalid input',//this is the default msg for a rule that does not have a message set

	 //for regex rules
	 numeric:'Value must be a number',
	 integer:'Value must be a number',
	 decimal:'',
	 email:'Value must be a valid email only',
	 alpha:'Value must be letters only',
	 alphaNumeric:'Value must be letters or numbers only',
	 //alphaDash:'',
	 //natural:'',
	 naturalNoZero:'Value must be a number over 0',
	 //ip:'',
	 //base64:'Value must be a valid base64 number',
	 numericDash:'Value must contain only numbers and dashes',
	 //url:'Value must be a valid url',
	 phoneUS:'Value must be a valid phone number',
	 zip:'Value must be a valid phone zip code',

	 //for method rules
	 required:'This field is required',
	 between:'Value must be between {0} and {1}',
	 min:'Value must be at least {0}',
	 max:'Value must be at most {0}',
	 length:'Value must be exactly {0} characters long',
	 cc:'Value must be a valid credit card number',
	 matches:'Value must match {0}'

	 }
	 */
	var defaultErrorMessage='Invalid input',
		validators = {
			numeric:[
				/^[0-9]+$/,
				'Value must be a number'
			],
			integer:[
				/^\-?[0-9]+$/,
				'Value must be a number'
			],
			decimal:[
				/^\-?[0-9]*\.?[0-9]+$/,
				''
			],
			email:[
				/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i,//http://www.regular-expressions.info/email.html
				'Value must be a valid email only'
			],
			alpha:[
				/^[a-z]+$/i,
				'Value must be letters only'
			],
			alphaNumeric:[
				/^[a-z0-9]+$/i,
				'Value must be letters or numbers only'
			],
			alphaDash:[
				/^[a-z0-9_\-]+$/i,
				''
			],
			natural:[
				/^[0-9]+$/i,
				''
			],
			naturalNoZero:[
				/^[1-9][0-9]*$/i,
				'Value must be a number over 0'
			],
			ip:[
				/^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
				''
			],
			base64:[
				/[^a-zA-Z0-9\/\+=]/i,
				'Value must be a valid base64 number'
			],
			numericDash:[
				/^[\d\-\s]+$/,
				'Value must contain only numbers and dashes'
			],
			url:[
				/^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
				'Value must be a valid url'
			],
			phoneUS:[
				/^(1-?)?(\([0-9]\d{2}\)|[0-9]\d{2})[- ]?[0-9]\d{2}[- ]?\d{4}$/,
				///^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})[- ]?[2-9]\d{2}[- ]?\d{4}$/, //this will not allow numbers like 083 555 5555 which are not valid but some sites allow
				'Value must be a valid phone number'
			],
			zip:[
				/(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/,
				'Value must be a valid zip code'
			],
			required:[
				function(value,data,depends){
					value = $.trim( value || '' );
					if(depends){
						var split = depends.split('='),
							expectedValue = split[1],
							val=data[split[0]];
						/**
						 * required[field]:
						 * we dont want to validate if the value is not a true value (!expectedValue && !value)
						 * required[field=whatever]:
						 * we don't want to validate if the value is not equal to 'whatever' (value!==expectedValue)
						 * so if any of those cases are true we return true, this is a convenience method to avoid needing to
						 * use the depends function since in most cases it depends on a checkbox so we can just do
						 * required[checkboxName] and be done with it
						 */
						//if expected value does not exist, ie: required[shippingLikeBilling] then we just check to see if
						if((!expectedValue && !val) || (expectedValue && val!==expectedValue)){
							return true;
						}

					}
					return !!value;
				},
				'This field is required'
			],
			not: [
				function(value, data){
					return Array.prototype.slice.call(arguments, 2).indexOf(value) === -1;
				},
				'The value entered is not allowed'
			],
			in:[
				function(value, data){
					return Array.prototype.slice.call(arguments, 2).indexOf(value) > -1;
				},
				'The value entered is not in the allowed set of values'
			],
			between:[
				function(value,data,min,max){
					var l=value.length;
					return (l>=min && l<=max);
				},
				'{0} must be between {1} and {2}'
			],
			min:[
				function(value,data,min){
					var l=value.length;
					return (l>=min);
				},
				'Value must be at least {1}'
			],
			max:[
				function(value,data,max){
					var l=value.length;
					return (l<=max);
				},
				'Value must be at most {1}'
			],
			length:[
				function(value,data,length){
					var l=value.length;
					return (l===length);
				},
				'Value must be exactly {1} characters long'
			],
			cc:[
				function(value){
					// Luhn Check Code from https://gist.github.com/4075533
					// accept only digits, dashes or spaces
					if (!validators.numericDash[0].test(value)){ return false;}


					var nCheck = 0, nDigit = 0, bEven = false;
					var strippedField = value.replace(/\D/g, "");

					for (var n = strippedField.length - 1; n >= 0; n--) {
						var cDigit = strippedField.charAt(n);
						nDigit = parseInt(cDigit, 10);
						if (bEven) {
							if ((nDigit *= 2) > 9){ nDigit -= 9;}
						}

						nCheck += nDigit;
						bEven = !bEven;
					}

					return (nCheck % 10) === 0;
				},
				'Value must be a valid credit card number'
			],
			matches:[
				function(value,data,matchField,matchFieldTitle){
					return (value === data[matchField]);
				},
				'Value must match {2}'
			]
		};





	return {
		//autoClose:true,
		isValid:function(value,rules){
			return !this.validateOne(value,rules);
		},
		initialize:function(options){
			//if there are no options we might just want to
			if(options){
				var _this = this,
					$form = $(options.form),
					$fields = $form.find('input,select,textarea,radio');
				_this.options= _.extend({
					rules:{},
					hidden:false,				//validate hidden fields
					highlightFields:true,
					showMessage:true,
					autoValidate:true // false || true  || after_validate (will only validate fields as you use them after the first validate)
					//add default options here
				},options);
				_this.$form = $form;
				_this.rules = _this.options.rules;
				_this.$fields = $fields;
				_this.$editedFields = $();
				_this.id = Math.random().toString().slice(2);

				//the validator expects rules:{fieldName:{rules:'required'} in the options but we want to also allow
				// rules:{fieldName:{validation:'required'} to match how it is written in the backend.
				_.each(_this.rules,function(rule){
					if(_.isObject(rule) && rule.validation){
						rule.rules = rule.validation;
					}
				});


				if(_this.options.autoValidate && _this.options.autoValidate!=='after_validate'){
					_this.setAutoValidate();
				}
			}


		},
		setAutoValidate:function(){
			//make sure this only runs once
			if(!this.autoValidateOn){
				var _this=this,
					$fields =_this.$fields,
					haddleInputEvents = function(e){
						var $this=$(this),
						//we need to make sure that we are adding all the radio buttons if this field is indeed a radio
							fields = $this.attr('type')==='radio' ? _this.$form.find('[name="'+$this.attr('name')+'"]') : $this;
						_this.$editedFields = _this.$editedFields.add(fields);
						_this.validate(_this.$editedFields,false,false);
					},
					haddleKeyUpInputEvents = function(e){
						var $this=$(this);
						if($this.hasClass('validation-error')){
							_this.$editedFields = _this.$editedFields.add($this);
						}
						_this.validate(_this.$editedFields,false,false);

					};

				//blur does not work with checkboxes
				$fields.on('blur',haddleInputEvents);
				$fields.filter('input[type="checkbox"],input[type="radio"]').on('click',haddleInputEvents);
				$fields.filter('select').on('change',haddleInputEvents);

				$fields.filter('input[type="text"],input[type="password"],input[type="tel"]').on('keyup',haddleKeyUpInputEvents);
				$fields.filter('textarea').on('keyup',haddleKeyUpInputEvents);

				_this.autoValidateOn = true;
			}

		},
		onClose:function(){
			var _this = this,
				$fields = _this.$fields;
			//console.log('cleaning up validator')
			if($fields){
				$fields.off('blur');
				$fields.filter('input[type="checkbox"],input[type="radio"]').off('click');
				$fields.filter('select').off('change');
				$fields.filter('input[type="text"]').off('keyup');
				$fields.filter('textarea').off('keyup');
			}
		},
		hideAlert:function(){
			if(!this.options.alertType){
				return false;
			}
			var alertType = this.options.alertType.type;
			if(alertType ==='alert' || this.options.alertType ==='alert'){

				this.app.trigger('global:alert.remove');
			}
		},
		showAlert:function(){
			var alertType = this.options.alertType,
				className ='validation_'+this.id;
			//we added an id to the alert so we don't show the same alert again because it caused problems with blur and click no close at the same time
			if(this.options.alertType && !$('.'+className).length){
				var options = {
					body:'There was a validation error',
					title:'Error',
					className:'error '+className
				};
				if(!_.isString(alertType)){
					options = _.extend(options,this.options.alertType);
					alertType = options.type;
					delete options.type;
				}
				if(alertType ==='alert'){

					this.app.trigger('global:alert',options);
				}else if(alertType ==='modal'){

					this.app.trigger('global:modal',options);
				}
			}
		},
		/**
		 * This function just return true/false if the fields are valid without actually showing any errors
		 */
		valid:function($fields){
			return this.validate($fields,true,true);
		},
		validate:function($fields,skipShowErrors,skipShowAlert){
			var _this=this,
				$form=_this.$form,
			//todo:serializeArray() only works if $form is an actual form element which sucks because I cant set the $form to something other than a form
				data = _this.data = $form.serializeArray(),
				options = _this.options,//if options gets used more than once this is more efficient after minification
				rules = _this.rules,//if options gets used more than once this is more efficient after minification
				rule,error,name,$field, i,x,errors=[],formattedData={},value,fieldsData={};

			$fields=$fields || _this.$fields;
			//I am setting $edited fields to the current scope of fields in case client calls the validate
			_this.$editedFields = $fields;

			//a more convenient way to access the value of each field (passed into our validator methods) without
			// having to "find" a field every time
			_.each(data,function(field){
				formattedData[field.name]=field.value;
			});
			this.data = formattedData;

			//I need to loop before hand to merge related radio buttons into one instead of multiple indexes
			//the reason for not just using that data and looping throught those is that they will be missing
			//unchecked radio/checkboxes thus wont validate them
			_.each($fields,function(field){
				var $field = $(field),
					name = $field.attr('name');
				fieldsData[name]={
					name:name,
					value:formattedData[name],
					$field:$field.attr('type')==='radio' ? $form.find('[name="'+name+'"]') : $field
				};

			});
			//loop through all fields and then check if they have validation
			_.each(fieldsData,function(field){

				name = field.name;
				value = field.value;

				$field = $form.find('[name="'+name+'"]');
				//$fields.push($field[0]);
				//we get the rule from the rules object otherwise we look for the data-validate on the field itself to get the rule
				rule = rules[name] ? rules[name] : $field.data("validate");


				//check if there is any rules for this field and also that it is visible unless hidden (validate hidden fields) option is true
				if(rule && (options.hidden || _this.visible($field))){

					//pass: rule,formattedData,


					error = _this.validateOne(value,rule,formattedData);
					if(error){
						error.$field=$field;
						errors.push(error);
					}

				}

			});



			//_this.cleanUp();


			if(!skipShowErrors){
				_this.handleErrors(errors,$fields);
				//enable auto validate if we set the option to after_validate meaning only enable after the first validation
				if(_this.options.autoValidate==='after_validate'){
					_this.setAutoValidate();
				}
			}
			//handleErrors also cleans up current errors that is why we run regardless of if there was an error
			//the reason I did this is because I wanted all error showing code to be in one overridable method

			if(errors.length){
//				if(_this.options.autoValidate){
//
//					//blur does not work with checkboxes
//					$fields.on('blur',function(){_this.validate();});
//					$fields.filter('input[type="checkbox"],input[type="radio"]').on('click',function(){_this.validate();});
//					$fields.filter('input[type="text"]').on('keyup',function(){_this.validate();});
//					$fields.filter('textarea').on('keyup',function(){_this.validate();});
//					$fields.filter('textarea').on('keyup',function(){_this.validate();});
//				}
				if(!skipShowAlert){
					this.showAlert();
				}
				return false;
			}else{
				this.hideAlert();
			}
			return true;

		},
		validateOne:function(value,rule,formattedData){
			/* */
			//this are the possible combinations that we can get for rules
//			var rules = {
//				field: 'required|range[4,8]',
//				field2: {
//					'validation': 'required|email',
//					'error': 'This field is required and must be a valid email',
//					'name': 'Field2', //this optional property will be used as a substitute for {0} in the error (this is usefull for the default error only plus there is a fallback to the input name) none of the default errors use {0} so it is pretty much useless for now
//					'depends': function (data) {
//						//in this scenario the rules will be run only if the billingSameAsShipping
//						return !!(data.billingSameAsShipping);
//					}
//				},
//				field3: [
//					{
//						'validation': 'required',
//						'error': 'this field is required'
//					},
//					{
//						'validation': 'email',
//						'error': 'this field must be a valid email'
//					},
//					{
//						'validation': function (field, fields) {
//							return value == fields[field3].value;
//						}
//						'error': 'this field must match another field'
//					}
//
//				],
//				field4: function (field, fields) {
//					return value == fields[field3].value;
//				}
//
//			}

			var _this = this,
				field_rules=[],
				splitRules,
				i,
				x,
				error;

			//converting the rules to a unified rule format which will be an array of objects with a single rule per object
			field_rules = [];
			if(_.isString(rule)){
				splitRules = rule.split('|');
				for(i=0;i<splitRules.length;i++){
					field_rules.push({
						'rules':splitRules[i]
					});
				}
			}else if(_.isArray(rule)){
				//although this is already the format we want there might be multiple rules in each of the objects so we must split it up even more
				for(i=0;i<rule.length;i++){
					splitRules = rule[i].rules.split('|');
					for(x=0;x<splitRules.length;x++){
						field_rules.push(_.extend({},rule[i],{
							'rules':splitRules[x]
						}));
					}
				}
			}else if(_.isFunction(rule)){
				field_rules.push({
					'rules':rule
				});
			}else if(_.isObject(rule)){//this must be last since arrays and functions are also
				if(_.isFunction(rule.rules)){
					field_rules.push(rule);
				}else{
					splitRules = rule.rules.split('|');
					for(x=0;x<splitRules.length;x++){
						field_rules.push(_.extend({},rule,{
							'rules':splitRules[x]
						}));
					}
				}
			}
			//now that we formated rules in a standard format we loop through them and add error to error object if they dont validate
			for(i=0;i<field_rules.length;i++){

				var currentRule = field_rules[i],
					match = typeof currentRule.rules ==='string' ? currentRule.rules.match(/([a-zA-Z]+)(\[(.+)\])*/) : [],
					matchRule = match[1],
					args = match[3] ? match[3].split(','):[],
					validator = validators[matchRule] || [],
					argsClone = JSON.parse(JSON.stringify(args)),
					argsClone2 = JSON.parse(JSON.stringify(args)),
				//set error message to error field sent otherwise check for default message for this type
				// of error and finally fallback to default error
					errorMessage = currentRule.error || (validator[1] || defaultErrorMessage),
					valid;

				//other than required we dont want to run validation on an empty field
				if(matchRule!=='required' && value===''){
					valid = true;
					//if we have set a depends function we run it and only if it fails then we don't validate
				}else if(_.isFunction(currentRule.depends) && !currentRule.depends(formattedData)){
					valid = true;
				}else if(_.isFunction(currentRule.rules)){
					valid = currentRule.rules.call(this,value,formattedData);
				}else{
					//if the validator is a function then call it passing in the arguments
					//so rule between[4,13] will call method validator[0](value,formattedData,4,12)
					//remeber each validotor is an array where the 0 index is
					if(_.isFunction(validator[0])){
						//using a clone because we want to keep initial args intact for later usage
						argsClone.unshift(formattedData);
						argsClone.unshift(value);
						valid = validator[0].apply(this,argsClone);
						//else check if the validator is a regex
					}else if(validator[0] instanceof RegExp){
						valid = value.match(validator[0]);
					}

				}
				if(!valid){
					//we pass errorMessage to be formatted with name as {0} and then args as {1},{2}...
					argsClone2.unshift(currentRule.name||name);
					argsClone2.unshift(errorMessage);
					//if one rule failed no need to continue with this field
					return {
						name:name,
						message:_this.format.apply(_this,argsClone2)
					};

				}

			}
		},
		handleErrors:function(errors,$fields){
			var options = this.options;
			//It is vital we only remove the errors from the $fields because we might be doing field by field validation
			$fields.removeClass('validation-error');
			$fields.next('label.error').remove();
			//in jquery I would not need to loop but zepto closest does not work with collections
			for(var i = 0;i<$fields.length;i++){
				$($fields[i]).closest('div.input').find('.error-container label.error').remove();
			}

			for(i=0;i<errors.length;i++){
				var $field = errors[i].$field,
					$container,html;
				if(options.highlightFields){
					$field.addClass('validation-error');
				}
				if(options.showMessage){
					$container=$field.closest('div.input').find('.error-container');

					html = '<label class="error">'+errors[i].message+'</label>';//validation-error class gets added for easy removal

					//check if this is in a div.input that has a span.error-container in it and if so just add the error in there
					if($container.length){
						$container.html(html);
					}else{
						$field.after(html);
					}

				}
			}
		},
		outputErrors:function(errors,options,skipShowAlert){
			var hasErrors = _.find(errors,function(error){
				return error;
			});
			if(_.isEmpty(hasErrors)){
				return false;
			}
			if(!skipShowAlert){
				this.showAlert();
			}

			if(_.isString(options)){
				options = {
					el:options
				};
			}
			options = options || {};

			var _this = this,
				$fields = options.el ? $(options.el).find('input,select,textarea') : _this.$fields,
				formattedErrors = [];


			_.each(errors, function(error,key){
				if(error){
					formattedErrors.push({
						name:key,
						message:error,
						$field:$fields.filter('[name="'+key+'"]')
					});
				}
			});

			_this.handleErrors(formattedErrors,$fields);
		},
		cleanUp:function(){
			this.$fields.off('blur').off('click').off('keyup').off('change');
		},
		//UTIL FUNCTIONS
		visible: function ($field) {
			//for checkboxes that are hidden because of the custom css for them.
			return $field.attr('type') === 'checkbox' ? $field.parent().is(':visible') : $field.is(':visible');
		},
		format: function (val) {
			var args = arguments,i;
			return  val.replace(/{(\d+)}/g, function (match, number) {
				i = Number(number)+1;
				return typeof args[i] !== 'undefined' ? args[i] : match;
			});
		}
	};
});