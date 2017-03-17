(function () {
    'use strict';

    describe('search.aiPatientStage', function () {
        var vm, scope, $log, $uibModal, $q, commonService, mock, Mock, actualOptions;

        mock = {};
        mock.badRequest = {
            status: 500,
            error: 'org.hibernate.exception.DataException: could not execute statement; nested exception is javax.persistence.PersistenceException: org.hibernate.exception.DataException: could not execute statement'
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
        mock.queriedPatient = {
            dateOfBirth: '19910405',
            dateOfBirthParts: { year: '1991', month: '04', day: '05' },
            fullName: 'Bob Jones',
            gender: 'M',
            ssn: '123-12-1234'
        };

        beforeEach(function () {
            module('pulse.mock', 'portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.clearQuery = jasmine.createSpy('clearQuery');
                    $delegate.stagePatient = jasmine.createSpy('stagePatient');
                    return $delegate;
                });
            });
            inject(function ($controller, $rootScope, _$log_, _$uibModal_,_$q_, _commonService_, _Mock_) {
                $log = _$log_;
                $uibModal = _$uibModal_;
                $q = _$q_;
                Mock = _Mock_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                commonService = _commonService_;
                commonService.clearQuery.and.returnValue($q.when({}));
                commonService.stagePatient.and.returnValue($q.when({}));
                mock.query = Mock.queries[1];
                mock.queriedPatient.dateOfBirthString = commonService.convertDobString(mock.queriedPatient.dateOfBirth),
                mock.fakeModalOptions = Mock.fakeModalOptions;
                mock.fakeModalOptions.templateUrl = 'app/search/components/patient_stage_details/patient_stage_details.html';
                mock.fakeModalOptions.controller = 'PatientStageDetailsController';
                mock.fakeModalOptions.size = 'md';
                mock.fakeModalOptions.resolve = {
                    record: jasmine.any(Function)
                }

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
            it('should prepopulate patient name and gender and dob from query terms', function () {
                expect(vm.patient).toEqual(mock.queriedPatient);
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
                vm.query.endpointStatuses[1].results[0].selected = true;
                vm.query.endpointStatuses[1].results[1] = {selected: false};
                vm.patient = angular.copy(mock.queriedPatient);
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
                    vm.query.endpointStatuses[1].results[0].selected = true;
                    vm.stagePatient();
                    scope.$digest();
                    expect(commonService.stagePatient).toHaveBeenCalledWith(patientStage);
                });

                it('should show an error if stage goes wrong', function () {
                    vm.query.endpointStatuses[1].results[0].selected = true;
                    commonService.stagePatient.and.returnValue($q.reject({data: mock.badRequest}));
                    vm.stagePatient();
                    scope.$digest();
                    expect(vm.errorMessage).toBe(mock.badRequest.error);
                });

                it('should close the modal after staging the patient', function () {
                    vm.query.endpointStatuses[1].results[0].selected = true;
                    vm.stagePatient();
                    expect(mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should not call commonService.stagePatient if there are no selected records', function () {
                    vm.query.endpointStatuses[1].results[0].selected = false;
                    vm.stagePatient();
                    expect(commonService.stagePatient).not.toHaveBeenCalled();
                });

                it('should have a function to check if the patient can be staged', function () {
                    expect(vm.isStageable).toBeDefined();
                });

                it('should only be stageable if at least one record is selected', function () {
                    expect(vm.isStageable()).toBe(true);
                    vm.query.endpointStatuses[1].results[0].selected = false;
                    expect(vm.isStageable()).toBe(false);
                });

                it('should not be stageable if there are no endpointStatuses', function () {
                    delete vm.query.endpointStatuses;
                    expect(vm.isStageable()).toBe(false);
                });

                it('should have a way to mark all records at a endpoint as valid', function () {
                    vm.query.endpointStatuses[1].results[0].selected = false;
                    vm.selectAll(vm.query.endpointStatuses[0]);
                    expect(vm.query.endpointStatuses[1].results[0].selected).toBe(true);
                    expect(vm.query.endpointStatuses[1].results[1].selected).toBe(true);
                    vm.selectAll(vm.query.endpointStatuses[0]);
                    expect(vm.query.endpointStatuses[1].results[0].selected).toBe(false);
                    expect(vm.query.endpointStatuses[1].results[1].selected).toBe(false);
                });

                it('should update the dateOfBirth with the model values', function () {
                    vm.patient.dateOfBirthParts = { year: '2001', month: '12', day: '26' };
                    vm.stagePatient();
                    expect(vm.patient.dateOfBirth).toBe('20011226');
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
                    vm.viewRecordDetails(vm.query.endpointStatuses[0].results[0]);
                    expect(vm.viewRecordDetailsInstance).toBeDefined();
                    expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                    expect(actualOptions.resolve.record()).toEqual(vm.query.endpointStatuses[0].results[0]);
                });

                it('should log that the details was closed', function () {
                    var initialCount = $log.info.logs.length;
                    vm.viewRecordDetails(vm.query.endpointStatuses[0].results[0]);
                    vm.viewRecordDetailsInstance.close('closed');
                    expect($log.info.logs.length).toBe(initialCount + 1);
                });

                it('should log that the details was closed', function () {
                    var initialCount = $log.info.logs.length;
                    vm.viewRecordDetails(vm.query.endpointStatuses[0].results[0]);
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
        });
    });
})();
