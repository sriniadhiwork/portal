(function () {
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
                vm.baseQuery = {
                    addresses: [{ lines: []}],
                    dobParts: {},
                    patientNames: [{givenName: [], nameType: { code: 'L', description: 'Legal Name'} }]
                };
                vm.query = angular.copy(vm.baseQuery);
            }

            function errorCount () {
                var count = 0,
                    errors = vm.queryForm.$error;

                angular.forEach(errors, function (val) {
                    if (angular.isArray(val)) {
                        count += val.length;
                    }
                });
                return count;
            }

            function searchForPatient () {
                if (!vm.queryForm.$invalid && vm.queryForm.$dirty) {
                    vm.query.dob = vm.query.dobParts.year + vm.query.dobParts.month + vm.query.dobParts.day;

                    var queryObj = {query: angular.copy(vm.query)};
                    commonService.searchForPatient(queryObj.query).then(function () {
                        vm.triggerHandlers();
                        vm.query = angular.copy(vm.baseQuery);

                        vm.queryForm.$setPristine();
                        vm.queryForm.$setUntouched();
                        vm.showFormErrors = false;
                    }, function (error) {
                        vm.errorMessage = error.data.message;
                    });
                }
            }
        }
    }
})();
