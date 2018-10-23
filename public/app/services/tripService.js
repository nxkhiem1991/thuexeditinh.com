'use strict';
angular.module('tripService', [])
.factory('Trip', function ($http, $q) {
    var tripFactory = {};
    
    tripFactory.createTrip = function (data) {
        return $http.post('/api/create-trip', data)
            .then(function (res) {
                return res;
            });
    }

    return tripFactory;
})