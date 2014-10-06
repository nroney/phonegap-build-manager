define(['lodash'],function(_){
	return {
		moduleName:'util',
		autoClose:false,
		onScriptLoaded:function(src, callback){
			var _this = this;
			this.loadedScripts = this.loadedScripts || {};
			if(this.loadedScripts[src] === true || !src){
				callback && callback();
			}else if(this.loadedScripts[src] === 'loading'){
				_this.app.modules.util.once('loaded.' + src, function(){
					console.log('done.');
					callback && callback();
				});
			}else{
				this.loadedScripts[src] = 'loading';
				var script = document.createElement('script');
				script.async = "async";
				script.src = src;
				script.onload = function(){
					_this.loadedScripts[src] = true;
					_this.app.modules.util.trigger('loaded.' + src);
					callback && callback();
				};
				document.getElementsByTagName("head")[0].appendChild( script );
			}
		}
	};
});