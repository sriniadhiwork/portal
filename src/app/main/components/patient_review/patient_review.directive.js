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
            scope: { registerHandler: '&' },
            controller: PatientReviewController,
            controllerAs: 'vm',
            bindToController: {},
            link: function (scope, element, attr, ctrl) {
                var handler = scope.registerHandler({
                    handler: function () {
                        ctrl.getQueries();
                    }
                });
                scope.$on('$destroy', handler);
            }
        };

        return directive;

        /** @ngInject */
        function PatientReviewController($log, $scope, commonService) {
            var vm = this;

            vm.clearQuery = clearQuery;
            vm.isStageable = isStageable;
            vm.getQueries = getQueries;
            vm.getRecordCount = getRecordCount;
            vm.parseTerms = parseTerms;
            vm.setDob = setDob;
            vm.stagePatientRecords = stagePatientRecords;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.getQueries();
            }

            function clearQuery (query) {
                for (var i = 0; i < vm.patientQueries.length; i++) {
                    if (vm.patientQueries[i].id === query.id) {
                        vm.patientQueries.splice(i,1);
                    }
                }
            }

            function isStageable (query) {
                var ret = false;
                for (var i = 0; i < query.orgStatuses.length; i++) {
                    for (var j = 0; j < query.orgStatuses[i].results.length; j++) {
                        ret = ret || query.orgStatuses[i].results[j].selected;
                    }
                }
                return ret;
            }

            function getQueries () {
                commonService.getQueries().then(function (response) {
                    vm.patientQueries = response;
                    for (var i = 0; i < vm.patientQueries.length; i++) {
                        vm.patientQueries[i].terms = angular.copy(vm.parseTerms(vm.patientQueries[i].terms));
                        vm.patientQueries[i].recordCount = vm.getRecordCount(vm.patientQueries[i]);
                    }
                });
            }

            function getRecordCount (query) {
                var recordCount = 0;
                for (var i = 0; i < query.orgStatuses.length; i++) {
                    recordCount += query.orgStatuses[i].results.length;
                }
                return recordCount;
            }

            function parseTerms (terms) {
                return angular.fromJson(terms);
            }

            function setDob (query, dob) {
                if (!query.patient) {
                    query.patient = {};
                }
                query.patient.dateOfBirth = new Date(dob);
            }

            function stagePatientRecords (query) {
                if (vm.isStageable(query)) {
                    var newPatient = {
                        patientRecordIds: [],
                        patient: query.patient,
                        id: query.id
                    };
                    for (var i = 0; i < query.orgStatuses.length; i++) {
                        for (var j = 0; j < query.orgStatuses[i].results.length; j++) {
                            if (query.orgStatuses[i].results[j].selected) {
                                newPatient.patientRecordIds.push(query.orgStatuses[i].results[j].id);
                            }
                        }
                    }
                    commonService.stagePatient(newPatient);
                    vm.clearQuery(query);
                }
            }
        }
    }
})();
