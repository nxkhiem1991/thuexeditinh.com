'use strict';
angular.module('adminCtrl', ['chieffancypants.loadingBar'])
    .config(function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
    })
    .controller('AdminController', function ($rootScope, $scope, $location, Auth, cfpLoadingBar, toaster) {

    });
