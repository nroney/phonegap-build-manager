LoginView = Backbone.View.extend({

events: {
    'click p': 'goto'
},

    initialize: function () {
        var that = this;

        that.render();
        app.afterRender();
        that.afterRender();

        /*GlobalModel('privacypolicy', function (model) {
            that.render(model);
            app.afterRender({linkifyPhone: true});
        });*/
        app.loadNavHeader();
    },


    testLoader:function(e){
        app.showLoader(e);
    },
    render: function (aModel) {
        var lHtml = $('#tmpl-login').tmpl();

        this.$el.html(lHtml);
    }, 
    afterRender: function(){
        app.changePageTitle('Login');
    },
transitionIn: function (callback) {

      var view = this,
          delay

      var transitionIn = function () {
        view.$el.addClass('is-visible');
        view.$el.one('transitionend', function () {
          if (_.isFunction(callback)) {
            callback();
          }
        })
      };

      _.delay(transitionIn, 20);

    },

    transitionOut: function (callback) {

      var view = this;

      view.$el.removeClass('is-visible');
      view.$el.one('transitionend', function () {
        if (_.isFunction(callback)) {
          callback();
        };
      });

    

  }
});