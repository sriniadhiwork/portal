(function() {
    'use strict';

    angular
        .module('portal')
        .directive('aiNavbar', aiNavbar);

    /** @ngInject */
    function aiNavbar() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/navbar/navbar.html',
            scope: {},
            controller: NavbarController,
            controllerAs: 'vm',
            bindToController: {
                active: '@'
            }
        };

        return directive;

        /** @ngInject */
        function NavbarController($log, commonService) {
            var vm = this;

            vm.isAuthenticated = isAuthenticated;

            ////////////////////////////////////////////////////////////////////

            function isAuthenticated () {
                return commonService.isAuthenticated();
            }
        }
    }
})();
