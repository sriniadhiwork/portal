(function() {
    'use strict';

    describe('main.aiPatientSearch', function() {
        var $compile, $rootScope, vm, el, $log, $q, commonService, mock;
        mock = {patientSearch: {results: [{id:2, firstName: 'Joe', lastName: 'Rogan'}, {id:3, firstName: 'Sue', lastName: 'Samson'}]}};

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.searchForPatient = jasmine.createSpy();
                    return $delegate;
                });
            });
            inject(function(_$compile_, _$rootScope_, _$log_, _$q_, _commonService_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.searchForPatient.and.returnValue($q.when(mock.patientSearch));

                el = angular.element('<ai-patient-search></ai-patient-search>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;

                vm.queryForm = {$error: { required: [1, 2], invalid: [3], notAnError: 4 }};
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

        it('should know how many errors the queryForm has', function () {
            expect(vm.errorCount()).toBe(3);
        });

        it('should have a function to query for patients', function () {
            expect(vm.searchForPatient).toBeDefined();
        });

        it('should call commonService.searchForPatient on query', function () {
            vm.searchForPatient();
            expect(commonService.searchForPatient).toHaveBeenCalled();
        });

        it('should clear the query fields on a search', function () {
            vm.query = { firstName: 'fake', lastName: 'name' };
            vm.searchForPatient();
            expect(vm.query).toEqual({});
        });

        it('should tell the controller that a search was performed', function () {
            spyOn(vm,'triggerHandlers');
            vm.searchForPatient();
            expect(vm.triggerHandlers).toHaveBeenCalled();
        });
    });
})();
