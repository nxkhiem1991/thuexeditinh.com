'use strict';
angular.module('MyApp', ['appRoutes', 'myComponent', 'mainCtrl', 'authService', 'tripService', 'config', 'angular-loading-bar', 'toaster', 'ngAnimate'])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }).run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function () {
        if (!Auth.isLoggedIn()) {
            $location.path('/login');
        }
    });
}]);