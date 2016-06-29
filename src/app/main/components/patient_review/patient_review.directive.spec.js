(function() {
    'use strict';

    describe('main.aiPatientReview', function() {
        var $compile, $rootScope, vm, el, $log, $q, commonService, mock;
        mock = {patientDocuments: {results: [{id:2, title: 'Title of a doc', filetype: 'C-CDA 1'}, {id:3, title: 'Another title', filetype: 'C-CDA 2.2'}]}};

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.queryPatientDocuments = jasmine.createSpy();
                    return $delegate;
                });
            });
            inject(function(_$compile_, _$rootScope_, _$log_, _$q_, _commonService_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.queryPatientDocuments.and.returnValue($q.when(mock.patientDocuments));

                el = angular.element('<ai-patient-review patient-queries="[{query: {firstName: \'Bob\'}, results: [{id: 1, firstName: \'Bob\', lastName: \'Smith\'}, {id: 2, firstName: \'Bob\', lastName: \'Smith\'}]}]"></ai-patient-review>');

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
            expect(vm.patients).toEqual([]);
        });

        it('should have a function to query for patient documents', function () {
            expect(vm.queryPatientDocuments).toBeDefined();
        });

        it('should call commonService.queryPatientDocuments on query', function () {
            vm.selectPatient(0,0);
            expect(commonService.queryPatientDocuments).toHaveBeenCalledWith(vm.patients[0].id);
        });

        it('should append the results of queryPatient to patientQueries', function () {
            vm.selectPatient(0,0);
            vm.queryPatientDocuments(vm.patients[0]);
            el.isolateScope().$digest();
            expect(vm.patients[0].documents.length).toBe(2);
        });

        it('should have a way to mark a patient as matching a query', function () {
            expect(vm.selectPatient).toBeDefined();
        });

        it('should move patients from queries to patients list', function () {
            var patient = angular.copy(vm.patientQueries[0].results[0]);
            vm.selectPatient(0, 0);
            expect(vm.patients[0]).toEqual(patient);
            expect(vm.patientQueries.length).toBe(0);
        });

        it('shouldn\'t initialize an empty array if one is provided', function () {
            el = angular.element('<ai-patient-review patients=[]></ai-patient-review>');
            $compile(el)($rootScope.$new());
            $rootScope.$digest();
            vm = el.isolateScope().vm;

            expect(vm.patients).toEqual([]);
        });

        it('should have a way to clear patient queries', function () {
            // given a patient in the queue
            expect(vm.patientQueries.length).toBe(1);

            // when first result is cleared
            vm.clearQuery(0);

            // then expect to have no patients in queue
            expect(vm.patientQueries.length).toBe(0);
        });

        it('should not try to clear an out of bounds query', function () {
            expect(vm.patientQueries.length).toBe(1);

            vm.clearQuery(2);

            expect(vm.patientQueries.length).toBe(1);
        });
    });
})();
