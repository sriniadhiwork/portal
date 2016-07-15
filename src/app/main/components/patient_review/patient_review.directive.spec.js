(function() {
    'use strict';

    describe('main.aiPatientReview', function() {
        var $compile, $rootScope, vm, el, $log, commonService;

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.stagePatient = jasmine.createSpy('stagePatient');
                    return $delegate;
                });
            });
            inject(function(_$compile_, _$rootScope_, _$log_, _commonService_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                commonService = _commonService_;
                commonService.stagePatient.and.returnValue({});

                el = angular.element('<ai-patient-review patient-queries="[{query: {firstName: \'Bob\'}, id: 3, records: [{id: 1, firstName: \'Bob\', lastName: \'Smith\'}, {id: 2, firstName: \'Bob\', lastName: \'Smith\'}]}]"></ai-patient-review>');

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
            expect(vm.patientQueries.length).toBe(1);
        });

        describe('clearing queries', function () {

            it('should have a way to clear patient queries', function () {
                expect(vm.patientQueries.length).toBe(1);
                vm.clearQuery(0);
                expect(vm.patientQueries.length).toBe(0);
            });

            it('should not try to clear an out of bounds query', function () {
                expect(vm.patientQueries.length).toBe(1);
                vm.clearQuery(2);
                expect(vm.patientQueries.length).toBe(1);
            });
        });

        describe('staging patients', function() {

            var patientQuery;

            beforeEach(function () {
                vm.patientQueries[0].records[0].selected = true;
                vm.patientQueries[0].records[1].selected = false;
                vm.patientQueries[0].patient = { firstName: 'Bob', lastName: 'Smith' };
                patientQuery = { patientRecords: [1], id: 3 };
                patientQuery.patient = vm.patientQueries[0].patient;
            });

            it('should have a function to select multiple patientRecords', function () {
                expect(vm.stagePatientRecords).toBeDefined();
            });

            it('should remove a staged query when selected', function () {
                vm.stagePatientRecords(0);
                expect(vm.patientQueries.length).toBe(0);
            });

            it('should call commonService.stagePatient when stagePatientRecords is called', function () {
                vm.patientQueries[0].records[0].selected = true;
                vm.stagePatientRecords(0);
                expect(commonService.stagePatient).toHaveBeenCalledWith(patientQuery);
            });

            it('should not call commonService.stagePatient if there are no selected records', function () {
                vm.patientQueries[0].records[0].selected = false;
                vm.stagePatientRecords(0);
                expect(commonService.stagePatient).not.toHaveBeenCalled();
            });

            it('should not remove the query if there are no selected records', function () {
                vm.patientQueries[0].records[0].selected = false;
                vm.stagePatientRecords(0);
                expect(vm.patientQueries.length).not.toBe(0);
            });

            it('should have a function to check if the patient can be staged', function () {
                expect(vm.isStageable).toBeDefined();
            });

            it('should only be stageable if at least one record is selected', function () {
                expect(vm.isStageable(0)).toBe(true);
                vm.patientQueries[0].records[0].selected = false;
                expect(vm.isStageable(0)).toBe(false);
            });
        });
    });
})();
