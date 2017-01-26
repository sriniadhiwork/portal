(function () {
    'use strict';

    describe('portal.resources', function (){
        var vm;
        var scope;

        beforeEach(module('portal'));
        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            vm = $controller('ResourcesController');
            scope.$digest();
        }));

        it('should exist', function () {
            expect(vm).toBeDefined()
        });

        it('should have an about', function () {
            expect(vm.about).toEqual('resources');
        });

        it('should load have a swaggerUI at start', function () {
            expect(vm.swaggerUrl.length).toBeGreaterThan(0);
        });
    });
})();
