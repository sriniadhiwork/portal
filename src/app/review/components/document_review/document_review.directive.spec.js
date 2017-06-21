(function () {
    'use strict';

    describe('review.aiDocumentReview', function () {
        var vm, scope, el, ctrl, $log, mock, filter, filterInnerSpy;
        mock = {fakeDocument: {id:2, title: 'Title of a doc', filetype: 'C-CDA 1', data: '<document><made><of>XML</of></made></document>', status: 'cached'}};

        beforeEach(function () {
            module('portal');
            inject(function (_$log_) {
                $log = _$log_;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('the directive', function () {
            beforeEach(function () {
                inject(function ($compile, $rootScope) {
                    el = angular.element('<ai-document-review></ai-document-review>');

                    scope = $rootScope.$new();
                    $compile(el)(scope);
                    scope.$digest();
                });
            });

            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('the controller', function () {
            beforeEach(function () {
                inject(function ($controller, $rootScope) {
                    filterInnerSpy = jasmine.createSpy('innerFilter');
                    filter = jasmine.createSpy('filter').and.returnValue(filterInnerSpy);

                    ctrl = $controller;
                    scope = $rootScope.$new();
                    vm = ctrl('DocumentReviewController', {
                        '$scope': scope,
                        '$filter': filter
                    });
                    scope.$digest();
                    scope.vm = vm;
                });
            });

            it('should have isolate scope object with instanciate members', function () {
                expect(vm).toEqual(jasmine.any(Object));
                expect(vm.activeDocument).toBeUndefined();
            });

            describe('tranforming document', function () {
                it('should transform the document when it\'s updated', function () {
                    vm.activeDocument = mock.fakeDocument;
                    scope.$digest();
                    expect(filter).toHaveBeenCalledWith('xslt');
                    expect(filterInnerSpy).toHaveBeenCalledWith(mock.fakeDocument.data, jasmine.any(String));
                    expect(vm.transformedDocument).not.toBe('');
                });

                it('should have a way to close the document', function () {
                    vm.activeDocument = mock.fakeDocument;
                    scope.$digest();
                    vm.cancel();
                    expect(vm.activeDocument).toBeUndefined();
                    expect(vm.transformedDocument).toBe('');
                });
            });
        });
    });
})();
