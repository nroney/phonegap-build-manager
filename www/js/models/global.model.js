GlobalModel = function (jsonPath, callback, show_loader) {
    var model = new Backbone.Model(),
        defaultError = {
            Heading: 'Request Timed Out',
            Message: 'Your request timed out, you may have limited or no Internet connectivity.'
        };

    if (show_loader !== false) {
        app.showLoader();
    }

    // use mock data on desktop
    if (_.isNull(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/))) {

        $.mockjax({
            url: jsonPath,
                responseTime: 750,
                responseText: app.mockdata[jsonPath.replace(/\//g, '')]
            }
        );
        $.getJSON(jsonPath, function(response) {
            model.set({resultset: response.resultset});

            // test error
            //model.set({ resultset: { Error: defaultError } });

            if (model.get('resultset').Error) {
                new ErrorView({model: model});
            } else {
                callback(model);
            }
            app.hideLoader();
        });

    // get json via http request on mobile
    } else {
        $.get('http://google.com/m/'+jsonPath + '.php', function(response) {
            model.set({resultset: response.resultset});
            callback(model);


        }).fail(function (response) {
            //alert(JSON.stringify(response))
            model.set({ resultset: { Error: defaultError } });
            new ErrorView({model: model});

        }).always(function () {
            app.hideLoader();
        });

    }

    return model;
};
