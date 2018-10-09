angular.module('appRoutes', ['ngRoute', 'config'])
.config(function ($routeProvider, $locationProvider, route) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: route.views + 'home.html'
        })
        .when('/login', {
            templateUrl: route.views + 'admin/login.html'
        })
        .when('/admin', {
            templateUrl: route.views + 'admin/admin.html'
        })
        .when('/charts', {
            templateUrl: route.views + 'admin/charts.html'
        })
        .when('/tables', {
            templateUrl: route.views + 'admin/tables.html'
        })
        .when('/register', {
            templateUrl: route.views + 'admin/register.html'
        })
        .when('/forgot-password', {
            templateUrl: route.views + 'admin/forgot-password.html'
        })
        .when('/users', {
            templateUrl: route.views + 'admin/users.html'
        }).
        otherwise('/');
});