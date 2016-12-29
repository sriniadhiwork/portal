(function() {
    'use strict';

    angular
        .module('portal')
        .directive('aiAddresses', aiAddresses);

    /** @ngInject */
    function aiAddresses() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/addresses/addresses.html',
            scope: {},
            controller: AddressesController,
            controllerAs: 'vm',
            bindToController: {
                addresses: '=?',
                fixed: '=?',
                maxLines: '=?',
                single: '=?',
                submitForm: '&'
            }
        };

        return directive;

        /** @ngInject */
        function AddressesController() {
            var vm = this;

            vm.addAddress = addAddress;
            vm.addLine = addLine;
            vm.canAddLines = canAddLines;
            vm.removeAddress = removeAddress;
            vm.removeLine = removeLine;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                if (angular.isUndefined(vm.addresses)) {
                    vm.addresses = [{}];
                }
                for (var i = 0; i < vm.addresses.length; i++) {
                    if (angular.isUndefined(vm.addresses[i].lines) || vm.addresses[i].lines.length < 1) {
                        vm.addresses[i].lines = [''];
                    }
                }
            }

            function addAddress () {
                vm.addresses.push({lines: ['']});
            }

            function addLine (address) {
                address.lines.push('');
            }

            function canAddLines (address) {
                if (!vm.maxLines) {
                    return true;
                }
                return address.lines.length < vm.maxLines;
            }

            function removeAddress (index) {
                if (vm.addresses.length > 1) {
                    vm.addresses.splice(index, 1);
                }
            }

            function removeLine (address, index) {
                if (address.lines.length > 1) {
                    address.lines.splice(index, 1);
                }
            }
        }
    }
})();
