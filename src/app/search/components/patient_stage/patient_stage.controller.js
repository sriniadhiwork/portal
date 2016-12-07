(function() {
    'use strict';

    angular
        .module('portal.search')
        .controller('PatientStageController', PatientStageController);

    /** @ngInject */
    function PatientStageController($log, $uibModal, $uibModalInstance, commonService, query) {
        var vm = this;

        vm.cancel = cancel;
        vm.clearQuery = clearQuery;
        vm.displayNames = displayNames;
        vm.isStageable = isStageable;
        vm.stagePatient = stagePatient;
        vm.viewRecordDetails = viewRecordDetails;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.query = query;
            vm.queryForm = {};
            vm.patient = {};
        }

        function cancel () {
            $uibModalInstance.dismiss('staging cancelled');
        }

        function clearQuery () {
            commonService.clearQuery(vm.query.id).then(function () {
                $uibModalInstance.dismiss('query cleared');
            });
        }

        function displayNames (names) {
            return commonService.displayNames(names, '<br />');
        }

        function isStageable () {
            var ret = false;
            if (vm.query && vm.query.locationStatuses) {
                for (var i = 0; i < vm.query.locationStatuses.length; i++) {
                    for (var j = 0; j < vm.query.locationStatuses[i].results.length; j++) {
                        ret = ret || vm.query.locationStatuses[i].results[j].selected;
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
                if (vm.patient.dateOfBirthObject) {
                    if (angular.isObject(vm.patient.dateOfBirthObject)) {
                        vm.patient.dateOfBirth = '' +
                            vm.patient.dateOfBirthObject.getFullYear() + '-' +
                            pad((vm.patient.dateOfBirthObject.getMonth() + 1) , 2) + '-' +
                            pad(vm.patient.dateOfBirthObject.getDate(), 2);
                    } else {
                        vm.patient.dateOfBirth = vm.patient.dateOfBirthObject;
                    }
                }
                for (var i = 0; i < vm.query.locationStatuses.length; i++) {
                    for (var j = 0; j < vm.query.locationStatuses[i].results.length; j++) {
                        if (vm.query.locationStatuses[i].results[j].selected) {
                            newPatient.patientRecordIds.push(vm.query.locationStatuses[i].results[j].id);
                        }
                    }
                }
                commonService.stagePatient(newPatient).then(function() {
                    $uibModalInstance.close()
                }, function (error) {
                    vm.errorMessage = error.data.error;
                });
            }
        }

        function viewRecordDetails (record) {
            vm.viewRecordDetailsInstance = $uibModal.open({
                templateUrl: 'app/search/components/patient_stage_details/patient_stage_details.html',
                controller: 'PatientStageDetailsController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    record: function () { return record; }
                }
            });
            vm.viewRecordDetailsInstance.result.then(function (response) {
                $log.info(response);
            }, function (result) {
                $log.info(result)
            });
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
