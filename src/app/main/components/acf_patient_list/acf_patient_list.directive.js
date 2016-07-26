(function() {
    'use strict';

    angular
        .module('portal.main')
        .directive('aiAcfPatientList', aiAcfPatientList);

    /** @ngInject */
    function aiAcfPatientList() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/main/components/acf_patient_list/acf_patient_list.html',
            scope: {},
            controller: AcfPatientListController,
            controllerAs: 'vm',
            bindToController: {
                activeDocument: '=?'
            }
        };

        return directive;

        /** @ngInject */
        function AcfPatientListController($log, commonService) {
            var vm = this;

            vm.cacheDocument = cacheDocument;
            vm.dischargePatient = dischargePatient;
            vm.getDocument = getDocument;
            vm.getUserAcf = getUserAcf;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.patients = [];
                commonService.getPatientsAtAcf().then(function (response) {
                    vm.patients = response;
                });
            }

            function cacheDocument (patient, doc) {
                commonService.cacheDocument(patient.id, doc.id).then(function (response) {
                    doc.cached = response;
                });
            }

            function dischargePatient (index) {
                if (index < vm.patients.length) {
                    vm.patients.splice(index,1);
                }
            }

            function getDocument (patient, doc) {
                commonService.getDocument(patient.id, doc.id).then(function (response) {
                    doc.data = response;
                    vm.activeDocument = doc;
                });
            }

            function getUserAcf () {
                return commonService.getUserAcf();
            }
        }
    }
})();
