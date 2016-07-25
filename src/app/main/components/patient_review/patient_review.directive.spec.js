(function() {
    'use strict';

    describe('main.aiPatientReview', function() {
        var $compile, $rootScope, vm, el, $log, $q, commonService, mock;
        mock = {queries: [{id:7,userToken:'superego@testshib.org',status:'COMPLETE',terms:"{\"id\":null,\"orgPatientId\":null,\"firstName\":\"d\",\"lastName\":null,\"dateOfBirth\":null,\"gender\":null,\"phoneNumber\":null,\"address\":null,\"ssn\":null,\"acf\":null,\"orgMaps\":[]}",      orgStatuses:[{id:14,queryId:7,orgId:2,status:'COMPLETE',startDate:1469130142755,endDate:1469130535902,success:true,results:[]},{id:13,queryId:7,orgId:3,status:'COMPLETE',startDate:1469130142749,endDate:1469130535909,success:false,results:[]},{id:15,queryId:7,orgId:1,status:'COMPLETE',startDate:1469130142761,endDate:1469130535907,success:false,results:[]}]},
                          {id:5,userToken:'superego@testshib.org',status:'COMPLETE',terms:"{\"id\":null,\"orgPatientId\":null,\"firstName\":null,\"lastName\":null,\"dateOfBirth\":null,\"gender\":\"Unknown\",\"phoneNumber\":null,\"address\":null,\"ssn\":null,\"acf\":null,\"orgMaps\":[]}",orgStatuses:[{id:8, queryId:5,orgId:2,status:'COMPLETE',startDate:1469128801455,endDate:1469130535943,success:true,results:[]},{id: 7,queryId:5,orgId:3,status:'COMPLETE',startDate:1469128801443,endDate:1469130535940,success:false,results:[]},{id:9, queryId:5,orgId:1,status:'COMPLETE',startDate:1469128801462,endDate:1469130535936,success:false,results:[]}]}]};

        mock.terms = "{\"id\":null,\"orgPatientId\":null,\"firstName\":null,\"lastName\":null,\"dateOfBirth\":null,\"gender\":\"Unknown\",\"phoneNumber\":null,\"address\":null,\"ssn\":null,\"acf\":null,\"orgMaps\":[]}";
        mock.parsedTerms = {id: null, orgPatientId: null, firstName: null, lastName: null, dateOfBirth: null, gender: 'Unknown', phoneNumber: null, address: null, ssn: null, acf: null, orgMaps: []};

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
                commonService.stagePatient.and.returnValue({});

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

            it('should parse the terms', function () {
                expect(vm.parseTerms).toBeDefined();
                expect(vm.parseTerms(mock.terms)).toEqual(mock.parsedTerms);
            });
        });

        describe('clearing queries', function () {

            beforeEach(function () {
                vm.patientQueries = angular.copy(mock.queries);
            });

            it('should have a way to clear patient queries', function () {
                expect(vm.patientQueries.length).toBe(2);
                vm.clearQuery(0);
                expect(vm.patientQueries.length).toBe(1);
            });

            it('should not try to clear an out of bounds query', function () {
                expect(vm.patientQueries.length).toBe(2);
                vm.clearQuery(3);
                expect(vm.patientQueries.length).toBe(2);
            });
        });

        describe('staging patients', function() {

            var patientQuery;

            beforeEach(function () {
                vm.patientQueries = angular.copy(mock.queries);
                vm.patientQueries[0].orgStatuses[0].results[0] = {selected: true};
                vm.patientQueries[0].orgStatuses[0].results[1] = {selected: false};
                vm.patientQueries[0].patient = { firstName: 'Bob', lastName: 'Smith' };
                patientQuery = { patientRecords: [{selected: true}], id: 7 };
                patientQuery.patient = vm.patientQueries[0].patient;
            });

            it('should have a function to select multiple patientRecords', function () {
                expect(vm.stagePatientRecords).toBeDefined();
            });

            it('should remove a staged query when selected', function () {
                vm.stagePatientRecords(0);
                expect(vm.patientQueries.length).toBe(1);
            });

            it('should call commonService.stagePatient when stagePatientRecords is called', function () {
                vm.patientQueries[0].orgStatuses[0].results[0].selected = true;
                vm.stagePatientRecords(0);
                expect(commonService.stagePatient).toHaveBeenCalledWith(patientQuery);
            });

            it('should not call commonService.stagePatient if there are no selected records', function () {
                vm.patientQueries[0].orgStatuses[0].results[0].selected = false;
                vm.stagePatientRecords(0);
                expect(commonService.stagePatient).not.toHaveBeenCalled();
            });

            it('should not remove the query if there are no selected records', function () {
                vm.patientQueries[0].orgStatuses[0].results[0].selected = false;
                vm.stagePatientRecords(0);
                expect(vm.patientQueries.length).not.toBe(0);
            });

            it('should have a function to check if the patient can be staged', function () {
                expect(vm.isStageable).toBeDefined();
            });

            it('should only be stageable if at least one record is selected', function () {
                expect(vm.isStageable(0)).toBe(true);
                vm.patientQueries[0].orgStatuses[0].results[0].selected = false;
                expect(vm.isStageable(0)).toBe(false);
            });
        });
    });
})();
