define(['lodash' ],function(_){
	return {
		initialize:function(options){
			var _this = this;
			_this.options = options;
			_this.action = options.action;
			_this.url = options.url;
			_this.wrapper = options.wrapper;
			_this.elements = options.form;
			_this.autoId = 0;
			//asign ids to elements
			_.each(_this.elements,function(element){
				_this.autoId++;
				element.id = _this.autoId;
			});


		},
		outputAll: function(options){
			options = options || {};
			var _this = this,
				html='',
				currentGroup,
				currentSubgroup;
			_.each(this.elements,function(element,index){
				var name = element.fieldName,
					groupSplit = element.group ? element.group.split('.') : 'default',
					group = groupSplit[0],
					subGroup = groupSplit[1];
				if(element.type !=='hidden'){
					if(options.group && options.group!==group){
						return;
					}
					if(group !== currentGroup){
						//if there is a current subgroup we must close it
						if(currentSubgroup){
							//close the subgroup
							html+='</div>';
						}
						//if there is a current group we must close it
						if(currentGroup){
							html+='</div>';
						}
						//set new current group
						currentGroup = group;
						html+='<div class="form-group form-group-'+group+'">';
					}else if(subGroup!==currentSubgroup && currentSubgroup){
						//close the subgroup (we only want to do this if we did not start a new group where we already closed the subgroup)
						html+='</div>';
					}
					if(subGroup!==currentSubgroup){
						currentSubgroup = subGroup;
						if(subGroup){
							html+='<div class="form-sub-group form-sub-group-'+subGroup+'">';
						}

					}
					//html+='<div class="input"></div>';
					html+=_this.output(element.id,null,false);
				}

			});
			//if there is a currentSubgroup it means it was not closed so we need to close it
			if(currentSubgroup){
				html+='</div>';
			}
			if(currentGroup){
				html+='</div>';
			}

			return html;
		},
		outputGroup:function(groupName,options){
			options = options || {};
			options.group = groupName;
			return this.outputAll(options);
		},
		outputRadio:function(name,value,attributes,noWrap){
			return this.output(name,attributes,noWrap,{
				outputRadio:value
			});
		},
		output: function(name,customAttributes,noWrap,options){
			options = _.extend({},options);
			var _this=this,
				html = '',
				element = this.get(name);//we can pass in an object as the element
			name = element.fieldName;
			if(element){

				var attributesHtml = '',
					type = element.type,
					value=element.value || '',
					attributes = _.extend({},element.attributes),
					label = element.label || (element.label!==false ? name : ''),
					validation = element.validation,
					placeholder = element.placeholder ? 'placeholder="'+element.placeholder+'"': '';//add placeholder if we specifically have a label set


				if(customAttributes){
					if(_.isString(customAttributes)){
						attributesHtml = customAttributes;
					}else if(_.isObject(customAttributes)){
						//if customAttributes are set as an object we extend any that where sent by the server (this is the method to override server attributes)
						attributes = _.extend(attributes,customAttributes);
					}else if(_.isArray(customAttributes)){
						_.each(customAttributes,function(val){
							attributesHtml+=' '+val;
						});
					}
				}
				_.each(attributes,function(val,key){
					attributesHtml+=' '+key+'="'+val+'"';
				});

				if(validation){
					attributesHtml+=' data-validate="'+validation+'"';
					if(element.star || (this.options.showRequiredStars && element.star!==false && validation.match(/required(\|.*)?$/))){
						label+='<span class="required">*</span>';
					}
				}
				if (element.disabled){
					attributesHtml+=' disabled';
				}
				if(element.id){
					attributesHtml+=' data-id="'+element.id+'"';
				}


				switch(type){
					case 'text':
					case 'tel':
					case 'email':
					case 'password':
					case 'search':
					case 'hidden':
						html = '<input type="'+type+'" name="'+name+'" value="'+value+'" '+attributesHtml+' '+placeholder+'>';
						break;
					case 'textarea':
						html = '<textarea name="'+name+'" '+attributesHtml+'>'+value+'</textarea>';
						break;
					case 'select':
						html = '<select name="'+name+'" '+attributesHtml+'>';
						_.each(element.options,function(option){
							var selected = option.value === value ? 'selected="selected"':'';
							html+='<option value="'+(option.value || '')+'" '+selected+'>'+option.label+'</option>';
						});
						html += '</select>';
						break;
					case 'radio':
						html = '';
						_.each(element.options,function(option){
							if(options.outputRadio && options.outputRadio!==option.value){
								return;
							}
							var selected = option.value === value ? 'checked="checked"':'';

							if (option.disabled){
								attributesHtml+=' disabled';
							}

							html+='<label><input name="'+name+'" type="radio" value="'+option.value+'" '+selected+' '+attributesHtml+'><span></span><p>'+option.label+'</p></label>';
						});
						//html += '</div>';

						break;
					case 'checkbox':
						var checked = element.checked ? 'checked="checked"':'';
						html = '<input type="checkbox" name="'+name+'" value="'+value+'" '+attributesHtml+' '+checked+' >';
						break;
				}
				if(!noWrap){
					var inputNameClass = ((this.options.showInputClass && options.showInputClass !== false) || options.showInputClass) ? ' input-'+name : '';
					switch(type){
						case 'text':
						case 'tel':
						case 'email':
						case 'password':
						case 'textarea':
						case 'select':
							html = '<div class="input '+type+inputNameClass+'"><label>'+label+'</label>'+html+'</div>';
							break;
						case 'radio':

							if(label){
								html = '<div class="input '+type+''+inputNameClass+'"><h2>'+label+'</h2>'+html+'</div>';
							}else{
								html = '<div class="input '+type+''+inputNameClass+'">'+html+'</div>';
							}
							break;
						case 'checkbox':
							html = '<div class="input '+type+''+inputNameClass+'"><label>'+html+'<span></span><p>'+label+'</p></label><span class="error-container"></span></div>';
							break;
					}
				}
			}
			return html;
		},
		set: function(name,value){
			var element = this.get(name);
			if(element){
				if(element.type === 'checkbox'){
					element.checked = !!value;
				}else{
					element.value = value;
				}
			}else{
				this.autoId++;
				this.elements.push({
					id:this.autoId,
					fieldName:name,
					value:value,
					type:'hidden'
				});
			}
			return true;
		},
		get:function(name,type){

			return _.find(this.elements,function(field){
				if(_.isString(name)){
					return field.fieldName === name && (!type || field.type===type);
				}else if(_.isNumber(name)){
					return field.id === name;
				}
			});
			//else we assume that name is an integer for the index of the element


		},
		getValues:function(){
			var values = {};
			_.each(this.elements,function(field){
				values[field['fieldName']] =field['value'];
			});
			return values;
		},
		/**
		 * validateSetup is just calling the default validation trigger for validation
		 */
		validateSetup:function(form,options,callback){
			this.wrapper = this.wrapper || form;//set a default wrapper if one is not set already
			var _this = this;
			this.app.trigger('forms:validateSetup',form,options,function(validator){
				_this.validator = validator;
				_this.outputErrors();
				callback && callback(validator);
			});
		},
		/**
		 * validate calls the validate on the validator
		 */
		validate:function(){
			if(this.validator){
				return this.validator.validate.apply(this.validator,arguments);
			}
			//return true if there was no validation set up
			return true;
		},
		outputErrors:function(errors,options){
			errors = errors || this.options.errors;
			if(errors && this.validator){
				this.validator.outputErrors(errors,options);
			}
		},
		exists: function(name){
			return !!this.get(name);
		},
		hasVisible:function(){
			return !!_.find(this.elements, function(el){
				return (el.type !== 'hidden');
			});
		},
		serialize: function(wrapper){
			//we want to allow fetch and get url to pass true when they want to use serialize but not to actually pass a wrapper
			if(wrapper === true){
				wrapper = null;
			}
			//set the wrapper
			wrapper = wrapper || this.wrapper;
			//set instance wrapper only if was not previously set
			this.wrapper = this.wrapper || wrapper;
			var _this=this,
				checkedRadios = [],
				$form = wrapper ? this.$(wrapper) : this.$('body');

			//todo: now that we changed to an array for this.elements the multiple .get are not very efficient
			//we need to reset any radio values so if there was none selected it actually sends an empty value and not what was set as value previously
			$form.find('input[type=radio]').each(function(i,input){
				var $input = _this.$(input),
					key = $input.attr('name'),
					element = _this.get(key);

				if(element){
					element.checked = false;
					element.value='';
				}
			});
			$form.find('input,select,textarea').each(function(i,input){
				var $input = _this.$(input),
					key = $input.attr('name'),
					id = Number($input.attr('data-id')),
					element = _this.get(id || key);
				//console.log(key)
				if(element){
					var checked = !!$input.prop('checked'),
						type = $input.attr('type'),
						value=$input.val();
					if(type==='radio'){
						//console.log('radio')
						if(!checked){
							return;
						}
						//we want to specify that there is an actual value that is checked so we know in the BE not to send anything if it is not
						element.checked = true;
					}
					if($input.attr('type')==='checkbox'){
						element.checked = true;
						if(!checked){
							value = '';
							element.checked = false;
						}
						//if(!!$input.prop('checked'))
					}
					element.value = value;
				}

			});
			return this.options;
		},
		populate:function(wrapper){
			//if this needs to be enabled for node the prop must not be used
			if(this.app.isNode){
				return false;
			}
			//set the wrapper
			wrapper = wrapper || this.wrapper;
			//set instance wrapper only if was not previously set
			this.wrapper = this.wrapper || wrapper;
			wrapper = wrapper || 'body';
			var _this=this,
				$form = wrapper ? this.$(wrapper) : this.$('body');


			$form.find('input,select,textarea').each(function(i,input){
				var $input = _this.$(input),
					key = $input.attr('name'),
					element = _this.get(key);
				//console.log(key)
				if(element){
					var type = $input.attr('type');


					if(type==='radio'){
						var checked = $input.attr('value') === element.value;
						$input.prop('checked',checked);
					}else if($input.attr('type')==='checkbox'){
						$input.prop('checked',element.checked);
					}else{
						$input.val(element.value);
					}
					//element.value = value;
				}

			});


			//todo: implement this part to actually set the values for each item
		},
		setModel: function(model){
			this.options.model = model;
		},
		/**
		 *
		 * @param wrapper (this optional parameter is used to basically run a this.serialize(wrapper) before fetching
		 * @param callback
		 */
		fetch: function(wrapper,callback){
			if(_.isFunction(wrapper)){
				callback = wrapper;
				wrapper = null;
			}
			//this.wrapper = this.wrapper || wrapper;
			var request = wrapper ? this.serialize(wrapper) : this.options,
				model;
			//console.log(request);

			if(request.model){
				model = this.app.factory.model.create(request.model);
				model.url || (model.url = '/api/generic');
			}else{
				model = this.app.factory.model.create({
					url:'/api/generic'
				});
			}
			if(request.url){
				model.url = request.url;
			}
			model.fetch({
				data:request,
				method:'post',
				success:function(){
					callback(model);
				}
			});
		},
		// TODO: fix this, needs to be able to redirect. Convert to object.
		submitGet: function(wrapper){
			//var request = skipForms ? this.options : this.serialize(wrapper);
			//console.log(request);

			var url = this.createGetUrl(wrapper);
			//console.log(url);
			this.app.navigate(url,true,true);
			//Backbone.history.navigate(url, true);
		},
		createGetUrl: function (wrapper) {
			var options = wrapper ? this.serialize(wrapper) : this.options;
			var url = options.action || '';
			url += url.indexOf('?') > -1 ? '&' : '?';
			var first = true;
			_.each(options.form, function (element, key) {
				if(!first){
					url+='&';
				}
				first = false;
				url+=(element.key ? element.key : element.fieldName) + '=' + element.value;
			});
			return url;
		}

	};
});