(function() {
    'use strict';

    angular
        .module('portal.main')
        .directive('aiOrganizationStatus', aiOrganizationStatus);

    /** @ngInject */
    function aiOrganizationStatus() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/main/components/organization_status/organization_status.html',
            scope: {},
            controller: OrganizationStatusController,
            controllerAs: 'vm',
            bindToController: {}
        };

        return directive;

        /** @ngInject */
        function OrganizationStatusController($log, $interval, $scope, commonService) {
            var vm = this;

            vm.queryOrganizations = queryOrganizations;
            vm.stopInterval = stopInterval;

            vm.INTERVAL_MILLIS = 30000;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.queryOrganizations();
                vm.stop = $interval(vm.queryOrganizations,vm.INTERVAL_MILLIS);
            }

            function queryOrganizations () {
                $log.info('querying');
                commonService.queryOrganizations().then(function (response) {
                    vm.organizations = response.results;
                });
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
