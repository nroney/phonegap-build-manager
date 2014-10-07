MainView = Backbone.View.extend({

	events: {
		'click p': 'goto',
		'click .app-list ul li': 'getFullAppInfo'
	},

	initialize: function () {
		var that = this;
		that.render();
		app.afterRender();
		that.afterRender();

		app.loadNavHeader();
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

