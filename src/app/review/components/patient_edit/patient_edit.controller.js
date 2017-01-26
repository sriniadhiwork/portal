(function () {
    'use strict';

    angular
        .module('portal.search')
        .controller('PatientEditController', PatientEditController);

    /** @ngInject */
    function PatientEditController($log, $uibModalInstance, commonService, patient) {
        var vm = this;

        vm.cancel = cancel;
        vm.editPatient = editPatient;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.patient = angular.copy(patient);
            vm.patient.dateOfBirthObject = new Date(vm.patient.dateOfBirth);
        }

        function cancel () {
            $uibModalInstance.dismiss('editing cancelled');
        }

        function editPatient () {
            if (angular.isObject(vm.patient.dateOfBirthObject)) {
                vm.patient.dateOfBirth = vm.patient.dateOfBirthObject.getTime();
            } else {
                vm.patient.dateOfBirth = new Date(vm.patient.dateOfBirthObject).getTime();
            }
            commonService.editPatient(vm.patient).then(function () {
                $uibModalInstance.close()
            }, function (error) {
                vm.errorMessage = error.data.error;
            });
        }
    }
})();
