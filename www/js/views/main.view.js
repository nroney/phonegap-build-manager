MainView = Backbone.View.extend({
	el: 'body',
	events: {
		'click p': 'goto',
		'click .app-list ul li': 'getFullAppInfo',
		'click .install-button': 'installApp',
		'click .pull-latest': 'pullLatest',
		'change .change-value': 'changeValue'
	},

	initialize: function () {
		var _this = this;
		_this.render();
		app.afterRender();
		_this.afterRender();

		app.loadNavHeader();
	},
	pullLatest: function (e) {
		var appId = e.currentTarget.dataset.appid;
		$.post("http://108.59.252.244/mad/phonegap/update.php", { appId: appId, authToken: localStorage.accessToken }, function (data) {
			console.log(data);
		});
	},
	changeValue: function (e) {
		var property = e.currentTarget.dataset.property,
			appId = localStorage.getItem('selectedAppId'),
			inputValue = e.currentTarget.checked,
			changeValue;

		if (inputValue) {
			changeValue = 'true';
		} else {
			changeValue = 'false';
		}

		$.post("http://108.59.252.244/mad/phonegap/change.php", { appId: appId, authToken: localStorage.accessToken, changed: property, changedValue: changeValue  }, function (data) {
			console.log(data);
		});
	},

	installApp: function (e) {
		var installUrl = e.currentTarget.dataset.href;
		window.location = installUrl;
	},

	getFullAppInfo: function (e) {
		var appId = e.currentTarget.dataset.appid;

		$.get("https://build.phonegap.com/api/v1/apps/" + appId + "?access_token=" + localStorage.accessToken, function (data) {
			$('#appId').html(data.id);
			$('#version').html(data.version);
			$('#phonegap').html(data.phonegap_version);
			$('#owned').html(data.role);
			$('#source').html(data.repo);
			$('#branch').html();
			$('#commit').html();
			$('#lastBuild').html();

			$('#hydrationSwitch' + data.id).prop('checked', data.hydrates);
			$('#debugSwitch' + data.id).prop('checked', data.debug);
			$('#privateSwitch' + data.id).prop('checked', data.private);
			$('#installButton' + data.id).attr('href', data.install_url);

			localStorage.setItem('selectedAppId', data.id);
		});
	},

	testLoader: function (e) {
		app.showLoader(e);
	},
	render: function () {
		var _this = this;
		$.get("https://build.phonegap.com/api/v1/me?access_token=" + localStorage.accessToken, function (data) {

			var template = _.template(
				$("script.tmpl-main").html()
			);
			var templateData = data;

			$("#content").html(
				template(templateData)
			);
		});
	},
	afterRender: function () {
	}
});

