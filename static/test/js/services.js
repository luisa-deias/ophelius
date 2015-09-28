angular.module('starter.services', [])
.factory('List', function($http) {
    return {
        categorie : function (id, cb) {
            $http({url: 'http://demo.ophelius.com/app/api/services/category/' + id, method: 'GET'})
            .success(function (data, status, headers, config) {   
                cb(data);
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
        },
        services : function (cb) {
            $http({url: 'http://demo.ophelius.com/app/api/services/', method: 'GET'})
            .success(function (data, status, headers, config) {   
                cb(data);
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
        },
        item : function (id, cb) {
            $http({url: 'http://demo.ophelius.com/app/api/service/' + id, method: 'GET'})
            .success(function (data, status, headers, config) {   
                cb(data);
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
        },
        beautify : function (tag, css, cb) {
            cb($(tag).attr("style", css));
        }
    }
});