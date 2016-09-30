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
        function NamesController() {
            var vm = this;

            vm.addGiven = addGiven;
            vm.addName = addName;
            vm.displayName = displayName;
            vm.removeGiven = removeGiven;
            vm.removeName = removeName;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.defaultName = {givens: [''], nameType: 'L'};

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

            function displayName (name) {
                var ret = '';
                ret += name.givens.join(' ');
                if (name.nameAssembly === 'F') {
                    ret = name.family + ' ' + ret;
                } else {
                    ret += ' ' + name.family;
                }
                if (name.prefix) {
                    ret = name.prefix + ' ' + ret;
                }
                if (name.suffix) {
                    ret += ' ' + name.suffix;
                }
                if (name.profSuffix) {
                    ret += ', ' + name.profSuffix;
                }
                for (var i = 0; i < vm.nameTypes.length; i++) {
                    if (name.nameType === vm.nameTypes[i].code) {
                        ret += ' (' + vm.nameTypes[i].value + ')';
                    }
                }
                return ret;
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

            ////////////////////////////////////////////////////////////////////

            vm.nameTypes = [
                { code: 'A', value: 'Alias Name' },
                { code: 'B', value: 'Name at Birth' },
                { code: 'C', value: 'Adopted Name' },
                { code: 'D', value: 'Display Name' },
                { code: 'I', value: 'Licensing Name' },
                { code: 'L', value: 'Legal Name' },
                { code: 'M', value: 'Maiden Name' },
                { code: 'N', value: 'Nickname /"Call me" Name/Street Name' },
                { code: 'S', value: 'Coded Pseudo-Name to ensure anonymity' },
                { code: 'T', value: 'Indigenous/Tribal/Community Name' },
                { code: 'U', value: 'Unspecified' }
            ];
        }
    }
})();
