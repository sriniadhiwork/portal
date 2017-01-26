(function () {
    'use strict';

    describe('search.aiPatientStage', function () {
        var vm, scope, $log, $uibModal, $q, commonService, mock, actualOptions;

        mock = {query: {"id":13,"userToken":"fake@sample.com","status":"Complete","terms":{"dob":"1999","ssn":"123-12-1234","gender":"M","zip":null,"telephone":null,"addresses":null,"patientNames":[{"id":null,"suffix":null,"prefix":null,"profSuffix":null,"nameType":{"id":null,"code":"L","description":"Legal Name"},"nameRepresentation":null,"nameAssembly":null,"effectiveDate":null,"expirationDate":null,"familyName":"Doe","givenName":["John"]}]},"lastRead":1483642184101,"locationStatuses":[{id:14,queryId:7,locationId:2,status:'Complete',startDate:1469130142755,endDate:1469130535902,success:true,results:[{id:1,givenName:'John',familyName:'Snow',dateOfBirth:413269200000,gender:'M',phoneNumber:'9004783666',address:null,ssn:'451663333'}]},{id:13,queryId:7,locationId:3,status:'Complete',startDate:1469130142749,endDate:1469130535909,success:false,results:[]},{id:15,queryId:7,locationId:1,status:'Complete',startDate:1469130142761,endDate:1469130535907,success:false,results:[]}]}};
        mock.badRequest = {
            status: 500,
            error: 'org.hibernate.exception.DataException: could not execute statement; nested exception is javax.persistence.PersistenceException: org.hibernate.exception.DataException: could not execute statement'
        };
        mock.fakeModal = {
            result: {
                then: function (confirmCallback, cancelCallback) {
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }},
            close: function (item) { this.result.confirmCallBack(item); },
            dismiss: function (type) { this.result.cancelCallback(type); }
        };
        mock.fakeModalOptions = {
            templateUrl: 'app/search/components/patient_stage_details/patient_stage_details.html',
            controller: 'PatientStageDetailsController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'md',
            resolve: {
                record: jasmine.any(Function)
            }
        };
        mock.modalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss')
        };
        mock.name = {
            nameType: { code: 'M', description: 'Maiden Name' },
            familyName: 'Jones',
            givenName: ['Bob']
        };

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.clearQuery = jasmine.createSpy('clearQuery');
                    $delegate.stagePatient = jasmine.createSpy('stagePatient');
                    return $delegate;
                });
            });
            inject(function ($controller, $rootScope, _$log_, _$uibModal_,_$q_, _commonService_) {
                $log = _$log_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return mock.fakeModal;
                });
                $q = _$q_;
                commonService = _commonService_;
                commonService.clearQuery.and.returnValue($q.when({}));
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

        describe('setup', function () {
            it('should prepopulate patient name and gender from query terms', function () {
                expect(vm.patient).toEqual({
                    fullName: 'John Doe',
                    gender: 'M',
                    ssn: '123-12-1234',
                    dateOfBirthObject: null
                });
            });

            xit('should populate dob if the dob has exactly 8 characters', function () {
                vm.query.terms.dob = '19990325';
                vm.prepopulate();
                expect(vm.patient).toEqual({
                    fullName: 'John Doe',
                    gender: 'M',
                    ssn: '123-12-1234',
                    dateOfBirthObject: new Date('1999-03-25')
                });
                vm.query.terms.dob = '1999';
                vm.prepopulate();
                expect(vm.patient).toEqual({
                    fullName: 'John Doe',
                    gender: 'M',
                    ssn: '123-12-1234',
                    dateOfBirthObject: null
                });
            });
        });

        describe('viewing', function () {
            it('should call commonService to display names', function () {
                spyOn(commonService, 'displayNames');
                expect(vm.displayNames).toBeDefined();
                vm.displayNames([mock.name]);
                expect(commonService.displayNames).toHaveBeenCalledWith([mock.name],'<br />');
            });

            it('should call commonService to get the guessed patient name', function () {
                spyOn(commonService, 'friendlyFullName');
                expect(vm.friendlyFullName).toBeDefined();
                vm.friendlyFullName([mock.name]);
                expect(commonService.friendlyFullName).toHaveBeenCalledWith([mock.name]);
            });
        });

        describe('staging a patient', function () {

            var patientStage;

            beforeEach(function () {
                vm.query = angular.copy(mock.query);
                vm.query.locationStatuses[0].results[0].selected = true;
                vm.query.locationStatuses[0].results[1] = {selected: false};
                vm.patient = { givenName: 'Bob', familyName: 'Smith', dateOfBirth: '20130201' };
                patientStage = {
                    patientRecordIds: [1],
                    patient: angular.copy(vm.patient),
                    id: vm.query.id
                }
            });

            describe('staging a query', function () {
                it('should have a function to select multiple patientRecords', function () {
                    expect(vm.stagePatient).toBeDefined();
                });

                it('should call commonService.stagePatient when stagePatient is called', function () {
                    vm.query.locationStatuses[0].results[0].selected = true;
                    vm.stagePatient();
                    scope.$digest();
                    expect(commonService.stagePatient).toHaveBeenCalledWith(patientStage);
                });

                it('should show an error if stage goes wrong', function () {
                    vm.query.locationStatuses[0].results[0].selected = true;
                    commonService.stagePatient.and.returnValue($q.reject({data: mock.badRequest}));
                    vm.stagePatient();
                    scope.$digest();
                    expect(vm.errorMessage).toBe(mock.badRequest.error);
                });

                it('should close the modal after staging the patient', function () {
                    vm.query.locationStatuses[0].results[0].selected = true;
                    vm.stagePatient();
                    expect(mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should not call commonService.stagePatient if there are no selected records', function () {
                    vm.query.locationStatuses[0].results[0].selected = false;
                    vm.stagePatient();
                    expect(commonService.stagePatient).not.toHaveBeenCalled();
                });

                it('should have a function to check if the patient can be staged', function () {
                    expect(vm.isStageable).toBeDefined();
                });

                it('should only be stageable if at least one record is selected', function () {
                    expect(vm.isStageable()).toBe(true);
                    vm.query.locationStatuses[0].results[0].selected = false;
                    expect(vm.isStageable()).toBe(false);
                });

                it('should not be stageable if there are no locationStatuses', function () {
                    delete vm.query.locationStatuses;
                    expect(vm.isStageable()).toBe(false);
                });

                it('should have a way to mark all records at a location as valid', function () {
                    vm.query.locationStatuses[0].results[0].selected = false;
                    vm.selectAll(vm.query.locationStatuses[0]);
                    expect(vm.query.locationStatuses[0].results[0].selected).toBe(true);
                    expect(vm.query.locationStatuses[0].results[1].selected).toBe(true);
                    vm.selectAll(vm.query.locationStatuses[0]);
                    expect(vm.query.locationStatuses[0].results[0].selected).toBe(false);
                    expect(vm.query.locationStatuses[0].results[1].selected).toBe(false);
                });
            });

            describe('clearing a query', function () {
                it('should have a way to clear a query', function () {
                    vm.clearQuery();
                    expect(commonService.clearQuery).toHaveBeenCalledWith(vm.query.id);
                });

                it('should dismiss the modal when a query is called', function () {
                    vm.clearQuery();
                    scope.$digest();
                    expect(mock.modalInstance.dismiss).toHaveBeenCalled();
                });
            });

            describe('viewing record details', function () {
                it('should have a function to view record details', function () {
                    expect(vm.viewRecordDetails).toBeDefined();
                });

                it('should create a modal instance when record details are viewed', function () {
                    expect(vm.viewRecordDetailsInstance).toBeUndefined();
                    vm.viewRecordDetails(vm.query.locationStatuses[0].results[0]);
                    expect(vm.viewRecordDetailsInstance).toBeDefined();
                    expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                    expect(actualOptions.resolve.record()).toEqual(vm.query.locationStatuses[0].results[0]);
                });

                it('should log that the details was closed', function () {
                    var initialCount = $log.info.logs.length;
                    vm.viewRecordDetails(vm.query.locationStatuses[0].results[0]);
                    vm.viewRecordDetailsInstance.close('closed');
                    expect($log.info.logs.length).toBe(initialCount + 1);
                });

                it('should log that the details was closed', function () {
                    var initialCount = $log.info.logs.length;
                    vm.viewRecordDetails(vm.query.locationStatuses[0].results[0]);
                    vm.viewRecordDetailsInstance.dismiss('dismissed');
                    expect($log.info.logs.length).toBe(initialCount + 1);
                });
            });

            describe('housekeeping', function () {
                it('should have a way to close the modal', function () {
                    expect(vm.cancel).toBeDefined();
                    vm.cancel();
                    expect(mock.modalInstance.dismiss).toHaveBeenCalled();
                });
            });

            describe('patient DOB stuff', function () {
                it('should change the dob to millis if it\'s an object', function () {
                    vm.patient.dateOfBirthObject = new Date();
                    vm.stagePatient();
                    expect(typeof(vm.patient.dateOfBirth)).toBe('number');
                });

                it('should make the dob object the correct short string', function () {
                    var dob = new Date('2016-09-01');
                    vm.patient.dateOfBirthObject = dob
                    vm.stagePatient();
                    expect(vm.patient.dateOfBirth).toBe(dob.getTime());
                });

                it('should set the dob to the dobObject if the dobObject is just a string', function () {
                    var dob = '2015-03-01';
                    vm.patient.dateOfBirthObject = dob;
                    vm.stagePatient();
                    expect(vm.patient.dateOfBirth).toBe(new Date(dob).getTime());
                });
            });
        });
    });
})();
