define(['lodash'
],function(_){
	return {
		moduleName:'cookies',
		getCookie:function(name){
			var cookies = this.getCookies() || {};
			return cookies[name];
		},
		getCookies:function(){
			if(this.app.isNode){
				return this.app.server.request.cookies;
			}else{
				var cookies = {};
				_.each(document.cookie.split('; ') || [],function(cookie){
					var split = cookie.split('=');
					cookies[split[0]] = split[1];
				});
				return cookies;
			}
		},
		setCookie:function(name,value,options){
			options = _.extend({
				path:'/'
			},options);
			var sendCookie = [name+'='+value];
			if(_.isNumber(options.maxAge)){
				sendCookie.push('Max-Age=' + options.maxAge);
				var date = new Date();
				date.setTime(date.getTime() + (options.maxAge * 1000));
				sendCookie.push('Expires=' + date.toUTCString());
			}
			if(options.domain){
				sendCookie.push('Domain='+options.domain);
			}
			sendCookie.push('Path='+options.path);

			if(this.app.isNode){
				this.app.server.response.setHeader('Set-Cookie', sendCookie.join('; '));
			}else{
				document.cookie = sendCookie.join('; ');
				console.log(sendCookie.join('; '));
				//todo:implement client side getting cookies
			}

		},
		removeCookie:function(name,options){
			options = _.extend({
				maxAge:0
			},options);
			this.setCookie(name,null,options);
		}
	};
});