(function() {
    'use strict';

    angular
        .module('portal.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($log, $location, commonService, AuthAPI) {
        var vm = this;

        vm.hasAcf = hasAcf;
        vm.isAuthenticated = isAuthenticated;
        vm.redirectToDhv = redirectToDhv;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.commonService = commonService;
            vm.authAction = AuthAPI + '/saml/login?disco=true';
            vm.willRedirect = false;

            commonService.getSamlUserToken().then(function () {
                commonService.getToken(true);
                if (vm.hasAcf()) {
                    $location.path('/search');
                }
            }, function () {
                vm.willRedirect = true;
            });
        }

        function hasAcf () {
            return commonService.hasAcf();
        }

        function isAuthenticated () {
            return commonService.isAuthenticated();
        }

        function redirectToDhv () {
            if (vm.willRedirect) {
                /* eslint-disable angular/document-service */
                document.getElementById('dhvForm').submit();
                /* eslint-enable angular/document-service */
            }
        }
    }
})();
