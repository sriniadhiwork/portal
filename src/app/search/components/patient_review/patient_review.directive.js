(function () {
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

            vm.cancelQueryLocation = cancelQueryLocation;
            vm.clearQuery = clearQuery;
            vm.countComplete = countComplete;
            vm.displayName = displayName;
            vm.displayNames = displayNames;
            vm.getQueries = getQueries;
            vm.getRecordCount = getRecordCount;
            vm.requery = requery;
            vm.requeryLocation = requeryLocation;
            vm.stagePatient = stagePatient;

            vm.TIMEOUT_MILLIS = QueryQueryTimeout * 1000;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.getQueries();
            }

            function cancelQueryLocation (locationStatus) {
                locationStatus.isClearing = true;
                commonService.cancelQueryLocation(locationStatus.queryId, locationStatus.location.id);
            }

            function clearQuery (query) {
                var id = query.id;
                for (var i = 0; i < vm.patientQueries.length; i++) {
                    if (query.id === vm.patientQueries[i].id) {
                        vm.patientQueries.splice(i,1);
                        break;
                    }
                }
                commonService.clearQuery(id).then(function () {
                    vm.getQueries();
                });
            }

            function countComplete (query) {
                var count = 0;
                for (var i = 0; i < query.locationStatuses.length; i++) {
                    if (query.locationStatuses[i].status !== 'Active') {
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
                if (!vm.activeQuery) {
                    getQueryHelper();
                }
            }

            function getRecordCount (query) {
                var recordCount = 0;
                for (var i = 0; i < query.locationStatuses.length; i++) {
                    recordCount += query.locationStatuses[i].results.length;
                }
                return recordCount;
            }

            function requery (query) {
                commonService.searchForPatient(query.terms).then(function () {
                    vm.getQueries();
                });
                vm.clearQuery(query);
            }

            function requeryLocation (location) {
                location.isRequerying = true;
                commonService.requeryLocation(location.queryId, location.location.id).then(function () {
                    vm.getQueries();
                });
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

            ////////////////////////////////////////////////////////////////////

            function getQueryHelper () {
                commonService.getQueries().then(function (response) {
                    var stillActive = false;
                    vm.patientQueries = response;
                    for (var i = 0; i < vm.patientQueries.length; i++) {
                        vm.patientQueries[i].recordCount = vm.getRecordCount(vm.patientQueries[i]);
                        stillActive = stillActive || (vm.patientQueries[i].status === 'Active');
                    }
                    vm.activeQuery = stillActive;
                    if (stillActive) {
                        vm.timeout = $timeout(getQueryHelper, vm.TIMEOUT_MILLIS);
                    }
                });
            }
        }
    }
})();
