'use strict';
angular.module('tripCtrl', ['chieffancypants.loadingBar'])
    .config(function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
    })
    .controller('TripController', function ($rootScope, $scope, $location, Trip, cfpLoadingBar, toaster) {
        $scope.tripData = {};

        $scope.getTrip = function () {
            Trip.getProvinceTrips()
                .then(function (res) {
                        console.log(res.data);
                    }
                );
        };

        $scope.createTrip = function () {
            cfpLoadingBar.start();
            Trip.createTrip($scope.tripData)
                .then(function (res) {
                    cfpLoadingBar.complete();
                    toaster.pop({type: 'success', title: res.data.trip.from + ' - ' + res.data.trip.to,body: 'Thêm tuyến xe thành công'});
                    $scope.tripData = {};
                });
        };
    }).run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth, $route) {
    $rootScope.$on('$routeChangeStart', function () {
        if (!Auth.isLoggedIn() && $location.path().includes('admin')) {
            $location.path('/login');
        }
    });
}]);