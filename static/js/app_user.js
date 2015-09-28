App = Ember.Application.create();

App.Router.map(function() {
    this.resource('intro', {
        path: '/'
    });    
    this.resource('services', {
        path: '/services'
    });
    this.resource('servicesCategory', {
        path: '/services/category/:id'
    });
    this.resource('service', {
        path: '/service/:id'
    });
    this.resource('settings', {
        path: '/settings'
    });    
});

App.ServicesView = Em.View.extend({
    didInsertElement: function() {
        getListServices();
    }
});
App.ServicesCategoryView = Em.View.extend({
    didInsertElement: function() {
        getListServicesCategory();
    }
});
App.ServiceView = Em.View.extend({
    didInsertElement: function() {
        getService();
    }
});