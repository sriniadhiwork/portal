(function() {
    'use strict';

    describe('main.aiDocumentReview', function() {
        var vm, el, $log, mock;
        mock = {fakeDocument: {id:2, title: 'Title of a doc', filetype: 'C-CDA 1', data: '<document><made><of>XML</of></made></document>', status: 'cached'}};

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
//                    $delegate.queryPatientDocuments = jasmine.createSpy();
//                    $delegate.getDocument = jasmine.createSpy();
                    return $delegate;
                });
            });
            inject(function($compile, $rootScope, _$log_) {
                $log = _$log_;
//                commonService.queryPatientDocuments.and.returnValue($q.when(mock.patientDocuments));
//                commonService.getDocument.and.returnValue($q.when(mock.fakeDocument));

                el = angular.element('<ai-document-review></ai-document-review>');

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
            expect(vm.activeDocument).toBeUndefined();
        });

        it('should have a way to close the document', function () {
            vm.activeDocument = mock.fakeDocument;
            vm.cancel();
            expect(vm.activeDocument).toBeUndefined();
        });
    });
})();
