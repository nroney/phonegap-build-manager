HeaderView = Backbone.View.extend({
    el: $("header"),

    events: {
        'click #menuToggle': 'menuToggle'
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        $('#tmpl-header').tmpl({}).appendTo(this.el);
    },

    menuToggle: function (aEvent) {
        app.menuToggle(aEvent);
        return false;
    }
});