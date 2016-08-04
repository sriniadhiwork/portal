(function() {
    'use strict';

    angular
        .module('portal.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($log, commonService, AuthAPI) {
        var vm = this;

        vm.hasAcf = hasAcf;
        vm.isAuthenticated = isAuthenticated;
        vm.registerHandler = registerHandler;
        vm.triggerHandlers = triggerHandlers;

        vm.commonService = commonService;
        vm.authAction = AuthAPI + '/saml/login?disco=true';

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            commonService.getToken(true);
            vm.handlers = [];
        }

        function hasAcf () {
            return commonService.hasAcf();
        }

        function isAuthenticated () {
            return commonService.isAuthenticated();
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

        function triggerHandlers () {
            angular.forEach(vm.handlers, function (handler) {
                handler();
            });
        }
    }
})();
