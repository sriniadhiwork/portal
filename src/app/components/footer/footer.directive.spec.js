(function() {
    'use strict';

    describe('footer.directive', function() {
        var vm, el, scope, $log;

        beforeEach(function () {
            module('portal');
            inject(function($compile, $rootScope, _$log_) {
                $log = _$log_;

                el = angular.element('<ai-footer></ai-footer>');

                scope = $rootScope.$new()
                $compile(el)(scope);
                scope.$digest();
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

        it('should have a view model', function () {
            expect(vm).toBeDefined();
        });
    });
})();
