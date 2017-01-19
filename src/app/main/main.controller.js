(function() {
    'use strict';

    angular
        .module('portal.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($log, $location, $timeout, commonService, AuthAPI) {
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

            commonService.getSamlUserToken().then(function (response) {
                if (angular.isDefined(response)) {
                    $log.info('response is defined', response);
                    commonService.getToken(true);
                    if (vm.hasAcf()) {
                        $location.path('/search');
                    }
                } else {
                    $log.info('response is not defined', response);
                    vm.willRedirect = true;
                }
            }, function (error) {
                $log.info('log in error', error);
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
            $timeout(function () {
                if (vm.willRedirect) {
                    /* eslint-disable angular/document-service */
                    document.getElementById('dhvForm').submit();
                    /* eslint-enable angular/document-service */
                }
            },1000);
        }
    }
})();
