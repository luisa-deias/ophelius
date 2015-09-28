var app = angular.module('starter', ['ui.bootstrap', 'ngRoute', 'starter.controllers', 'starter.services'])
.controller('HotelCtrl', function($scope, $http) {
    
    $http({url: '/hotel/api/hotel_name', method: 'GET'})
    .success(function (data, status, headers, config) {   
        $scope.hotel_name = data;
    })
    .error(function (data, status, headers, config) {
        alert(data);
    });    

    $http({url: '/hotel/api/users', method: 'GET'})
    .success(function (data, status, headers, config) {   
        $scope.users = data;
    })
    .error(function (data, status, headers, config) {
        alert(data);
    });
    $http({url: '/hotel/api/services', method: 'GET'})
    .success(function (data, status, headers, config) {   
        $scope.services = data;
    })
    .error(function (data, status, headers, config) {
        alert(data);
    });

})
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: '/hotels/templates/main.html',
        controller: 'MainCtrl'
    }).    
    when('/user/:id', {
        templateUrl: '/hotels/templates/room.html',
        controller: 'RoomCtrl'
    }).    
    when('/editservice/:id', {
        templateUrl: '/hotels/templates/edit_service.html',
        controller: 'EditServiceCtrl'
    }).    
    when('/service/:id', {
        templateUrl: '/hotels/templates/service.html',
        controller: 'ServiceCtrl'
    }).
    when('/newuser/', {
        templateUrl: '/hotels/templates/new_user.html',
        controller: 'NewUserCtrl'
    }).
    when('/newservice/', {
        templateUrl: '/hotels/templates/new_service.html',
        controller: 'NewServiceCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
}]);  
