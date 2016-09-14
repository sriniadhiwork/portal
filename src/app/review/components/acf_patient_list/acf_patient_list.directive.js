(function() {
    'use strict';

    angular
        .module('portal.review')
        .directive('aiAcfPatientList', aiAcfPatientList);

    /** @ngInject */
    function aiAcfPatientList() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/review/components/acf_patient_list/acf_patient_list.html',
            scope: { registerHandler: '&' },
            controller: AcfPatientListController,
            controllerAs: 'vm',
            bindToController: {
                activeDocument: '=?'
            },
            link: function (scope, element, attr, ctrl) {
                var handler = scope.registerHandler({
                    handler: function () {
                        ctrl.getPatientsAtAcf();
                    }
                });
                scope.$on('$destroy', handler);
            }

        };

        return directive;

        /** @ngInject */
        function AcfPatientListController($log, $timeout, commonService, QueryQueryTimeout) {
            var vm = this;

            vm.cacheDocument = cacheDocument;
            vm.countActive = countActive;
            vm.dischargePatient = dischargePatient;
            vm.getDocument = getDocument;
            vm.getPatientsAtAcf = getPatientsAtAcf;
            vm.getUserAcf = getUserAcf;

            vm.TIMEOUT_MILLIS = QueryQueryTimeout * 1000;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.patients = [];
                vm.getPatientsAtAcf();
            }

            function cacheDocument (patient, doc) {
                commonService.cacheDocument(patient.id, doc.id).then(function () {
                    doc.cached = true;
                    patient.documentStatus.cached += 1;
                });
            }

            function countActive (patient) {
                var active = 0;
                for (var i = 0; i < patient.orgMaps.length; i++) {
                    if (patient.orgMaps[i].documentsQueryStatus === 'ACTIVE')
                        active += 1;
                }
                return active;
            }

            function dischargePatient (patient) {
                commonService.dischargePatient(patient.id).then(function () {
                    vm.getPatientsAtAcf();
                });
            }

            function getDocument (patient, doc) {
                if (!doc.data) {
                    commonService.getDocument(patient.id, doc.id).then(function (response) {
                        doc.data = response.data;
                        vm.activeDocument = doc;
                    });
                } else {
                    vm.activeDocument = doc;
                }
            }

            function getPatientsAtAcf () {
                commonService.getPatientsAtAcf().then(function (response) {
                    var hasActive = false;
                    vm.patients = response;
                    for (var i = 0; i < vm.patients.length; i++) {
                        var patient = vm.patients[i];
                        patient.documentStatus = {total: 0, cached: 0};
                        for (var j = 0; j < patient.orgMaps.length; j++) {
                            hasActive = hasActive || (patient.orgMaps[j].documentsQueryStatus === 'ACTIVE');
                            patient.documentStatus.total += patient.orgMaps[j].documents.length;
                            for (var k = 0; k < patient.orgMaps[j].documents.length; k++) {
                                if (patient.orgMaps[j].documents[k].cached) {
                                    patient.documentStatus.cached += 1;
                                }
                            }
                        }
                    }
                    if (hasActive) {
                        $timeout(vm.getPatientsAtAcf, vm.TIMEOUT_MILLIS);
                    }
                });
            }

            function getUserAcf () {
                return commonService.getUserAcf();
            }
        }
    }
})();
