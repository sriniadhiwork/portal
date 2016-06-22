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
            vm.logout = logout;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
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

            function logout () {
                commonService.logout();
            }
        }
    }
})();
