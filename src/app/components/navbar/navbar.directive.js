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
        function NavbarController($log, $scope, Idle, commonService) {
            var vm = this;

            vm.isAuthenticated = isAuthenticated;
            vm.getUserAcf = getUserAcf;
            vm.getUserName = getUserName;
            vm.hasAcf = hasAcf;
            vm.logout = logout;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.navCollapse = true;
                Idle.watch();
                $scope.$on('Keepalive', function() {
                    $log.info('Keepalive');
                    commonService.refreshToken();
                });
            }

            function isAuthenticated () {
                return commonService.isAuthenticated();
            }

            function getUserAcf () {
                return commonService.getUserAcf();
            }

            function getUserName () {
                return commonService.getUserName();
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
