(function() {
    'use strict';

    describe('main.aiPatientReview', function() {
        var $compile, $rootScope, $timeout, $uibModal, vm, el, $log, $q, commonService, mock;
        mock = {queries: [{id:7,userToken:'superego@testshib.org',status:'COMPLETE',terms:"{\"id\":null,\"orgPatientId\":null,\"firstName\":\"d\",\"lastName\":null,\"dateOfBirth\":null,\"gender\":null,\"phoneNumber\":null,\"address\":null,\"ssn\":null,\"acf\":null,\"orgMaps\":[]}",      orgStatuses:[{id:14,queryId:7,orgId:2,status:'COMPLETE',startDate:1469130142755,endDate:1469130535902,success:true,results:[{id:1,firstName:'John',lastName:'Snow',dateOfBirth:413269200000,gender:'M',phoneNumber:'9004783666',address:null,ssn:'451663333'}]},{id:13,queryId:7,orgId:3,status:'COMPLETE',startDate:1469130142749,endDate:1469130535909,success:false,results:[]},{id:15,queryId:7,orgId:1,status:'COMPLETE',startDate:1469130142761,endDate:1469130535907,success:false,results:[]}]},
                          {id:5,userToken:'superego@testshib.org',status:'COMPLETE',terms:"{\"id\":null,\"orgPatientId\":null,\"firstName\":null,\"lastName\":null,\"dateOfBirth\":null,\"gender\":\"Unknown\",\"phoneNumber\":null,\"address\":null,\"ssn\":null,\"acf\":null,\"orgMaps\":[]}",orgStatuses:[{id:8, queryId:5,orgId:2,status:'COMPLETE',startDate:1469128801455,endDate:1469130535943,success:true,results:[]},{id: 7,queryId:5,orgId:3,status:'COMPLETE',startDate:1469128801443,endDate:1469130535940,success:false,results:[]},{id:9, queryId:5,orgId:1,status:'COMPLETE',startDate:1469128801462,endDate:1469130535936,success:false,results:[]}]}]};
        mock.fakeModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }},
            close: function(item) { this.result.confirmCallBack(item); },
            dismiss: function(type) { this.result.cancelCallback(type); }
        };

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.clearQuery = jasmine.createSpy('clearQuery');
                    $delegate.getQueries = jasmine.createSpy('getQueries');
                    $delegate.stagePatient = jasmine.createSpy('stagePatient');
                    return $delegate;
                });
            });
            inject(function(_$compile_, _$rootScope_, _$timeout_, _$log_, _$uibModal_, _$q_, _commonService_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $timeout = _$timeout_;
                $log = _$log_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.returnValue(mock.fakeModal);
                $q = _$q_;
                commonService = _commonService_;
                commonService.clearQuery.and.returnValue($q.when({}));
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

            it('should know how many organizations are complete for a query', function () {
                expect(vm.countComplete).toBeDefined();
                expect(vm.countComplete(vm.patientQueries[0])).toBe(3);
                vm.patientQueries[0].orgStatuses[0].status = 'ACTIVE';
                expect(vm.countComplete(vm.patientQueries[0])).toBe(2);
            });

            describe('refreshing', function () {

                var activeProducts = angular.copy(mock.queries);

                beforeEach(function () {
                    activeProducts = angular.copy(mock.queries);
                    activeProducts[0].status = 'ACTIVE';
                });

                it('should refresh the queries if there is one marked "Active"', function () {
                    expect(commonService.getQueries.calls.count()).toBe(1);
                    $timeout.flush();
                    expect(commonService.getQueries.calls.count()).toBe(1);

                    commonService.getQueries.and.returnValue($q.when(activeProducts));
                    vm.getQueries();
                    el.isolateScope().$digest();
                    expect(commonService.getQueries.calls.count()).toBe(2);
                    $timeout.flush();
                    expect(commonService.getQueries.calls.count()).toBe(3);
                    $timeout.flush();
                    expect(commonService.getQueries.calls.count()).toBe(4);
                    $timeout.flush();
                    expect(commonService.getQueries.calls.count()).toBe(5);

                    activeProducts[0].status = 'COMPLETE';
                    commonService.getQueries.and.returnValue($q.when(activeProducts));
                    $timeout.flush();
                    expect(commonService.getQueries.calls.count()).toBe(6);
                    $timeout.flush();
                    expect(commonService.getQueries.calls.count()).toBe(6);
                });
            });
        });

        describe('clearing queries', function () {

            beforeEach(function () {
                vm.patientQueries = angular.copy(mock.queries);
            });

            it('should have a way to clear patient queries', function () {
                expect(vm.patientQueries.length).toBe(2);
                commonService.getQueries.and.returnValue($q.when(angular.copy(mock.queries).splice(0,1)));

                vm.clearQuery(vm.patientQueries[0]);
                el.isolateScope().$digest();
                expect(vm.patientQueries.length).toBe(1);
            });

            it('should do nothing if the query isn\'t found', function () {
                expect(vm.patientQueries.length).toBe(2);
                var fakeQuery = angular.copy(vm.patientQueries[0]);
                fakeQuery.id = 'fake';
                vm.clearQuery(fakeQuery);
                expect(vm.patientQueries.length).toBe(2);
            });

            it('should call commonService.clearQuery', function () {
                vm.clearQuery(vm.patientQueries[0]);
                expect(commonService.clearQuery).toHaveBeenCalledWith(vm.patientQueries[0].id);
            });
        });

        describe('staging patients', function() {

            it('should have a function to stage patients', function () {
                expect(vm.stagePatient).toBeDefined();
            });

            it('should tell the controller that a patient was staged', function () {
                spyOn(vm,'triggerHandlers');
                vm.stagePatient(vm.patientQueries[0]);
                vm.stagePatientInstance.close();
                expect(vm.triggerHandlers).toHaveBeenCalled();
            });

            it('should not trigger the controller if the modal is dismissed', function () {
                spyOn(vm,'triggerHandlers');
                vm.stagePatient(vm.patientQueries[0]);
                vm.stagePatientInstance.dismiss();
                expect(vm.triggerHandlers).not.toHaveBeenCalled();
            });
        });
    });
})();
