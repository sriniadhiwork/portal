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

            vm.assembledDob = assembledDob;
            vm.errorCount = errorCount;
            vm.searchForPatient = searchForPatient;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.query = {
                    patientNames: [{givenName: [''], nameType: { code: 'L', description: 'Legal Name'} }],
                    dob: {}
                };
            }

            function assembledDob () {
                return vm.query.dob.year + vm.query.dob.month + vm.query.dob.day;
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
                    vm.query.dob = vm.assembledDob();

                    var queryObj = {query: angular.copy(vm.query)};
                    commonService.searchForPatient(queryObj.query).then(function () {
                        vm.triggerHandlers();
                    }, function (error) {
                        vm.errorMessage = error.data.message;
                    });
                    vm.query = {patientNames: [{givenName: [''], nameType: {code: 'L'}}]};
                    vm.queryForm.$setPristine();
                    vm.queryForm.$setUntouched();
                    vm.showFormErrors = false;
                }
            }
        }
    }
})();
