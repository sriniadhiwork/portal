(function () {
    'use strict';

    angular
        .module('portal.review')
        .controller('ReviewController', ReviewController);

    /** @ngInject */
    function ReviewController ($location, $log, commonService) {
        var vm = this;

        vm.hasAcf = hasAcf;
        vm.isAuthenticated = isAuthenticated;
        vm.registerHandler = registerHandler;
        vm.triggerHandlers = triggerHandlers;

        vm.commonService = commonService;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            if (!vm.isAuthenticated()) {
                $location.path('/');
            }
            if (!vm.hasAcf()) {
                $location.path('/');
            }
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
