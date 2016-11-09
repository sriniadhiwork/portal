(function() {
    'use strict';

    angular
        .module('portal')
        .directive('aiOrganizationStatus', aiOrganizationStatus);

    /** @ngInject */
    function aiOrganizationStatus() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/organization_status/organization_status.html',
            scope: {},
            controller: OrganizationStatusController,
            controllerAs: 'vm',
            bindToController: {}
        };

        return directive;

        /** @ngInject */
        function OrganizationStatusController($log, $interval, $scope, commonService, OrganizationQueryInterval) {
            var vm = this;

            vm.getOrganizationStatistics = getOrganizationStatistics;
            vm.stopIntervalStatistics = stopIntervalStatistics;

            vm.INTERVAL_MILLIS = OrganizationQueryInterval * 1000;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.hidePanel = true;
                vm.getOrganizationStatistics();
                vm.stopStatistics = $interval(vm.getOrganizationStatistics,vm.INTERVAL_MILLIS);
            }

            function getOrganizationStatistics () {
                commonService.getOrganizationStatistics().then(function (response) {
                    vm.organizationStatistics = response;
                    for (var i = 0; i < vm.organizationStatistics.length; i++) {
                        if (vm.organizationStatistics[i].patientDiscoveryStats.requestCount > 0) {
                            vm.organizationStatistics[i].statistics = { type: 'PieChart'};
                            vm.organizationStatistics[i].statistics.options = {
                                title: vm.organizationStatistics[i].org.name + ' (average response time: ' + vm.organizationStatistics[i].patientDiscoveryStats.requestAvgCompletionSeconds + 's)',
                                is3D: true
                            };
                            vm.organizationStatistics[i].statistics.data = { cols: [{ id: 's', label: 'Status', type: 'string' },
                                                                                    { id: 'c', label: 'Count', type: 'number' }],
                                                                             rows: [{ c: [{ v: 'Success'}, { v: vm.organizationStatistics[i].patientDiscoveryStats.requestSuccessCount}]},
                                                                                    { c: [{ v: 'Failed'}, { v: vm.organizationStatistics[i].patientDiscoveryStats.requestFailureCount}]},
                                                                                    { c: [{ v: 'Cancelled'}, { v: vm.organizationStatistics[i].patientDiscoveryStats.requestCancelledCount}]}]};
                        } else {
                            vm.organizationStatistics[i].statistics = null;
                        }
                    }
                });
            }

            function stopIntervalStatistics () {
                if (angular.isDefined(vm.stopStatistics)) {
                    $interval.cancel(vm.stopStatistics);
                    vm.stopStatistics = undefined;
                }
            }

            ////////////////////////////////////////////////////////////////////

            $scope.$on('$destroy', function () {
                vm.stopIntervalStatistics();
            });
        }
    }
})();
