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

            vm.assembledDob = assembledDob;
            vm.errorCount = errorCount;
            vm.searchForPatient = searchForPatient;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.query = {};
            }

            function assembledDob () {
                var newDob = vm.query.dob.year;
                if (vm.query.dob.month) {
                    newDob += vm.query.dob.month;
                    if (vm.query.dob.day) {
                        newDob += vm.query.dob.day;
                        if (vm.query.dob.hour) {
                            newDob += vm.query.dob.hour;
                            if (vm.query.dob.minute) {
                                newDob += vm.query.dob.minute;
                                if (vm.query.dob.second) {
                                    newDob += vm.query.dob.second;
                                }
                            }
                        }
                    }
                }
                if (vm.query.dob.z) {
                    newDob += vm.query.dob.z;
                }
                return newDob;
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

                    //////// debug
                    //vm.query.dob = new Date();
                    //////// end debug

                    vm.query.dob = vm.assembledDob();

                    var queryObj = {query: angular.copy(vm.query)};
                    commonService.searchForPatient(queryObj.query).then(function() {
                        vm.triggerHandlers();
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
