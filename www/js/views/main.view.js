MainView = Backbone.View.extend({

	events: {
		'click p': 'goto',
		'click .app-list ul li': 'getFullAppInfo',
		'click .install-button': 'installApp',
		'click .pull-latest': 'pullLatest'
	},

	initialize: function () {
		var that = this;
		that.render();
		app.afterRender();
		that.afterRender();

		app.loadNavHeader();
	},
	pullLatest: function(e){
		var appId = e.currentTarget.dataset.appid;
		
		$.ajax({
			  type: "GET",
			  url: "http://108.59.252.244/mad/phonegap/update.php",
			  cache: false,
			  //data: { appId: appId, authToken: localStorage.accessToken },
			  success: function(){
			  }
});
		
	},

	installApp: function(e){
		var installUrl = e.currentTarget.dataset.href;
		window.location = installUrl;
	},

	getFullAppInfo: function(e){
		var appId = e.currentTarget.dataset.appid;

		$.get("https://build.phonegap.com/api/v1/apps/"+appId+"?access_token=" + localStorage.accessToken, function (data) {
			//new AppDetailView();
			$('#appId').html(data.id);
			$('#version').html(data.version);
			$('#phonegap').html(data.phonegap_version);
			$('#owned').html(data.role);
			$('#source').html(data.repo);
			$('#branch').html();
			$('#commit').html();
			$('#lastBuild').html();

			$('#hydrationSwitch'+data.id).prop('checked', data.hydrates);
			$('#debugSwitch'+data.id).prop('checked', data.debug);
			$('#privateSwitch'+data.id).prop('checked', data.private);
			$('#installButton'+data.id).attr('href', data.install_url);
		});
	},

	testLoader: function (e) {
		app.showLoader(e);
	},
	render: function (aModel) {
		var _this = this;
		$.get("https://build.phonegap.com/api/v1/me?access_token=" + localStorage.accessToken, function (data) {
			var lHtml = $('#tmpl-main').tmpl(data);
			_this.$el.html(lHtml);
		});
	},
	afterRender: function () {
		app.changePageTitle('Main');
	}

});

