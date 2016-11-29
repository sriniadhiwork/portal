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

            vm.activatePatient = activatePatient;
            vm.cacheDocument = cacheDocument;
            vm.countActive = countActive;
            vm.deactivatePatient = deactivatePatient;
            vm.dischargePatient = dischargePatient;
            vm.displayName = commonService.displayName;
            vm.getDocument = getDocument;
            vm.getPatientsAtAcf = getPatientsAtAcf;
            vm.getUserAcf = getUserAcf;
            vm.translateDate = translateDate;

            vm.TIMEOUT_MILLIS = QueryQueryTimeout * 1000;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.activePatient = null;
                vm.patients = [];
                vm.getPatientsAtAcf();
                vm.userAcf = commonService.getUserAcf();
            }

            function activatePatient (patient) {
                vm.activePatient = angular.copy(patient);
                buildTitle();
            }

            function cacheDocument (patient, doc) {
                doc.pending = true;
                if (!doc.cached) {
                    commonService.cacheDocument(patient.id, doc.id).then(function () {
                        doc.cached = true;
                        doc.pending = false;
                        patient.documentStatus.cached += 1;
                    });
                }
            }

            function countActive (patient) {
                var active = 0;
                for (var i = 0; i < patient.locationMaps.length; i++) {
                    if (patient.locationMaps[i].documentsQueryStatus === 'Active')
                        active += 1;
                }
                return active;
            }

            function deactivatePatient () {
                vm.activePatient = null;
                delete vm.activeDocument;
                vm.getPatientsAtAcf();
                buildTitle();
            }

            function dischargePatient (patient) {
                commonService.dischargePatient(patient.id).then(function () {
                    vm.getPatientsAtAcf();
                });
                vm.deactivatePatient();
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
                        patient.documents = [];
                        for (var j = 0; j < patient.locationMaps.length; j++) {
                            hasActive = hasActive || (patient.locationMaps[j].documentsQueryStatus === 'Active');
                            patient.documentStatus.total += patient.locationMaps[j].documents.length;
                            for (var k = 0; k < patient.locationMaps[j].documents.length; k++) {
                                patient.locationMaps[j].documents[k].location = patient.locationMaps[j].location.name;
                                patient.documents.push(patient.locationMaps[j].documents[k]);
                                if (patient.locationMaps[j].documents[k].cached) {
                                    patient.documentStatus.cached += 1;
                                }
                            }
                        }
                    }
                    buildTitle();
                    if (hasActive) {
                        $timeout(vm.getPatientsAtAcf, vm.TIMEOUT_MILLIS);
                    } else {
                        $timeout(vm.getPatientsAtAcf, vm.TIMEOUT_MILLIS * 10);
                    }
                });
            }

            function getUserAcf () {
                return vm.userAcf;
            }

            function translateDate (input) {
                input = '' + input;
                var ret = input.substring(0, 4) + '-' + input.substring(4, 6) + '-' + input.substring(6);
                return ret;
            }

            ////////////////////////////////////////////////////////////////////

            function buildTitle () {
                if (vm.activePatient) {
                    vm.panelTitle = 'Patient: ' + vm.activePatient.fullName + ' (' + vm.activePatient.friendlyName + ')';
                } else {
                    vm.panelTitle = vm.patients.length + ' Active Patient';
                    if (vm.patients.length !== 1)
                        vm.panelTitle += 's';
                    vm.panelTitle += ' at ' + vm.userAcf.name;
                }
            }
        }
    }
})();
