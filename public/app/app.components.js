angular.module('myComponent', ['config'])
    .component('headerAdmin', {
        templateUrl: function(route){
            return route.views + 'admin/layouts/header-admin.html';
        }
    })
    .component('sidebarAdmin', {
        templateUrl: function(route){
            return route.views + 'admin/layouts/sidebar-admin.html';
        }
    })
    .component('breadCrumb', {
        templateUrl: function(route){
            return route.views + 'admin/layouts/breadcrumb.html';
    }
});
