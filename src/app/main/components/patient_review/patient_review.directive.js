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
        function PatientReviewController($log, $interval, $scope, commonService, QueryQueryInterval) {
            var vm = this;

            vm.clearQuery = clearQuery;
            vm.isStageable = isStageable;
            vm.getQueries = getQueries;
            vm.parseTerms = parseTerms;
            vm.stagePatientRecords = stagePatientRecords;
            vm.stopInterval = stopInterval;

            vm.INTERVAL_MILLIS = QueryQueryInterval * 1000;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.getQueries();
                vm.stop = $interval(vm.getQueries,vm.INTERVAL_MILLIS);
            }

            function clearQuery (index) {
                if (index < vm.patientQueries.length) {
                    vm.patientQueries.splice(index,1);
                }
            }

            function isStageable (queryIndex) {
                var ret = false;
                for (var i = 0; i < vm.patientQueries[queryIndex].orgStatuses.length; i++) {
                    for (var j = 0; j < vm.patientQueries[queryIndex].orgStatuses[i].results.length; j++) {
                        ret = ret || vm.patientQueries[queryIndex].orgStatuses[i].results[j].selected;
                    }
                }
                return ret;
            }

            function getQueries () {
                commonService.getQueries().then(function (response) {
                    vm.patientQueries = response;
                });
            }

            function parseTerms (terms) {
                return angular.fromJson(terms);
            }

            function stagePatientRecords (queryIndex) {
                if (vm.isStageable(queryIndex)) {
                    var newPatient = {
                        patientRecords: [],
                        patient: vm.patientQueries[queryIndex].patient,
                        id: vm.patientQueries[queryIndex].id
                    };
                    for (var i = 0; i < vm.patientQueries[queryIndex].orgStatuses.length; i++) {
                        for (var j = 0; j < vm.patientQueries[queryIndex].orgStatuses[i].results.length; j++) {
                            if (vm.patientQueries[queryIndex].orgStatuses[i].results[j].selected) {
                                newPatient.patientRecords.push(vm.patientQueries[queryIndex].orgStatuses[i].results[j]);
                            }
                        }
                    }
                    commonService.stagePatient(newPatient);
                    vm.clearQuery(queryIndex);
                }
            }

            function stopInterval () {
                if (angular.isDefined(vm.stop)) {
                    $interval.cancel(stop);
                    vm.stop = undefined;
                }
            }

            ////////////////////////////////////////////////////////////////////

            $scope.$on('$destroy', function () {
                vm.stopInterval();
            });

        }
    }
})();
