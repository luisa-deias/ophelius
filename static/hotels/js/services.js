angular.module('starter.services', [])
.factory('List', function($http) {
    return {    
        users : function (cb) {
            $http({url: '/hotel/api/users', method: 'GET'})
            .success(function (data, status, headers, config) {   
                cb(data);
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
        },    
        services : function (cb) {
            $http({url: '/hotel/api/services', method: 'GET'})
            .success(function (data, status, headers, config) {   
                cb(data);
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
        },
        user : function (id, cb) {
            $http({url: '/hotel/api/user/' + id, method: 'GET'})
            .success(function (data, status, headers, config) {   
                cb(data);
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
        },
        service : function (id, cb) {
            $http({url: '/hotel/api/service/' + id, method: 'GET'})
            .success(function (data, status, headers, config) {   
                cb(data);
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
        }
    }

});