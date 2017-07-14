(function () {
    'use strict';

    angular
        .module('portal')
        .directive('aiLocationStatus', aiLocationStatus);

    /** @ngInject */
    function aiLocationStatus () {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/location_status/location_status.html',
            scope: {},
            controller: LocationStatusController,
            controllerAs: 'vm',
            bindToController: {},
        };

        return directive;

        /** @ngInject */
        function LocationStatusController ($interval, $log, $scope, LocationQueryInterval, commonService) {
            var vm = this;

            vm.getLocationStatistics = getLocationStatistics;
            vm.isAuthenticated = commonService.isAuthenticated;
            vm.stopIntervalStatistics = stopIntervalStatistics;

            vm.INTERVAL_MILLIS = LocationQueryInterval * 1000;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.hidePanel = true;
                vm.getLocationStatistics();
                vm.stopStatistics = $interval(vm.getLocationStatistics,vm.INTERVAL_MILLIS);
            }

            function getLocationStatistics () {
                if (vm.isAuthenticated()) {
                    commonService.getLocationStatistics().then(function (response) {
                        vm.locationStatistics = response;
                        for (var i = 0; i < vm.locationStatistics.length; i++) {
                            if (vm.locationStatistics[i].patientDiscoveryStats.requestCount > 0) {
                                vm.locationStatistics[i].statistics = { type: 'PieChart'};
                                vm.locationStatistics[i].statistics.options = {
                                    title: vm.locationStatistics[i].location.name + ' (average response time: ' + vm.locationStatistics[i].patientDiscoveryStats.requestAvgCompletionSeconds + 's)',
                                    is3D: true,
                                };
                                vm.locationStatistics[i].statistics.data = {
                                    cols: [
                                        { id: 's', label: 'Status', type: 'string' },
                                        { id: 'c', label: 'Count', type: 'number' },
                                    ],
                                    rows: [
                                        { c: [{ v: 'Success'}, { v: vm.locationStatistics[i].patientDiscoveryStats.requestSuccessCount}]},
                                        { c: [{ v: 'Failed'}, { v: vm.locationStatistics[i].patientDiscoveryStats.requestFailureCount}]},
                                        { c: [{ v: 'Cancelled'}, { v: vm.locationStatistics[i].patientDiscoveryStats.requestCancelledCount}]},
                                    ],
                                };
                            } else {
                                vm.locationStatistics[i].statistics = null;
                            }
                        }
                    });
                }
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
