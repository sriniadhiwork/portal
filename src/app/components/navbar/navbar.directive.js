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
            vm.getUserAcf = getUserAcf;
            vm.getUsername = getUsername;
            vm.hasAcf = hasAcf;
            vm.logout = logout;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.navCollapse = true;
            }

            function isAuthenticated () {
                return commonService.isAuthenticated();
            }

            function getUserAcf () {
                return commonService.getUserAcf();
            }

            function getUsername () {
                return commonService.getUsername();
            }

            function hasAcf () {
                return commonService.hasAcf();
            }

            function logout () {
                commonService.logout();
            }
        }
    }
})();
