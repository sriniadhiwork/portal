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
            bindToController: {
                patientQueries: '=?'
            }
        };

        return directive;

        /** @ngInject */
        function PatientSearchController($log, commonService) {
            var vm = this;

            vm.errorCount = errorCount;
            vm.queryPatient = queryPatient;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                if (angular.isUndefined(vm.patientQueries)) {
                    vm.patientQueries = [];
                }
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

            function queryPatient () {
                var queryObj = {query: angular.copy(vm.query)};
                commonService.queryPatient(queryObj.query).then(function (response) {
                    queryObj.records = response.records;
                    vm.patientQueries.push(queryObj);
                });
            }
        }
    }
})();
