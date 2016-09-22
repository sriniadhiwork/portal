(function() {
    'use strict';

    angular
        .module('portal.search')
        .controller('PatientStageController', PatientStageController);

    /** @ngInject */
    function PatientStageController($log, $uibModalInstance, commonService, query) {
        var vm = this;

        vm.cancel = cancel;
        vm.isStageable = isStageable;
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

        function stagePatient () {
            if (vm.isStageable()) {
                var newPatient = {
                    patientRecordIds: [],
                    patient: vm.patient,
                    id: vm.query.id
                };
                if (vm.patient.dateOfBirth && angular.isObject(vm.patient.dateOfBirth)) {
                    vm.patient.dateOfBirth = '' +
                        vm.patient.dateOfBirth.getFullYear() + '-' +
                        pad((vm.patient.dateOfBirth.getMonth() + 1) , 2) + '-' +
                        pad(vm.patient.dateOfBirth.getDate(), 2);
                }
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

        ////////////////////////////////////////////////////////////////////

        function pad(str,len) {
            str = str + '';
            while (str.length < len) {
                str = '0' + str;
            }
            return str;
        }
    }
})();
