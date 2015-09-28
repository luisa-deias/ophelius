App = Ember.Application.create();

App.Router.map(function() {
    this.resource('intro', {
        path: '/'
    });
    this.resource('guests', {
        path: '/guests'
    });
    this.resource('guest', {
        path: '/guest/:id'
    });
    this.resource('services', {
        path: '/services'
    });
    this.resource('service', {
        path: '/service/:id'
    });
    this.resource('serviceChange', {
        path: '/service/:id/change'
    });
    this.resource('create_service', {
        path: '/services/create_service'
    });
    this.resource('create_guest', {
        path: '/guests/create_guest'
    });
    this.resource('settings', {
        path: '/settings'
    });
    this.resource('setting', {
        path: '/setting/:id'
    });
    this.resource('settingChange', {
        path: '/setting/:id/change'
    });
    this.resource('create_seller', {
        path: '/settings/create_seller'
    }),
    this.resource('api', {
        path: '/api/seller'
    });
    this.resource('message', {
        path: '/message/:id'
    });    
});

App.GuestsView = Em.View.extend({
    didInsertElement: function() {
        getListGuest();
    }
});
App.GuestView = Em.View.extend({
    didInsertElement: function() {

        getGuest();
    }
});

App.SettingsView = Em.View.extend({
    didInsertElement: function() {
        getListTeam();
    }
});
App.SettingView = Em.View.extend({
    didInsertElement: function() {
        getTeam();
    }
});
App.SettingChangeView = Em.View.extend({
    didInsertElement: function() {

        changeTeam();
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
App.ServiceChangeView = Em.View.extend({
    didInsertElement: function() {
        changeService();
    }
})