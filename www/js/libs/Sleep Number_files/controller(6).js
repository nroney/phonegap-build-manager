define([
	'lodash',
	'modules/layout/views/default'

],function(_){
	//controllers should only be initialized once so we create them before hand
	return {
		globalEvents:{
			'controller.renderDone':'setIsLoggedIn',
			'layout:render':'renderLayout',
			'layout:setIsLoggedIn':'setIsLoggedIn'
			//'controller:pdf':'pdfRedirect'
		},
		renderLayout:function(layout,options){
			layout = layout || 'default';
			var _this = this;
			//_this.cl (currentLayout) stores the current rendered layout (if any
			if(_this.cl!==layout || options.redraw){
				//close _this.cv (the current view)
				_this.cv && _this.cv.close();
				//set _this.cv to the new view that was/will be rendered
				_this.cv = _this['layout_'+layout](options);
				_this.cl = layout;

			}else if(options.onRender){
				options.onRender();
			}
		},
		layout_default:function(options){
			var _this = this;

			var view = this.factory.view.create('modules/layout/views/default', _.extend({
					model:this.factory.model.get('base/models/init')
				},options));

			view.render();


			return view;
		}



	};
});