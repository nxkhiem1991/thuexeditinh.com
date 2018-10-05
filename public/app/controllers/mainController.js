angular.module('mainCtrl', [])
.controller('MainController', function ($rootScope, $location, Auth) {
    var vm = this;

    vm.loggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function () {
        vm.loggedIn = Auth.isLoggedIn();

        Auth.getUser().then(function (data) {
            vm.user = data.data;
        })
    });

    vm.doLogin = function () {
        vm.processing = true;
        vm.error = '';

        Auth.login(vm.loginData.username, vm.loginData.password)
            .then(function (data) {
                vm.processing = false;
                Auth.getUser().then(function (data) {
                    console.log(data);
                    vm.user = data.data;
                });

                // if(data.data.success) {
                //     $location.path('/');
                // } else {
                //     return vm.error = data.msg;
                // }
            });
    };

    vm.doLogout = function () {
        Auth.logout();
        $location.path('/logout');
    }
})