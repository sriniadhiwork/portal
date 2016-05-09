(function() {
    'use strict';

    describe('controllers', function(){
        var vm;
        var scope;

        beforeEach(module('portal'));
        beforeEach(inject(function(_$controller_, $rootScope) {
            scope = $rootScope.$new();
            vm = _$controller_('AboutController');
            scope.$digest();
        }));

        it('should exist', function () {
            expect(vm).toBeDefined()
        });

        it('should have an about', function () {
            expect(vm.about).toEqual('about');
        });
    });
})();
