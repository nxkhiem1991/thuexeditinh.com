'use strict';
angular.module('MyApp', ['appRoutes', 'myComponent', 'mainCtrl', 'authService', 'tripService', 'config', 'angular-loading-bar', 'toaster', 'ngAnimate'])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });