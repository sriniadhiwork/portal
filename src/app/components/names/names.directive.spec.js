(function () {
    'use strict';

    describe('portal.aiNames', function () {
        var $compile, $log, $rootScope, el, mock, vm;
        mock = {
            names: [ { givenName: ['John', 'Frank'], familyName: 'Smith'} ],
            defaultName: { givenName: [''], nameType: {code: 'L', description: 'Legal Name'} },
        };

        beforeEach(function () {
            module('portal');
            inject(function (_$compile_, _$log_, _$rootScope_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;

                el = angular.element('<ai-names names=\'' + angular.toJson(mock.names) + '\'></ai-names>');

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
            expect(vm.names.length).toBe(1);
            expect(vm.names).toEqual(mock.names);
        });

        it('should initiate an array of names if not given one', function () {
            el = angular.element('<ai-names></ai-names>');

            $compile(el)($rootScope.$new());
            $rootScope.$digest();
            vm = el.isolateScope().vm;

            expect(vm.names.length).toBe(1);
            expect(vm.names).toEqual([mock.defaultName]);
        });

        it('should have a function to add a name', function () {
            expect(vm.addName).toBeDefined();
        });

        it('should add a blank name when called', function () {
            vm.addName();
            expect(vm.names.length).toBe(2);
        });

        it('should make sure the blank name has givens', function () {
            vm.addName();
            expect(vm.names[1]).toEqual(mock.defaultName);
        });

        it('should have a function to remove a name', function () {
            expect(vm.removeName).toBeDefined();
        });

        it('should not allow a name to be removed if there are only 1', function () {
            vm.removeName(0);
            expect(vm.names.length).toBe(1);
        });

        it('should remove a name when told', function () {
            vm.addName();
            vm.removeName(1);
            expect(vm.names.length).toBe(1);
        });

        it('should have a function to add a givens name', function () {
            expect(vm.addGiven).toBeDefined();
        });

        it('should add a blank givens when called', function () {
            vm.addGiven(vm.names[0]);
            expect(vm.names[0].givenName.length).toBe(3);
        });

        it('should have a function to remove a street givens', function () {
            expect(vm.removeGiven).toBeDefined();
        });

        it('should remove a given when told', function () {
            vm.addGiven(vm.names[0]);
            vm.removeGiven(vm.names[0],0);
            expect(vm.names[0].givenName.length).toBe(2);
        });

        it('should not remove a given if there are only 1 left', function () {
            vm.removeGiven(vm.names[0],0);
            vm.removeGiven(vm.names[0],0);
            expect(vm.names[0].givenName.length).toBe(1);
        });

        it('should have a function to submit the form', function () {
            expect(vm.submitForm).toBeDefined();
        });
    });
})();
