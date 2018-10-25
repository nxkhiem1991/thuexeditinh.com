'use strict';
angular.module('MyApp',
    ['appRoutes',
        'myComponent',
        'authCtrl',
        'tripCtrl',
        'adminCtrl',
        'authService',
        'tripService',
        'config',
        'angular-loading-bar',
        'toaster',
        'ngAnimate'])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });