(function() {
    'use strict';

    angular
        .module('portal')
        .directive('aiAcf', aiAcf);

    /** @ngInject */
    function aiAcf() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/acf/acf.html',
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
                vm.createNewAcf = false;
                vm.showFormErrors = false;
                vm.isEditing = false;
                vm.getAcfs();
                vm.getUserAcf();
            }

            function acfSubmit () {
                if (vm.createNewAcf) {
                    var newlines = [];
                    for (var i = 0; i < vm.acf.address.lines.length; i++) {
                        if (vm.acf.address.lines[i] !== '') {
                            newlines.push(vm.acf.address.lines[i]);
                        }
                    }
                    if (newlines.length > 0) {
                        vm.acf.address.lines = newlines;
                    } else {
                        delete vm.acf.address.lines;
                    }
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
                vm.getUserAcf();
            }

            function editAcf () {
                commonService.editAcf(vm.acf).then(function (response) {
                    vm.acf = response;
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
                var acf = commonService.getUserAcf();
                if (acf === '') {
                    vm.acf = {address: {}};
                } else {
                    vm.acf = acf;
                }
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
