angular.module('authService', [])
.factory('Auth', function ($http, $q, AuthToken) {
    var authFactory = {};
    authFactory.login = function (username, password) {
        return $http.post('/api/login',  {
            username: username,
            password: password
        }).then(function (data) {
            AuthToken.setToken(data.data.token);
            return data;
        })
    };

    authFactory.logout = function () {
        AuthToken.setToken();
    }

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
        return $window.localStorage.getItem('token')
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
           config.header['x-access-token'] = token;
       }

       return config;
   };

   authInterceptorFactory.responeError = function (res) {
     if(res.status == 403) {
         $location.path('/login');

         return $q.reject(res);
     }
   };

   return authInterceptorFactory;
});