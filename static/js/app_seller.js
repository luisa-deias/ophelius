App = Ember.Application.create();

App.Router.map(function() {
    this.resource('intro', {
        path: '/'
    });    
    this.resource('services', {
        path: '/services'
    });
    this.resource('service', {
        path: '/service/:id'
    });
    this.resource('settings', {
        path: '/settings'
    });    
    this.resource('message', {
        path: '/message/:id'
    });      
});

App.MessageView = Em.View.extend({
    didInsertElement: function() {
        getMessage();
    }
});

App.ServicesView = Em.View.extend({
    didInsertElement: function() {
        getListServices();
    }
});
App.ServiceView = Em.View.extend({
    didInsertElement: function() {
        getService();
    }
});