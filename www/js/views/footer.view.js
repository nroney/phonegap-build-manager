FooterView = Backbone.View.extend({
    el: 'footer',

    events: {},

    initialize: function () {
        app.preRoute(this.$el);
        this.render();
    },

    render: function () {
        //var model = this.create_view_model(),
        var lHtml = $('#tmpl-footer').tmpl();

        this.$el.html(lHtml);
        $('.footer-shadow').show();
    },
    
});