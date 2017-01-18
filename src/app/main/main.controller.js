(function() {
    'use strict';

    angular
        .module('portal.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($log, $location, $http, $window, commonService, AuthAPI) {
        var vm = this;

        vm.hasAcf = hasAcf;
        vm.isAuthenticated = isAuthenticated;
        vm.redirectToDhv = redirectToDhv;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.commonService = commonService;
            vm.authAction = AuthAPI + '/saml/login?disco=true';

            commonService.getSamlUserToken().then(function () {
                commonService.getToken(true);
                if (vm.hasAcf()) {
                    $location.path('/search');
                }
            }, function (error) {
                $log.info('need to redirect', error);
                vm.redirectToDhv();
            });
        }

        function hasAcf () {
            return commonService.hasAcf();
        }

        function isAuthenticated () {
            return commonService.isAuthenticated();
        }

        function redirectToDhv () {
            /*
             * can't redirect this way until CORS is fixed
             *
            if (vm.integratedWithDHV) {
                $http({
                    method  : 'POST',
                    url     : vm.authAction,
                    data    : {'idp': 'https://california.demo.collaborativefusion.com/sso/saml2/idp/'},//$.param($scope.formData),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                })
                //            vm.dhvForm.submit();
            }
            */
        }
    }
})();
