angular.module('starter.controllers', [])
.controller('MainCtrl', function($scope) {
})
.controller('NewUserCtrl', function($scope) {     
})
.controller('NewServiceCtrl', function($scope) {     
})
.controller('RoomCtrl', function($scope, $routeParams, List) {    
    List.user($routeParams.id, function(item){
        $scope.user = item;
    });
})
.controller('ServiceCtrl', function($scope, $routeParams, List) {  
    List.service($routeParams.id, function(item){
        $scope.service = item;
    });
})
.controller('EditServiceCtrl', function($scope, $routeParams, List) {  
    List.service($routeParams.id, function(item){
        $scope.service = item;
    });
});