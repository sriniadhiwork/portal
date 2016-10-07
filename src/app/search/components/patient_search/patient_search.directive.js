(function() {
    'use strict';

    angular
        .module('portal.search')
        .directive('aiPatientSearch', aiPatientSearch);

    /** @ngInject */
    function aiPatientSearch() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/search/components/patient_search/patient_search.html',
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

            function searchForPatient () {
                if (!vm.queryForm.$invalid && vm.queryForm.$dirty) {
                    var queryObj = {query: angular.copy(vm.query)};
                    commonService.searchForPatient(queryObj.query).then(function() {
                        vm.triggerHandlers();
                    });
                    vm.query = {names: [{givens: [''],nameType: 'L'}]};
                    vm.queryForm.$setPristine();
                    vm.queryForm.$setUntouched();
                    vm.showFormErrors = false;
                }
            }
        }
    }
})();
