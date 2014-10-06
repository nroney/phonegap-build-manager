define(['lodash'],function(_){
	return {
		autoClose: true,
		initialize: function(options){
			var _this = this;
			_this.triggered = false;
			_this.options = _.extend({
				$container: $(window),
				distance: 400
			},options);
			_.bindAll(_this, 'scrollDetection');
			_this.options.$container.on('scroll.scrollBottom', _this.scrollDetection);
		},
		scrollDetection: function() {
			var _this = this,
				dist = (( _this.options.$el.height() - (_this.options.$container.scrollTop() + _this.options.$container.height())) < this.options.distance );

			if(!_this.triggered && dist){
				_this.triggered = true;
				_this.options.callback && _this.options.callback();
				return true;
			}else if(!dist){
				_this.triggered = false;
			}
		},
		onClose: function(){
			var _this = this;
			_this.options.$container.off('scroll.scrollBottom', _this.scrollDetection);
		}

	};
});