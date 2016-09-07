(function() {
    'use strict';

    describe('main.aiDocumentReview', function() {
        var vm, scope, el, $log, mock;
        mock = {fakeDocument: {id:2, title: 'Title of a doc', filetype: 'C-CDA 1', data: '<document><made><of>XML</of></made></document>', status: 'cached'}};

        beforeEach(function () {
            module('portal');
            inject(function($compile, $rootScope, _$log_) {
                $log = _$log_;

                el = angular.element('<ai-document-review></ai-document-review>');

                scope = $rootScope.$new();
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                scope.vm = vm;
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
            scope.$apply('vm.activeDocument=\'' + mock.fakeDocument + '\'');
            //vm.activeDocument = mock.fakeDocument;
            vm.cancel();
            expect(vm.activeDocument).toBeUndefined();
            expect(vm.transformedDocument).toBe('');
        });

        it('should transform the document when it\'s updated', function () {
            scope.$apply('vm.activeDocument=\'' + mock.fakeDocument + '\'');
            expect(vm.transformedDocument).not.toBe('');
        });
    });
})();
