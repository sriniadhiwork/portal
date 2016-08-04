(function() {
    'use strict';

    describe('main.aiPatientReview', function() {
        var $compile, $rootScope, vm, el, $log, $q, commonService, mock;
        mock = {queries: [{id:7,userToken:'superego@testshib.org',status:'COMPLETE',terms:"{\"id\":null,\"orgPatientId\":null,\"firstName\":\"d\",\"lastName\":null,\"dateOfBirth\":null,\"gender\":null,\"phoneNumber\":null,\"address\":null,\"ssn\":null,\"acf\":null,\"orgMaps\":[]}",      orgStatuses:[{id:14,queryId:7,orgId:2,status:'COMPLETE',startDate:1469130142755,endDate:1469130535902,success:true,results:[{id:1,firstName:'John',lastName:'Snow',dateOfBirth:413269200000,gender:'M',phoneNumber:'9004783666',address:null,ssn:'451663333'}]},{id:13,queryId:7,orgId:3,status:'COMPLETE',startDate:1469130142749,endDate:1469130535909,success:false,results:[]},{id:15,queryId:7,orgId:1,status:'COMPLETE',startDate:1469130142761,endDate:1469130535907,success:false,results:[]}]},
                          {id:5,userToken:'superego@testshib.org',status:'COMPLETE',terms:"{\"id\":null,\"orgPatientId\":null,\"firstName\":null,\"lastName\":null,\"dateOfBirth\":null,\"gender\":\"Unknown\",\"phoneNumber\":null,\"address\":null,\"ssn\":null,\"acf\":null,\"orgMaps\":[]}",orgStatuses:[{id:8, queryId:5,orgId:2,status:'COMPLETE',startDate:1469128801455,endDate:1469130535943,success:true,results:[]},{id: 7,queryId:5,orgId:3,status:'COMPLETE',startDate:1469128801443,endDate:1469130535940,success:false,results:[]},{id:9, queryId:5,orgId:1,status:'COMPLETE',startDate:1469128801462,endDate:1469130535936,success:false,results:[]}]}]};

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getQueries = jasmine.createSpy('getQueries');
                    $delegate.stagePatient = jasmine.createSpy('stagePatient');
                    return $delegate;
                });
            });
            inject(function(_$compile_, _$rootScope_, _$log_, _$q_, _commonService_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.getQueries.and.returnValue($q.when(mock.queries));
                commonService.stagePatient.and.returnValue($q.when({}));

                el = angular.element('<ai-patient-review></ai-patient-review>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function () {
            expect(vm).toEqual(jasmine.any(Object));
        });

        describe('finding queries', function () {

            it('should have a function to find a user\'s queries', function () {
                expect(vm.getQueries).toBeDefined();
            });

            it('should get queries for a user at login', function () {
                expect(commonService.getQueries).toHaveBeenCalled();
                expect(vm.patientQueries.length).toBe(2);
            });

            it('should know how many patientRecords were found for a query', function () {
                expect(vm.getRecordCount).toBeDefined();
                expect(vm.getRecordCount(vm.patientQueries[0])).toBe(1);
            });

            it('should put the recordCount into the query at load', function () {
                expect(vm.patientQueries[0].recordCount).toBe(1);
                expect(vm.patientQueries[1].recordCount).toBe(0);
            });
        });

        describe('clearing queries', function () {

            beforeEach(function () {
                vm.patientQueries = angular.copy(mock.queries);
            });

            it('should have a way to clear patient queries', function () {
                expect(vm.patientQueries.length).toBe(2);
                vm.clearQuery(vm.patientQueries[0]);
                expect(vm.patientQueries.length).toBe(1);
            });
        });

        describe('staging patients', function() {

            var patientStage;

            beforeEach(function () {
                vm.patientQueries = angular.copy(mock.queries);
                vm.patientQueries[0].orgStatuses[0].results[0].selected = true;
                vm.patientQueries[0].orgStatuses[0].results[1] = {selected: false};
                vm.patientQueries[0].patient = { firstName: 'Bob', lastName: 'Smith' };
                patientStage = {
                    patientRecordIds: [1],
                    patient: vm.patientQueries[0].patient,
                    id: vm.patientQueries[0].id
                }
            });

            it('should have a function to select multiple patientRecords', function () {
                expect(vm.stagePatientRecords).toBeDefined();
            });

            it('should remove a staged query when selected', function () {
                vm.stagePatientRecords(vm.patientQueries[0]);
                expect(vm.patientQueries.length).toBe(1);
            });

            it('should call commonService.stagePatient when stagePatientRecords is called', function () {
                vm.patientQueries[0].orgStatuses[0].results[0].selected = true;
                vm.stagePatientRecords(vm.patientQueries[0]);
                expect(commonService.stagePatient).toHaveBeenCalledWith(patientStage);
            });

            it('should not call commonService.stagePatient if there are no selected records', function () {
                vm.patientQueries[0].orgStatuses[0].results[0].selected = false;
                vm.stagePatientRecords(vm.patientQueries[0]);
                expect(commonService.stagePatient).not.toHaveBeenCalled();
            });

            it('should not remove the query if there are no selected records', function () {
                vm.patientQueries[0].orgStatuses[0].results[0].selected = false;
                vm.stagePatientRecords(vm.patientQueries[0]);
                expect(vm.patientQueries.length).not.toBe(0);
            });

            it('should have a function to check if the patient can be staged', function () {
                expect(vm.isStageable).toBeDefined();
            });

            it('should only be stageable if at least one record is selected', function () {
                expect(vm.isStageable(vm.patientQueries[0])).toBe(true);
                vm.patientQueries[0].orgStatuses[0].results[0].selected = false;
                expect(vm.isStageable(vm.patientQueries[0])).toBe(false);
            });

            it('should have a way to set the truePatient date of birth', function () {
                expect(vm.setDob).toBeDefined();
                vm.setDob(vm.patientQueries[0], 413269200000);
                expect(vm.patientQueries[0].patient.dateOfBirth.getTime()).toBe(413269200000);
            });

            it('should create a patient on setDob if one doesn\'t exist', function () {
                delete vm.patientQueries[0].patient;
                vm.setDob(vm.patientQueries[0], 413269200000);
                expect(vm.patientQueries[0].patient.dateOfBirth.getTime()).toBe(413269200000);
            });

            it('should tell the controller that a patient was staged', function () {
                spyOn(vm,'triggerHandlers');
                vm.stagePatientRecords(vm.patientQueries[0]);
                el.isolateScope().$digest();
                expect(vm.triggerHandlers).toHaveBeenCalled();
            });
        });
    });
})();
