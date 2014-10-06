HeaderNavView = Backbone.View.extend({
    el: $("header"),

    events: {
        'click .left-nav': 'leftNavAction'
    },

    initialize: function () {
        this.render();
    },

    leftNavAction: function(aEvent){
        app.router.navigate("/", {trigger: true});
    },

    render: function () {
        $('#tmpl-header-nav').tmpl({}).appendTo(this.el);
    },

});