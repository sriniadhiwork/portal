(function() {
    'use strict';

    angular
        .module('portal.main')
        .directive('aiPatientReview', aiPatientReview);

    /** @ngInject */
    function aiPatientReview() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/main/components/patient_review/patient_review.html',
            scope: {},
            controller: PatientReviewController,
            controllerAs: 'vm',
            bindToController: {}
        };

        return directive;

        /** @ngInject */
        function PatientReviewController($log, commonService) {
            var vm = this;

            vm.clearQuery = clearQuery;
            vm.isStageable = isStageable;
            vm.getQueries = getQueries;
            vm.stagePatientRecords = stagePatientRecords;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.getQueries();
            }

            function clearQuery (index) {
                if (index < vm.patientQueries.length) {
                    vm.patientQueries.splice(index,1);
                }
            }

            function isStageable (queryIndex) {
                var ret = false;
                for (var i = 0; i < vm.patientQueries[queryIndex].records.length; i++) {
                    ret = ret || vm.patientQueries[queryIndex].records[i].selected;
                }
                return ret;
            }

            function getQueries () {
                commonService.getQueries().then(function (response) {
                    vm.patientQueries = response;
                });
            }

            function stagePatientRecords (queryIndex) {
                if (vm.isStageable(queryIndex)) {
                    var newPatient = {
                        patientRecords: [],
                        patient: vm.patientQueries[queryIndex].patient,
                        id: vm.patientQueries[queryIndex].id
                    };
                    for (var i = 0; i < vm.patientQueries[queryIndex].records.length; i++) {
                        if (vm.patientQueries[queryIndex].records[i].selected) {
                            newPatient.patientRecords.push(vm.patientQueries[queryIndex].records[i].id);
                        }
                    }
                    commonService.stagePatient(newPatient);
                    vm.clearQuery(queryIndex);
                }
            }
        }
    }
})();
