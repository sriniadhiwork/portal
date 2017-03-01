(function () {
    'use strict';

    describe('review.aiPatientEdit', function () {
        var vm, scope, $log, $uibModal, $q, commonService, mock;

        mock = {
            badRequest: {
                status: 500,
                error: 'org.hibernate.exception.DataException: could not execute statement; nested exception is javax.persistence.PersistenceException: org.hibernate.exception.DataException: could not execute statement'
            },
            fakeModal: {
                result: {
                    then: function (confirmCallback, cancelCallback) {
                        this.confirmCallBack = confirmCallback;
                        this.cancelCallback = cancelCallback;
                    }},
                close: function (item) { this.result.confirmCallBack(item); },
                dismiss: function (type) { this.result.cancelCallback(type); }
            },
            modalInstance: {
                close: jasmine.createSpy('close'),
                dismiss: jasmine.createSpy('dismiss')
            },
            name: {
                nameType: { code: 'M', description: 'Maiden Name' },
                familyName: 'Jones',
                givenName: ['Bob']
            },
            patient: {
                dateOfBirth: '1990-03-23',
                fullName: 'John Doe',
                friendlyName: 'John',
                gender: 'M',
                ssn: '123-12-1234'
            }
        };


        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.editPatient = jasmine.createSpy('editPatient');
                    return $delegate;
                });
            });
            inject(function ($controller, $rootScope, _$log_, _$uibModal_,_$q_, _commonService_) {
                $log = _$log_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.returnValue(mock.fakeModal);
                $q = _$q_;
                commonService = _commonService_;
                commonService.editPatient.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                vm = $controller('PatientEditController', {
                    $scope: scope,
                    $uibModalInstance: mock.modalInstance,
                    patient: mock.patient
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

        describe('editing a patient', function () {
            it('should close the modal after editing the patient', function () {
                vm.editPatient();
                scope.$digest();
                expect(mock.modalInstance.close).toHaveBeenCalledWith(vm.patient);
            });

            it('should have an error message if the saving doesn\'t go well', function () {
                commonService.editPatient.and.returnValue($q.reject({data: {error: 'error'}}));
                vm.editPatient();
                scope.$digest();
                expect(vm.errorMessage).toEqual('error');
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
})();
