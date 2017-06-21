(function () {
    'use strict';

    angular
        .module('portal')
        .directive('aiNames', aiNames);

    /** @ngInject */
    function aiNames () {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/names/names.html',
            scope: {},
            controller: NamesController,
            controllerAs: 'vm',
            bindToController: {
                names: '=?',
                showFormErrors: '=?',
                submitForm: '&',
            },
        };

        return directive;

        /** @ngInject */
        function NamesController (commonService) {
            var vm = this;

            vm.addGiven = addGiven;
            vm.addName = addName;
            vm.displayName = commonService.displayName;
            vm.removeGiven = removeGiven;
            vm.removeName = removeName;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.defaultName = {givenName: [''], nameType: { code: 'L', description: 'Legal Name'} };
                vm.nameTypes = commonService.getNameTypes();
                vm.nameAssemblies = commonService.getNameAssemblies();
                vm.nameRepresentations = commonService.getNameRepresentations();

                if (angular.isUndefined(vm.names)) {
                    vm.names = [angular.copy(vm.defaultName)];
                }
            }

            function addGiven (name) {
                name.givenName.push('');
            }

            function addName () {
                vm.names.push(angular.copy(vm.defaultName));
            }

            function removeGiven (name, index) {
                if (name.givenName.length > 1) {
                    name.givenName.splice(index, 1);
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
