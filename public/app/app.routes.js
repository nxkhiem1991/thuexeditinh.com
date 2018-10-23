'use strict';
angular.module('appRoutes', ['ngRoute', 'config', 'mainCtrl'])
.config(function ($routeProvider, $locationProvider, route) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: route.views + 'home.html'
        })
        .when('/login', {
            templateUrl: route.views + 'admin/login.html',
            controller: 'AuthController'
        })
        .when('/register', {
            templateUrl: route.views + 'admin/register.html',
            controller: 'AuthController'
        })
        .when('/forgot-password', {
            templateUrl: route.views + 'admin/forgot-password.html',
            controller: 'AuthController'
        })
        .when('/users', {
            templateUrl: route.views + 'admin/users.html',
            controller: 'AuthController'
        })
        .when('/admin', {
            templateUrl: route.views + 'admin/admin.html',
            controller: 'AdminController'
        })
        .when('/charts', {
            templateUrl: route.views + 'admin/charts.html'
        })
        .when('/tables', {
            templateUrl: route.views + 'admin/tables.html'
        })
        .when('/province-trip', {
            templateUrl: route.views + 'admin/trips/province-trips.html'
        })
        .when('/create-trip', {
            templateUrl: route.views + 'admin/trips/create-trip.html',
            controller: 'TripController'
        }).
        otherwise('/');
});