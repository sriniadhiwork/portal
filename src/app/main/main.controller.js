(function() {
    'use strict';

    angular
        .module('portal.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($log, $location, $window, commonService, AuthAPI, IntegratedWithDHV, LogoutRedirect) {
        var vm = this;

        vm.bypassSaml = bypassSaml;
        vm.hasAcf = hasAcf;
        vm.isAuthenticated = isAuthenticated;
        vm.redirectToDhv = redirectToDhv;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.commonService = commonService;
            vm.authAction = AuthAPI + '/saml/login?disco=true';
            vm.integratedWithDHV = IntegratedWithDHV;

            commonService.getToken(true);
            if (vm.hasAcf()) {
                $location.path('/search');
            }
            if (!vm.isAuthenticated()) {
                //vm.redirectToDhv();
            }
        }

        function bypassSaml () {
            commonService.getSamlUserToken().then(function () {
                commonService.getToken(true);
            });
        }

        function hasAcf () {
            return commonService.hasAcf();
        }

        function isAuthenticated () {
            return commonService.isAuthenticated();
        }

        function redirectToDhv () {
            if (vm.integratedWithDHV) {
                $window.location.replace(LogoutRedirect);
            }
        }
    }
})();
