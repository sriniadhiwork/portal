(function () {
    'use strict';

    angular
        .module('portal.search')
        .controller('PatientEditController', PatientEditController);

    /** @ngInject */
    function PatientEditController($filter, $log, $uibModalInstance, commonService, patient) {
        var vm = this;

        vm.cancel = cancel;
        vm.editPatient = editPatient;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.patient = angular.copy(patient);
        }

        function cancel () {
            $uibModalInstance.dismiss('editing cancelled');
        }

        function editPatient () {
            commonService.editPatient(vm.patient).then(function () {
                $uibModalInstance.close(vm.patient)
            }, function (error) {
                vm.errorMessage = error.data.error;
            });
        }
    }
})();
