angular.module('starter.controllers', [])
.controller('LoginCtrl', function($scope) {
})
.controller('MainCtrl', function($scope, List) {
    if ($scope.isTheme == false) List.beautify('html, body', 'background: url(../img/background_4.jpg) no-repeat center center fixed; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; visibility: visible;', function(item){
        return item;
    });
    List.beautify('.title', 'visibility: visible;', function(item){
        return item;
    });    
})
.controller('CategoriesCtrl', function($scope) { })
.controller('BookCtrl', function($scope, $routeParams, List) {
    List.item($routeParams.id, function(item){
        $scope.item = item;
    });    
})
.controller('ItemCtrl', function($scope, $routeParams, List) {
    List.item($routeParams.id, function(item){
        $scope.item = item;
    });
})
.controller('ThanksCtrl', function($scope) {})
.controller('CategorieCtrl', function($scope, $routeParams, List) {
    List.categorie($routeParams.id, function(item){
        $scope.categories = item;
    });
})
.controller('ServicesCtrl', function($scope, List) {
    List.services(function(item){
        $scope.services = item;
    });
})
.controller('OptionsCtrl', function($scope) {
})
.controller('ThemesCtrl', function($scope) {
})
.controller('LanguagesCtrl', function($scope) {
});