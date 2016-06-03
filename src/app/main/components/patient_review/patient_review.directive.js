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
                patientResults: '='
            }
        };

        return directive;

        /** @ngInject */
        function PatientReviewController($log, commonService) {
            var vm = this;

            vm.queryPatientDocuments = queryPatientDocuments;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
            }

            function queryPatientDocuments (patient, queryIndex) {
                commonService.queryPatientDocuments(patient.id).then(function (response) {
                    patient.documents = response.results;
                });
                $log.debug(patient.id, queryIndex, vm.patientResults[queryIndex]);
                vm.patientResults[queryIndex].results = [patient];
            }
        }
    }
})();
