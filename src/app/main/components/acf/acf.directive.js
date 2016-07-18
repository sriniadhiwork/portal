(function() {
    'use strict';

    angular
        .module('portal.main')
        .directive('aiAcf', aiAcf);

    /** @ngInject */
    function aiAcf() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/main/components/acf/acf.html',
            scope: {},
            controller: AcfController,
            controllerAs: 'vm',
            bindToController: {}
        };

        return directive;

        /** @ngInject */
        function AcfController($log, commonService) {
            var vm = this;

            vm.acfSubmit = acfSubmit;
            vm.cancelEditing = cancelEditing;
            vm.editAcf = editAcf;
            vm.getAcfs = getAcfs;
            vm.getUserAcf = getUserAcf;
            vm.hasAcf = hasAcf;
            vm.submitForm = submitForm;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.getAcfs();
                vm.acf = vm.getUserAcf();
                vm.isEditing = false;
            }

            function acfSubmit () {
                if (vm.createNewAcf) {
                    commonService.createAcf(vm.acf).then(function (response) {
                        commonService.setAcf(response);
                    });
                } else {
                    if (vm.selectAcf) {
                        commonService.setAcf(vm.selectAcf);
                    }
                }
            }

            function cancelEditing () {
                vm.isEditing = false;
                vm.acf = vm.getUserAcf();
            }

            function editAcf () {
                commonService.editAcf(vm.acf).then(function (response) {
                    vm.acf = response.acf;
                });
                vm.isEditing = false;
            }

            function getAcfs () {
                vm.acfs = [];
                commonService.getAcfs().then(function (response) {
                    vm.acfs = vm.acfs.concat(response);
                    if (vm.acfs.length === 0) {
                        vm.createNewAcf = true;
                    }
                },function () {
                    vm.acfs = [];
                    vm.createNewAcf = true;
                });
            }

            function getUserAcf () {
                return commonService.getUserAcf();
            }

            function hasAcf () {
                return commonService.hasAcf();
            }

            function submitForm () {
                if (!vm.queryForm.$invalid) {
                    if (vm.hasAcf()) {
                        vm.editAcf();
                    } else {
                        vm.acfSubmit();
                    }
                }
            }
        }
    }
})();
