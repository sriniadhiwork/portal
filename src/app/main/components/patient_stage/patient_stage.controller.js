(function() {
    'use strict';

    angular
        .module('portal.main')
        .controller('PatientStageController', PatientStageController);

    /** @ngInject */
    function PatientStageController($log, $uibModalInstance, commonService, query) {
        var vm = this;

        vm.cancel = cancel;
        vm.isStageable = isStageable;
        vm.setDob = setDob;
        vm.stagePatient = stagePatient;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.query = query;
            vm.patient = {};
        }

        function cancel () {
            $uibModalInstance.dismiss('Cancelled');
        }

        function isStageable () {
            var ret = false;
            if (vm.query && vm.query.orgStatuses) {
                for (var i = 0; i < vm.query.orgStatuses.length; i++) {
                    for (var j = 0; j < vm.query.orgStatuses[i].results.length; j++) {
                        ret = ret || vm.query.orgStatuses[i].results[j].selected;
                    }
                }
            }
            return ret;
        }

        function setDob (dob) {
            vm.patient.dateOfBirth = new Date(dob);
        }

        function stagePatient () {
            if (vm.isStageable()) {
                var newPatient = {
                    patientRecordIds: [],
                    patient: vm.patient,
                    id: vm.query.id
                };
                for (var i = 0; i < vm.query.orgStatuses.length; i++) {
                    for (var j = 0; j < vm.query.orgStatuses[i].results.length; j++) {
                        if (vm.query.orgStatuses[i].results[j].selected) {
                            newPatient.patientRecordIds.push(vm.query.orgStatuses[i].results[j].id);
                        }
                    }
                }
                commonService.stagePatient(newPatient).then(function() {
                    $uibModalInstance.close()
                });
            }
        }
    }
})();
