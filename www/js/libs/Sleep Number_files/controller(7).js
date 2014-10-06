define(['lodash' ,
	'modules/cart/views/index',
	'modules/cart/views/add',
	'modules/cart/views/stateModal'
],function(_){
	//controllers should only be initialized once so we create them before hand
	return {
		globalEvents:{
			'cart:add':'add',
			'cart:setCount':'setCount'
		},
		add:function(model){
			var _this = this;

            _this.app.trigger('global:modal',{
				anchor:true,
				view:_this.factory.view.create('modules/cart/views/add',{
					model:model
				})
			});
			this.app.trigger('cart:setCount');
		},
		index:function(options){
			var _this = this,
				view = this.factory.view.create('modules/cart/views/index',{
					model:options.model,
					onRender:function(){
						this.app.trigger('cart:setCount');
						//we do this onRender to make sure that a call to the BE has been done, (when using service which we are you don't need this here)
					}
				});
			this.render(view);
		},
		setCount:function(){
			var count = this.app.modules.cookies.getCookie('cartCount');
			this.$('.item-count').html(count);
		}
	};
});