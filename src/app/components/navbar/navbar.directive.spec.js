(function() {
    'use strict';

    describe('directive navbar', function() {
        var vm, el, commonService;

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.isAuthenticated = jasmine.createSpy();
                    return $delegate;
                });
            });
            inject(function($compile, $rootScope, _commonService_) {
                commonService = _commonService_;

                el = angular.element('<ai-navbar></ai-navbar>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        it('should be compiled', function() {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function() {
            expect(vm).toEqual(jasmine.any(Object));
        });

        it('should know if the user is logged in', function () {
            expect(vm.isAuthenticated).toBeDefined();
            vm.isAuthenticated();
            expect(commonService.isAuthenticated).toHaveBeenCalled();
        });
    });
})();
