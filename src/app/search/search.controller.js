(function() {
    'use strict';

    angular
        .module('portal.search')
        .controller('SearchController', SearchController);

    /** @ngInject */
    function SearchController($log, $location, $anchorScroll, $scope, Idle, Keepalive, commonService, AuthAPI) {
        var vm = this;

        vm.bypassSaml = bypassSaml;
        vm.hasAcf = hasAcf;
        vm.isAuthenticated = isAuthenticated;
        vm.refreshToken = refreshToken;
        vm.registerHandler = registerHandler;
        vm.scrollTo = scrollTo;
        vm.triggerHandlers = triggerHandlers;

        vm.commonService = commonService;
        vm.authAction = AuthAPI + '/saml/login?disco=true';

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            commonService.getToken(true);
            vm.handlers = [];
            $scope.$on('Keepalive', function() {
                $log.info('Keepalive');
                vm.refreshToken();
            });
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

        function refreshToken () {
            commonService.refreshToken();
        }

        function registerHandler (handler) {
            vm.handlers.push(handler);
            var removeHandler = function () {
                vm.handlers = vm.handlers.filter(function (aHandler) {
                    return aHandler !== handler;
                });
            };
            return removeHandler;
        }

        function scrollTo (target) {
            $location.hash(target);
            //$anchorScroll();
        }

        function triggerHandlers () {
            angular.forEach(vm.handlers, function (handler) {
                handler();
            });
        }
    }
})();
