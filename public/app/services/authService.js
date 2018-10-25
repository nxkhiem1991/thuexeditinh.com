'use strict';
angular.module('authService', [])
.factory('Auth', function ($http, $q, AuthToken) {
    var authFactory = {};

    authFactory.signup = function (data) {
        return $http.post('/api/signup', data)
            .then(function (res) {
               return res;
            });
    };

    authFactory.login = function (data) {
        return $http.post('/api/login', data)
            .then(function (res) {
                AuthToken.setToken(res.data.token);
                return res;
            });
    };

    authFactory.logout = function () {
        AuthToken.setToken();
    };

    authFactory.isLoggedIn = function () {
      return AuthToken.getToken() ? true : false;
    };
    
    authFactory.getUser =function () {
      if(AuthToken.getToken()) {
          return $http.get('/api/me');
      } else {
          return $q.reject({msg: "User has no token!"});
      }
    };

    return authFactory;
})
.factory('AuthToken', function ($window) {
    var authTokenFactory = {};
    authTokenFactory.getToken = function () {
        return $window.localStorage.getItem('token');
    };

    authTokenFactory.setToken = function (token) {
        if(token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
    };

    return authTokenFactory;
})
.factory('AuthInterceptor', function ($q, $location, AuthToken) {
   var  authInterceptorFactory = {};

   authInterceptorFactory.request = function (config) {
       var token = AuthToken.getToken();
       if(token) {
           config.headers['x-access-token'] = token;
       }

       return config;
   };

   authInterceptorFactory.responseError = function (res) {
       if(res.status === 403) {
           $location.path('/login');
       }
       return $q.reject(res);
   };

   return authInterceptorFactory;
});