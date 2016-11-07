(function() {
    'use strict';

    angular
        .module('portal.search')
        .directive('aiPatientReview', aiPatientReview);

    /** @ngInject */
    function aiPatientReview() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/search/components/patient_review/patient_review.html',
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
        function PatientReviewController($log, $scope, $timeout, $uibModal, commonService, QueryQueryTimeout) {
            var vm = this;

            vm.cancelQueryOrganization = cancelQueryOrganization;
            vm.clearQuery = clearQuery;
            vm.countComplete = countComplete;
            vm.displayName = displayName;
            vm.displayNames = displayNames;
            vm.getQueries = getQueries;
            vm.getRecordCount = getRecordCount;
            vm.stagePatient = stagePatient;

            vm.TIMEOUT_MILLIS = QueryQueryTimeout * 1000;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.getQueries();
            }

            function cancelQueryOrganization (orgStatus) {
                orgStatus.isClearing = true;
                commonService.cancelQueryOrganization(orgStatus.queryId, orgStatus.org.id);
            }

            function clearQuery (query) {
                commonService.clearQuery(query.id).then(function () {
                    vm.getQueries();
                });
            }

            function countComplete (query) {
                var count = 0;
                for (var i = 0; i < query.orgStatuses.length; i++) {
                    if (query.orgStatuses[i].status !== 'Active') {
                        count += 1;
                    }
                }
                return count;
            }

            function displayName (name) {
                return commonService.displayName(name);
            }

            function displayNames (names) {
                return commonService.displayNames(names, '<br />');
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
                        $timeout(vm.getQueries, vm.TIMEOUT_MILLIS);
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

            function stagePatient (query) {
                vm.stagePatientInstance = $uibModal.open({
                    templateUrl: 'app/search/components/patient_stage/patient_stage.html',
                    controller: 'PatientStageController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        query: function () { return query; }
                    }
                });
                vm.stagePatientInstance.result.then(function () {
                    vm.triggerHandlers();
                    vm.getQueries();
                }, function (result) {
                    if (result === 'query cleared') {
                        vm.getQueries();
                    }
                    $log.debug('dismissed', result);
                });
            }
        }
    }
})();
