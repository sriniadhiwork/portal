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
            bindToController: {
                triggerHandlers: '&'
            },
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
        function PatientReviewController($log, $scope, $timeout, commonService, QueryQueryTimeout) {
            var vm = this;

            vm.clearQuery = clearQuery;
            vm.countComplete = countComplete;
            vm.isStageable = isStageable;
            vm.getQueries = getQueries;
            vm.getRecordCount = getRecordCount;
            vm.setDob = setDob;
            vm.stagePatientRecords = stagePatientRecords;

            vm.TIMEOUT_MILLIS = QueryQueryTimeout * 1000;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.getQueries();
            }

            function clearQuery (query) {
                commonService.clearQuery(query.id).then(function () {
                    vm.getQueries();
                });
            }

            function countComplete (query) {
                var count = 0;
                for (var i = 0; i < query.orgStatuses.length; i++) {
                    if (query.orgStatuses[i].status === 'COMPLETE') {
                        count += 1;
                    }
                }
                return count;
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
                    var hasActive = false;
                    vm.patientQueries = response;
                    for (var i = 0; i < vm.patientQueries.length; i++) {
                        vm.patientQueries[i].recordCount = vm.getRecordCount(vm.patientQueries[i]);
                        hasActive = hasActive || (vm.patientQueries[i].status === 'ACTIVE');
                    }
                    if (hasActive) {
                        $timeout(vm.getQueries,vm.TIMEOUT_MILLIS);
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
                    commonService.stagePatient(newPatient).then(function() {
                        vm.triggerHandlers();
                    });
                    vm.getQueries();
                }
            }
        }
    }
})();
