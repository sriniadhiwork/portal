(function () {
    'use strict';

    angular
        .module('portal.search')
        .controller('PatientStageController', PatientStageController);

    /** @ngInject */
    function PatientStageController($filter, $log, $uibModal, $uibModalInstance, commonService, query) {
        var vm = this;

        vm.cancel = cancel;
        vm.clearQuery = clearQuery;
        vm.convertDobString = convertDobString;
        vm.displayNames = displayNames;
        vm.friendlyFullName = friendlyFullName;
        vm.isStageable = isStageable;
        vm.prepopulate = prepopulate;
        vm.selectAll = selectAll;
        vm.stagePatient = stagePatient;
        vm.viewRecordDetails = viewRecordDetails;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.query = query;
            vm.queryForm = {};
            vm.prepopulate();
        }

        function cancel () {
            $uibModalInstance.dismiss('staging cancelled');
        }

        function clearQuery () {
            commonService.clearQuery(vm.query.id).then(function () {
                $uibModalInstance.dismiss('query cleared');
            });
        }
        
        function convertDobString (dob) {
        	return $filter('date')(dob, 'MM/dd/yyyy', 'utc');
        }

        function displayNames (names) {
            return commonService.displayNames(names, '<br />');
        }

        function friendlyFullName (name) {
            return commonService.friendlyFullName(name);
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
        
        

        function prepopulate () {
            vm.patient = {
                dateOfBirth: vm.query.terms.dob,
                dateOfBirthObject: null,
                dateOfBirthString: convertDobString(vm.query.terms.dob),
                fullName: vm.friendlyFullName(vm.query.terms.patientNames[0]),
                gender: vm.query.terms.gender,
                ssn: vm.query.terms.ssn
            };
        }

        function selectAll (location) {
            for (var i = 0; i < location.results.length; i++) {
                location.results[i].selected = !location.results[i].selected;
            }
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
                        vm.patient.dateOfBirth = $filter('date')(vm.patient.dateOfBirthObject, 'yyyy-MM-dd', 'utc');
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
                commonService.stagePatient(newPatient).then(function () {
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
    }
})();
