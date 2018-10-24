'use strict';
angular.module('tripService', [])
.factory('Trip', function ($http, $q) {
    var tripFactory = {};
    
    tripFactory.createTrip = function (data) {
        return $http.post('/api/create-trip', data);
    };
    
    tripFactory.getProvinceTrips = function () {
        return $http.get('/api/province-trip');
    };

    return tripFactory;
})