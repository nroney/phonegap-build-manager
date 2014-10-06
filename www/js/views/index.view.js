IndexView = Backbone.View.extend({
    events: {},

    initialize: function () {
        var that = this;
         that.render();
         that.afterRender();

        app.loadMenuHeader();
        new FooterView();
    },

    render: function (aModel) {
        var lHtml = $("#tmpl-index").tmpl();

        this.$el.html(lHtml);

    },

    afterRender: function(){
        $('.left-nav').hide();
    }
});