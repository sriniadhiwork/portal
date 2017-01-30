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
            vm.patient.dateOfBirthObject = vm.patient.dateOfBirth;
        }

        function cancel () {
            $uibModalInstance.dismiss('editing cancelled');
        }

        function editPatient () {
            if (angular.isObject(vm.patient.dateOfBirthObject)) {
                vm.patient.dateOfBirth = $filter('date')(vm.patient.dateOfBirthObject, 'yyyy-MM-dd');
            } else {
                vm.patient.dateOfBirth = vm.patient.dateOfBirthObject;
            }
            commonService.editPatient(vm.patient).then(function () {
                $uibModalInstance.close()
            }, function (error) {
                vm.errorMessage = error.data.error;
            });
        }
    }
})();
