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
                patientResults: '=',
                activeDocument: '=?'
            }
        };

        return directive;

        /** @ngInject */
        function PatientReviewController($log, commonService) {
            var vm = this;

            vm.activateDocument = activateDocument;
            vm.clearQuery = clearQuery;
            vm.getDocument = getDocument;
            vm.queryPatientDocuments = queryPatientDocuments;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
            }

            function activateDocument (doc) {
                vm.activeDocument = doc;
            }

            function clearQuery (index) {
                if (index < vm.patientResults.length) {
                    vm.patientResults.splice(index,1);
                }
            }

            function getDocument (patient, doc) {
                commonService.getDocument(patient.id, doc.id).then(function (response) {
                    doc.status = 'cached';
                    doc.data = response.data;
                });
            }

            function queryPatientDocuments (patient, queryIndex) {
                commonService.queryPatientDocuments(patient.id).then(function (response) {
                    patient.documents = response.results;
                });
                vm.patientResults[queryIndex].results = [patient];
            }
        }
    }
})();
