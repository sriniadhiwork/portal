(function() {
    'use strict';

    angular
        .module('portal.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($log, commonService, AuthAPI) {
        var vm = this;

        vm.bypassSaml = bypassSaml;
        vm.hasAcf = hasAcf;
        vm.isAuthenticated = isAuthenticated;

        vm.commonService = commonService;
        vm.authAction = AuthAPI + '/saml/login?disco=true';

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            commonService.getToken(true);
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
    }
})();
