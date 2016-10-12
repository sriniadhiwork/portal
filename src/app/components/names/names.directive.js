(function() {
    'use strict';

    angular
        .module('portal')
        .directive('aiNames', aiNames);

    /** @ngInject */
    function aiNames() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/names/names.html',
            scope: {},
            controller: NamesController,
            controllerAs: 'vm',
            bindToController: {
                names: '=?',
                showFormErrors: '=?',
                submitForm: '&'
            }
        };

        return directive;

        /** @ngInject */
        function NamesController(commonService) {
            var vm = this;

            vm.addGiven = addGiven;
            vm.addName = addName;
            vm.displayName = commonService.displayName;
            vm.removeGiven = removeGiven;
            vm.removeName = removeName;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.defaultName = {givens: [''], nameType: 'L'};
                vm.nameTypes = commonService.nameTypes;

                if (angular.isUndefined(vm.names)) {
                    vm.names = [angular.copy(vm.defaultName)];
                }
            }

            function addGiven (name) {
                name.givens.push('');
            }

            function addName () {
                vm.names.push(angular.copy(vm.defaultName));
            }

            function removeGiven (name, index) {
                if (name.givens.length > 1) {
                    name.givens.splice(index, 1);
                }
            }

            function removeName (index) {
                if (vm.names.length > 1) {
                    vm.names.splice(index, 1);
                }
            }
        }
    }
})();
