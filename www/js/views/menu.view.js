MenuView = Backbone.View.extend({
    el: $('menu'),

    initialize: function() {
        this.getData();
    },

    getData: function () {
        this.render();
    },

    render: function () {
        $('#tmpl-menu').tmpl({}).appendTo(this.el);
    },

    events: {
        'click a': 'menuToggle',
        'click .hassub': 'subToggle',
    },
                                
    menuToggle: function (aEvent) {
        var name = $(aEvent.currentTarget).text();

        if (!$(aEvent.currentTarget).hasClass('hassub')) {
            app.menuToggle(true);
        }
    },

    exit: function () {
        navigator.app.exitApp();
        return false;
    }
});

