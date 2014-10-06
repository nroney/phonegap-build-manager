define([
	'lodash' ,
	'modules/static/views/index',
	'modules/static/views/whySleepnumber',
	'modules/static/views/replacementParts',
	'modules/static/views/companyInfo',
	'modules/static/views/sleepIq',
	'modules/static/views/privacyPolicy',
	'modules/static/views/termsAndConditions',
	'modules/static/views/lpFinancing',
	'modules/static/views/lpDualTemp',
	'modules/static/views/lpDualAir',
	'modules/static/views/lpMemoryFoam',
	'modules/static/views/lpPillowFit',
	'modules/static/views/lpFlexFit',
	'modules/static/views/lpHypoallergenicBedding',
	'modules/static/views/lpClassicSeries',
	'modules/static/views/lpSmartClassics',
	'modules/static/views/lpAirFit',
	'modules/static/views/lpBeds',
	'modules/static/views/facebookCoupon'
],function(_){
	//controllers should only be initialized once so we create them before hand
	return {
		globalEvents:{},
		filters:{},
		before:function(){

		},

		//these actions are no longer needed unless you need to do something custom, these are examples for the existing
		//pages on how you would add an action to override the default functionality
		index:function(options){
			var view = this.factory.view.create('modules/static/views/index',{
				model:options.model
			});
			this.render(view);

		},

		whySleepnumber:function(options){
			var view = this.factory.view.create('modules/static/views/whySleepnumber',{
				model:options.model
			});
			this.render(view);

		},

		replacementParts:function(options){
			var view = this.factory.view.create('modules/static/views/replacementParts',{
				model:options.model
			});
			this.render(view);

		},

		companyInfo:function(options){
			var view = this.factory.view.create('modules/static/views/companyInfo',{
				model:options.model
			});
			this.render(view);

		},

		after:function(){

		}
	};
});
