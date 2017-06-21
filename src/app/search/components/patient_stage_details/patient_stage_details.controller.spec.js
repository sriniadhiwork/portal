(function () {
    'use strict';

    describe('search.aiPatientStageDetails', function () {
        var vm, scope, $log, mock;
        mock = {record: {id:1,givenName:'John',familyName:'Snow',dateOfBirth:413269200000,gender:'M',phoneNumber:'9004783666',address:null,ssn:'451663333'}};
        mock.modalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss'),
        };

        beforeEach(function () {
            module('portal');
            inject(function ($controller, _$log_, $rootScope) {
                $log = _$log_;

                scope = $rootScope.$new();
                vm = $controller('PatientStageDetailsController', {
                    $scope: scope,
                    $uibModalInstance: mock.modalInstance,
                    record: mock.record,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        describe('housekeeping', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should have a way to close the modal', function () {
                expect(vm.cancel).toBeDefined();
                vm.cancel();
                expect(mock.modalInstance.dismiss).toHaveBeenCalled();
            });
        });
    });
})();
