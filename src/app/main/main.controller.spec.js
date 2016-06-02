(function() {
    'use strict';

    describe('controllers', function() {
        var vm, scope, commonService;

        beforeEach(module('portal.main'));
        beforeEach(inject(function($controller, _commonService_, $q, $rootScope) {
            commonService = _commonService_;
            scope = $rootScope.$new();
            vm = $controller('MainController');
            scope.$digest();
        }));

        it('should know if the user is authenticated', function () {
            spyOn(commonService, 'isAuthenticated').and.returnValue(true);
            expect(vm.isAuthenticated).toBeDefined();
            expect(vm.isAuthenticated()).toBeTruthy();
        });
    });
})();
