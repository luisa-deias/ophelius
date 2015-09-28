//this is used to parse the profile
function url_base64_decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }
    return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
}

var app = angular.module('starter', ['ngRoute', 'angular-loading-bar', 'starter.controllers', 'starter.services', 'pascalprecht.translate'])
.run(['$translate', function($translate) {
    if (typeof navigator.globalization !== "undefined"){
        navigator.globalization.getPreferredLanguage(function(language){
            $translate.use((language.value).split("-")[0]);          
        }, null);
    }
}])
.controller('UserCtrl', function ($scope, $http, $window, $routeParams, $translate) {
    $scope.user = {username: '', password: ''};
    $scope.isAuthenticated = false;
    $scope.welcome = '';
    $scope.message = '';

    $scope.language = function(lan){
        $translate.use(lan);
    };

    $scope.theme = function(the){
        $scope.isTheme = true;
        $("html, body").attr("style", "background: " + the +";");
    };

    $scope.submit = function () {
        $http
        .post('http://demo.ophelius.com/user/token', $scope.user)
        .success(function (data, status, headers, config) {
            $window.sessionStorage.token = data.token;
            $scope.isAuthenticated = true;
            var encodedProfile = data.token.split('.')[1];
            profile = JSON.parse(url_base64_decode(encodedProfile));
            $scope.name = profile.name;
            $scope.email = profile.email;
            $scope.hcode = profile.hcode;
            $scope.room = profile.room;
            $scope.id = profile.id;
            $scope.spot = profile.spot;
            $window.location.href = '/#/main';
            $scope.isTheme = false;
        })
        .error(function (data, status, headers, config) {
            // Erase the token if the user fails to log in
            delete $window.sessionStorage.token;
            $scope.isAuthenticated = false;

            // Handle login errors here
            $scope.error = 'Error: Invalid user or password';
            $scope.welcome = '';
        });        
    }; 
    var date = new Date("1982-29-11");
    $scope.book = function (id) {/*
        $http({
            method: 'POST',
            url: 'http://demo.ophelius.com/app/book/' + $routeParams.id,
            data: $scope.fields
        })
        .success(function (data, status, headers, config) {
            $window.location.href = '/#/thanks';
        })
        .error(function (data, status, headers, config) {
            $scope.error = 'Error!';
        });*/
        $window.location.href = '/#/thanks';
    };    
    $scope.logout = function () {
        $scope.welcome = '';
        $scope.message = '';
        $scope.isAuthenticated = false;
        delete $window.sessionStorage.token;
        $window.location.href = '/';
    };

    $scope.go = function ( path ) {
        $window.location.href = path;
    };

})
.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {

            }
            return $q.reject(rejection);
        }
    };
})
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
})
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    }).
    when('/main', {
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
    }).
    when('/categories', {
        templateUrl: 'templates/categories.html',
        controller: 'CategoriesCtrl'
    }).
    when('/categorie/:id', {
        templateUrl: 'templates/categorie.html',
        controller: 'CategorieCtrl'
    }).
    when('/thanks/', {
        templateUrl: 'templates/thanks.html',
        controller: 'ThanksCtrl'
    }).
    when('/services/', {
        templateUrl: 'templates/services.html',
        controller: 'ServicesCtrl'
    }).
    when('/languages/', {
        templateUrl: 'templates/languages.html',
        controller: 'LanguagesCtrl'
    }).
    when('/options/', {
        templateUrl: 'templates/options.html',
        controller: 'OptionsCtrl'
    }).
    when('/themes/', {
        templateUrl: 'templates/themes.html',
        controller: 'ThemesCtrl'
    }).
    when('/book/:id', {
        templateUrl: 'templates/book.html',
        controller: 'BookCtrl'
    }).
    when('/item/:id', {
        templateUrl: 'templates/item.html',
        controller: 'ItemCtrl'
    }).
    otherwise('/login');
}])
.config(function($translateProvider){
    $translateProvider.translations('en', {
        FOOD: 'FOOD',
        WELLNESS: 'WELLNESS',
        CULTURE: 'CULTURE',
        CHILDREN: 'CHILDREN',
        TRANSPORT: 'TRANSPORT',
        SPORT: 'Sport',
        LIFE: 'Life',
        SEARCH: 'Search',
        UTILS: 'Utils',
        CALL_RECEPTION: 'CALL RECEPTION',
        MESSAGE_RECEPTION: 'MESSAGE TO RECEPTION',
        ACTIVITIES: 'Activities',
        SHOPPING: 'Shopping',
        SETTINGS: 'Settings',
        LANGUAGE: 'LANGUAGE',
        ALL_SERVICES: 'ALL',
        LOGOUT: 'LOGOUT',
        BOOK: 'Book',
        RESERVE: 'RESERVE',
        BOOK_M: 'BOOK',
        BOOK_NOW: 'PAY NOW',
        BOOK_CHECK: 'PAY AT CHECK-OUT',
        PEOPLE: 'PEOPLE',
        PRICE: 'Price',
        NOTIFICATIONS: 'NOTIFICATIONS',
        ORDERS: 'Orders',
        MESSAGE: 'Message',
        OPTIONS: 'OPTIONS',
        OTHER_OPTIONS: 'Other Options',
        WELCOME: 'WELCOME',
        HI: 'HI USER OF ROOM ',
        ADVICE: 'Ophelius racommends',
        CHOOSE_CATEGORIE: 'Choose by category',
        CHOOSE_LIST: 'All services',
        INTERNAL_SERVICES: "INTERN",
        EXTERNAL_SERVICES: "EXTERN",
        BACK_MAIN: "BACK TO MAIN PAGE",
        BUY_FOR: "BUY FOR",
        BUY: "BUY",
        THANKS: "Thanks for using Ophelius.",
        THEMES: "THEME",
        DEFAULT: "DEFAULT",
        RED: "RED",
        BLUE: "BLUE",
        LARGE: "LARGE",
        PROFILE: "PROFILE",
        ENGLISH: "ENGLISH",
        ITALIAN: "ITALIAN",
        CATEGORIES: "CATEGORY",
        LAN: "0",
        DAY: "DAY",
        COACH : "COACH"
    });
    $translateProvider.translations('it', {
        FOOD: 'CIBO',
        WELLNESS: 'BENESSERE',
        CULTURE: 'CULTURA',
        CHILDREN: 'BAMBINI',
        TRANSPORT: 'TRASPORTI',
        SPORT: 'Sport',
        LIFE: 'Benessere',
        SEARCH: 'Cerca',
        UTILS: 'Utilità',
        CALL_RECEPTION: 'CHIAMA RECEPTION',        
        MESSAGE_RECEPTION: 'MESSAGGIO ALLA RECEPTION',
        ACTIVITIES: 'Shopping',
        SETTINGS: 'Impostazioni',
        LANGUAGE: 'LINGUA',
        ALL_SERVICES: 'TUTTI',
        LOGOUT: 'ESCI',
        BOOK: 'Prenota',
        RESERVE: 'PRENOTA',
        BOOK_M: 'PRENOTA',
        BOOK_NOW: 'PAGA ADESSO',
        BOOK_CHECK: 'PAGA AL CHECK-OUT',       
        PEOPLE: 'PERSONE',
        PRICE: 'Prezzo',
        NOTIFICATIONS: 'NOTIFICHE',
        ORDERS: 'Ordini',
        MESSAGE: 'Messaggio',
        OPTIONS: 'OPZIONI',        
        OTHER_OPTIONS: 'Altre opzioni',
        WELCOME: 'BENVENUTO',
        HI: 'CIAO UTENTE DELLA STANZA ',
        ADVICE: 'Ophelius consiglia',
        CHOOSE_CATEGORIE: 'Scegli per categoria',
        CHOOSE_LIST: 'Tutti i servizi',
        INTERNAL_SERVICES: "INTERNO",
        EXTERNAL_SERVICES: "ESTERNO",
        MAIN: "PAGINA PRINCIPALE",
        BACK_MAIN: "TORNA ALLA PAGINA PRINCIPALE",
        BUY_FOR: "COMPRA PER",
        BUY: "COMPRA",
        THANKS: "Grazie per aver usato Ophelius.",
        THEMES: "TEMA",
        DEFAULT: "DEFAULT",
        RED: "ROSSO",
        BLUE: "BLU",
        LARGE: "LARGA",
        PROFILE: "PROFILO",
        ENGLISH: "INGLESE",
        ITALIAN: "ITALIANO",        
        CATEGORIES: "CATEGORIA",
        LAN: "1",
        DAY: "GIORNO",
        COACH : "ISTRUTTORE"        
    });    
    $translateProvider.preferredLanguage("en");
    $translateProvider.fallbackLanguage("en");
});
