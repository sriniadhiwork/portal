(function() {
    'use strict';

    angular
        .module('portal')
        .directive('acmeNavbar', acmeNavbar);

    /** @ngInject */
    function acmeNavbar() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/navbar/navbar.html',
            scope: {},
            controller: NavbarController,
            controllerAs: 'vm',
            bindToController: {
                creationDate: '='
            }
        };

        return directive;

        /** @ngInject */
        function NavbarController(moment) {
            var vm = this;

            vm.relativeDate = moment(vm.creationDate).fromNow();
        }
    }

})();
