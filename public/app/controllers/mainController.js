'use strict';
angular.module('mainCtrl', ['chieffancypants.loadingBar'])
.config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
})
.controller('AuthController', function ($rootScope, $scope, $location, Auth, cfpLoadingBar, toaster) {
    $scope.user = {};
    $scope.register = false;
    $scope.error = {};
    $scope.regirerSuccess = $location.search().register;
    $scope.loggedIn = Auth.isLoggedIn();
    $scope.singUpData = {};

    // $rootScope.$on('$routeChangeStart', function () {
    //     $scope.loggedIn = Auth.isLoggedIn();
    //
    //     Auth.getUser().then(function (data) {
    //         $scope.user = data.data;
    //     })
    // });

    $scope.doSignUp = function () {
        cfpLoadingBar.start();
        Auth.signup($scope.singUpData)
            .then(function (res) {
                cfpLoadingBar.complete();
                $scope.user = res.data.user;
                $scope.register = true;
                $location.search({username: $scope.user.username, register: 'success'});
            })
            .catch(function (err) {
                cfpLoadingBar.complete();
                angular.forEach(err.data.errors, function(value, key) {
                    $scope.error[value.param] = value.msg;
                });
            });
    };

    $scope.doLogin = function () {
        cfpLoadingBar.start();
        Auth.login($scope.loginData)
            .then(function (data) {
                cfpLoadingBar.complete();
                $scope.processing = false;
                Auth.getUser().then(function (data) {
                    $scope.user = data.data;
                });
                if(data.data.success) {
                    $location.path('/admin');
                }
            })
            .catch(function (err) {
                angular.forEach(err.data.errors, function(value, key) {
                    $scope.error[value.param] = value.msg;
                });
            });
    };

    $scope.doLogout = function () {
        Auth.logout();
        $location.path('/logout');
    }
})
.controller('AdminController', function ($rootScope, $scope, $location, Auth, cfpLoadingBar, toaster) {
    $rootScope.$on('$routeChangeStart', function (event) {
        $scope.loggedIn = Auth.isLoggedIn();
        if(!$scope.loggedIn) {
            event.preventDefault();
            $location.path('/login');
        }
        Auth.getUser().then(function (data) {
            $scope.user = data.data;
        })
    });
})