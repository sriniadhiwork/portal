(function() {
    'use strict';

    angular
        .module('portal.main')
        .directive('aiPatientSearch', aiPatientSearch);

    /** @ngInject */
    function aiPatientSearch() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/main/components/patient_search/patient_search.html',
            scope: { },
            controller: PatientSearchController,
            controllerAs: 'vm',
            bindToController: { triggerHandlers: '&' }
        };

        return directive;

        /** @ngInject */
        function PatientSearchController($log, commonService) {
            var vm = this;

            vm.errorCount = errorCount;
            vm.hasSearchTerm = hasSearchTerm;
            vm.searchForPatient = searchForPatient;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.query = {};
            }

            function errorCount () {
                var count = 0,
                    errors = vm.queryForm.$error;

                angular.forEach(errors, function(val){
                    if (angular.isArray(val)) {
                        count += val.length;
                    }
                });
                return count;
            }

            function hasSearchTerm () {
                var ret = false;
                ret = ret || (vm.query.firstName && vm.query.firstName.length > 0)
                    || (vm.query.lastName && vm.query.lastName.length > 0)
                    || (vm.query.dob)
                    || (vm.query.gender && vm.query.gender.length > 0)
                    || (vm.query.ssn && vm.query.ssn.length > 0)
                    || (vm.query.homeZip && vm.query.homeZip.length > 0);
                return ret;
            }

            function searchForPatient () {
                if (hasSearchTerm()) {
                    var queryObj = {query: angular.copy(vm.query)};
                    commonService.searchForPatient(queryObj.query);
                    vm.triggerHandlers();
                    vm.query = {};
                }
            }
        }
    }
})();
