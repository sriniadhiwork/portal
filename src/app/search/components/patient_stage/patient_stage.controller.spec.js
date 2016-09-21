(function() {
    'use strict';

    describe('search.aiPatientStage', function() {
        var vm, scope, $log, $q, commonService, mock;
        mock = {query: {id:7,userToken:'superego@testshib.org',status:'COMPLETE',terms:"{\"id\":null,\"orgPatientId\":null,\"givenName\":\"d\",\"familyName\":null,\"dateOfBirth\":null,\"gender\":null,\"phoneNumber\":null,\"address\":null,\"ssn\":null,\"acf\":null,\"orgMaps\":[]}",      orgStatuses:[{id:14,queryId:7,orgId:2,status:'COMPLETE',startDate:1469130142755,endDate:1469130535902,success:true,results:[{id:1,givenName:'John',familyName:'Snow',dateOfBirth:413269200000,gender:'M',phoneNumber:'9004783666',address:null,ssn:'451663333'}]},{id:13,queryId:7,orgId:3,status:'COMPLETE',startDate:1469130142749,endDate:1469130535909,success:false,results:[]},{id:15,queryId:7,orgId:1,status:'COMPLETE',startDate:1469130142761,endDate:1469130535907,success:false,results:[]}]}};
        mock.modalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss')
        };

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.stagePatient = jasmine.createSpy('stagePatient');
                    return $delegate;
                });
            });
            inject(function ($controller, $rootScope, _$log_, _$q_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.stagePatient.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                vm = $controller('PatientStageController', {
                    $scope: scope,
                    $uibModalInstance: mock.modalInstance,
                    query: mock.query
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        describe('staging a patient', function() {

            var patientStage;

            beforeEach(function () {
                vm.query = angular.copy(mock.query);
                vm.query.orgStatuses[0].results[0].selected = true;
                vm.query.orgStatuses[0].results[1] = {selected: false};
                vm.patient = { givenName: 'Bob', familyName: 'Smith', dateOfBirth: '20130201' };
                patientStage = {
                    patientRecordIds: [1],
                    patient: vm.patient,
                    id: vm.query.id
                }
            });

            it('should have a function to select multiple patientRecords', function () {
                expect(vm.stagePatient).toBeDefined();
            });

            it('should call commonService.stagePatient when stagePatient is called', function () {
                vm.query.orgStatuses[0].results[0].selected = true;
                vm.stagePatient();
                scope.$digest();
                expect(commonService.stagePatient).toHaveBeenCalledWith(patientStage);
            });

            it('should close the modal after staging the patient', function () {
                vm.query.orgStatuses[0].results[0].selected = true;
                vm.stagePatient();
                expect(mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should not call commonService.stagePatient if there are no selected records', function () {
                vm.query.orgStatuses[0].results[0].selected = false;
                vm.stagePatient();
                expect(commonService.stagePatient).not.toHaveBeenCalled();
            });

            it('should have a function to check if the patient can be staged', function () {
                expect(vm.isStageable).toBeDefined();
            });

            it('should only be stageable if at least one record is selected', function () {
                expect(vm.isStageable()).toBe(true);
                vm.query.orgStatuses[0].results[0].selected = false;
                expect(vm.isStageable()).toBe(false);
            });

            it('should not be stageable if there are no orgStatuses', function () {
                delete vm.query.orgStatuses;
                expect(vm.isStageable()).toBe(false);
            });

            it('should have a way to close the modal', function () {
                expect(vm.cancel).toBeDefined();
                vm.cancel();
                expect(mock.modalInstance.dismiss).toHaveBeenCalled();
            });

            it('should change the dob to a string if it\'s an object', function () {
                vm.patient.dateOfBirth = new Date();
                vm.stagePatient();
                expect(typeof(vm.patient.dateOfBirth)).toBe('string');
            });

            it('should make the dob object the correct short string', function () {
                vm.patient.dateOfBirth = new Date('2016-09-01');
                vm.stagePatient();
                expect(vm.patient.dateOfBirth).toBe('20160901');
            });
        });
    });
})();
