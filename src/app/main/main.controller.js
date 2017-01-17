(function() {
    'use strict';

    angular
        .module('portal.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($log, $location, $http, $window, commonService, AuthAPI, IntegratedWithDHV) {
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
                vm.redirectToDhv();
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
                $http({
                    method  : 'POST',
                    url     : vm.authAction,
                    data    : {'idp': 'https://california.demo.collaborativefusion.com/sso/saml2/idp/'},//$.param($scope.formData),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                })
                //            vm.dhvForm.submit();
            }
        }
    }
})();
