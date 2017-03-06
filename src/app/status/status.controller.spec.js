(function () {
    'use strict';

    describe('portal.status', function (){
        var vm;
        var scope;

        beforeEach(module('portal'));
        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            vm = $controller('StatusController');
            scope.$digest();
        }));

        it('should exist', function () {
            expect(vm).toBeDefined()
        });

        it('should have an about', function () {
            expect(vm.about).toEqual('status');
        });
    });
})();
