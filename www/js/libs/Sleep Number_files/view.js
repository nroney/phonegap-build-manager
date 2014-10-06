define(['lodash'],function(_){
	return {
		layout:function(){
			if(this.model && this.model.attributes && this.model.attributes.resultset){
				return this.model.attributes.resultset.layout;

			}
		},
		serializeForm:function($form){
			var data = {};
			_.each($form.serializeArray(),function(field){
				data[field['name']] =field['value'];
			});
			return data;

		},
		populateForms:function(form){
			if(!this.app.isNode && window.mmPopulateForms){
				//mmPopulateForms(form);
			}
		},
		formatPrice: function (price) {
			return  Math.round((price || 0.00) * 100) / 100;
		}

	};
});