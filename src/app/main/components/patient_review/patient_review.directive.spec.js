(function() {
    'use strict';

    describe('main.aiPatientReview', function() {
        var vm, el, $log, $q, commonService, mock;
        mock = {patientDocuments: {results: [{id:2, title: 'Title of a doc', filetype: 'C-CDA 1'}, {id:3, title: 'Another title', filetype: 'C-CDA 2.2'}]}};
        mock.fakeDocument = {data: "<document><made><of>XML</of></made></document"};

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.queryPatientDocuments = jasmine.createSpy();
                    $delegate.getDocument = jasmine.createSpy();
                    return $delegate;
                });
            });
            inject(function($compile, $rootScope, _$log_, _$q_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.queryPatientDocuments.and.returnValue($q.when(mock.patientDocuments));
                commonService.getDocument.and.returnValue($q.when(mock.fakeDocument));

                el = angular.element('<ai-patient-review patient-results="[{query: {firstName: \'Bob\'}, results: [{id: 1, firstName: \'Bob\', lastName: \'Smith\'}, {id: 2, firstName: \'Bob\', lastName: \'Smith\'}]}]"></ai-patient-search>');

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
            expect(vm.patientResults.length).toBe(1);
        });

        it('should have a function to query for patient documents', function () {
            expect(vm.queryPatientDocuments).toBeDefined();
        });

        it('should call commonService.queryPatient on query', function () {
            vm.queryPatientDocuments(vm.patientResults[0].results[0], 0);
            expect(commonService.queryPatientDocuments).toHaveBeenCalledWith(1);
        });

        it('should append the results of queryPatient to patientResults', function () {
            vm.queryPatientDocuments(vm.patientResults[0].results[0], 0);
            el.isolateScope().$digest();
            expect(vm.patientResults[0].results[0].documents.length).toBe(2);
        });

        it('should remove patients from the query who aren\'t the selected one', function () {
            expect(vm.patientResults[0].results.length).toBe(2);
            vm.queryPatientDocuments(vm.patientResults[0].results[0], 0);
            expect(vm.patientResults[0].results.length).toBe(1);
        });

        it('should have a way to get documents', function () {
            //given
            var patient = vm.patientResults[0].results[0];
            vm.queryPatientDocuments(patient, 0);
            el.isolateScope().$digest();
            expect(patient.documents[0].status).toBeUndefined();

            //when
            vm.getDocument(patient, patient.documents[0]);
            el.isolateScope().$digest();

            //then
            expect(commonService.getDocument).toHaveBeenCalled();
            expect(patient.documents[0].status).toEqual('cached');
            expect(patient.documents[0].data).toEqual(mock.fakeDocument.data);
        });
    });
})();
