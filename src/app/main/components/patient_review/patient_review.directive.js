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
            bindToController: {
                patientQueries: '=',
                patients: '=?'
            }
        };

        return directive;

        /** @ngInject */
        function PatientReviewController($log, commonService) {
            var vm = this;

            vm.clearQuery = clearQuery;
            vm.queryPatientDocuments = queryPatientDocuments;
            vm.selectPatient = selectPatient;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                if (angular.isUndefined(vm.patients)) {
                    vm.patients = [];
                }
            }

            function clearQuery (index) {
                if (index < vm.patientQueries.length) {
                    vm.patientQueries.splice(index,1);
                }
            }

            function queryPatientDocuments (patient) {
                commonService.queryPatientDocuments(patient.id).then(function (response) {
                    patient.documents = response.results;
                });
            }

            function selectPatient (queryIndex, patientIndex) {
                var patient = vm.patientQueries[queryIndex].results[patientIndex];
                vm.queryPatientDocuments(patient);
                vm.patients.push(patient);
                vm.clearQuery(queryIndex);
            }
        }
    }
})();
