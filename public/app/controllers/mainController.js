angular.module('mainCtrl', ['chieffancypants.loadingBar'])
.config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
})
.controller('MainController', function ($rootScope, $location, Auth, cfpLoadingBar) {
    var vm = this;

    vm.loggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function () {
        vm.loggedIn = Auth.isLoggedIn();

        Auth.getUser().then(function (data) {
            vm.user = data.data;
        })
    });

    vm.doSignUp = function () {
        cfpLoadingBar.start();
        vm.error = '';

        Auth.signup(vm.singUpData)
            .then(function (res) {
                cfpLoadingBar.complete();
                vm.user = res.data.user;
            })
            .catch(function (err, status) {
                cfpLoadingBar.complete();
                vm.error = err.data.validate;
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