angular.module('mainCtrl', ['chieffancypants.loadingBar'])
.config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
})
.controller('MainController', function ($rootScope, $location, Auth, cfpLoadingBar, toaster) {
    var vm = this;
    vm.register = false;
    vm.regirerSuccess = $location.search().register;
    vm.loggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function () {
        vm.loggedIn = Auth.isLoggedIn();

        Auth.getUser().then(function (data) {
            vm.user = data.data;
        })
    });

    vm.doSignUp = function () {
        cfpLoadingBar.start();
        vm.error = {};

        Auth.signup(vm.singUpData)
            .then(function (res) {
                cfpLoadingBar.complete();
                vm.user = res.data.user;
                vm.register = true;
                $location.search({username: vm.user.username, register: 'success'});
            })
            .catch(function (err) {
                cfpLoadingBar.complete();
                angular.forEach(err.data.errors, function(value, key) {
                    vm.error[value.param] = value.msg;
                });
            });
    };

    vm.doLogin = function () {
        vm.processing = true;
        vm.error = '';

        Auth.login(vm.loginData.username, vm.loginData.password)
            .then(function (data) {
                vm.processing = false;
                Auth.getUser().then(function (data) {
                    vm.user = data.data;
                });

                if(data.data.success) {
                    $location.path('/');
                } else {
                    return vm.error = data.msg;
                }
            });
    };

    vm.doLogout = function () {
        Auth.logout();
        $location.path('/logout');
    }
})