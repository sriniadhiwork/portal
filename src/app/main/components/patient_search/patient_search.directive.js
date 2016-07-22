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
            scope: {},
            controller: PatientSearchController,
            controllerAs: 'vm',
            bindToController: {}
        };

        return directive;

        /** @ngInject */
        function PatientSearchController($log, commonService) {
            var vm = this;

            vm.errorCount = errorCount;
            vm.searchForPatient = searchForPatient;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
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

            function searchForPatient () {
                var queryObj = {query: angular.copy(vm.query)};
                commonService.searchForPatient(queryObj.query);
            }
        }
    }
})();
