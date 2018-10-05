angular.module('appRoutes', ['ngRoute'])
.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: 'app/views/pages/home.html'
        })
        .when('/login', {
            templateUrl: 'app/views/pages/login.html'
        })
        .when('/main', {
            templateUrl: 'app/views/pages/main.html'
        })
});