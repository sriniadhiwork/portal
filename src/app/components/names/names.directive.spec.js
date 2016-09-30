(function() {
    'use strict';

    describe('portal.aiNames', function() {
        var $compile, $rootScope, vm, el, $log, mock;
        mock = {
            names: [ { givens: ['John', 'Frank'], family: 'Smith'} ],
            defaultName: { givens: [''], nameType: 'L' }
        };

        beforeEach(function () {
            module('portal');
            inject(function(_$compile_, _$rootScope_, _$log_) {
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
                console.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
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

        it('should initiate an array of names if not givens one', function () {
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
            expect(vm.names[0].givens.length).toBe(3);
        });

        it('should have a function to remove a street givens', function () {
            expect(vm.removeGiven).toBeDefined();
        });

        it('should remove a street givens when told', function () {
            vm.addGiven(vm.names[0]);
            vm.removeGiven(vm.names[0],0);
            expect(vm.names[0].givens.length).toBe(2);
        });

        it('should not remove a street givens if there are only 1 left', function () {
            vm.removeGiven(vm.names[0],0);
            vm.removeGiven(vm.names[0],0);
            expect(vm.names[0].givens.length).toBe(1);
        });

        it('should have a function to submit the form', function () {
            expect(vm.submitForm).toBeDefined();
        });

        it('should have a function to assemble the name', function () {
            expect(vm.displayName).toBeDefined();
        });

        // Apologies to anyone whom I've offended with guesses at "correct" name compilation
        it('should display names correctly', function () {
            var name = {
                givens: ['John', 'Andrew'],
                family: 'Smith',
                nameType: 'L'
            };
            expect(vm.displayName(name)).toBe('John Andrew Smith (Legal Name)');
            name.prefix = 'Mr';
            expect(vm.displayName(name)).toBe('Mr John Andrew Smith (Legal Name)');
            name.suffix = 'III';
            expect(vm.displayName(name)).toBe('Mr John Andrew Smith III (Legal Name)');
            name.profSuffix = 'DDS';
            expect(vm.displayName(name)).toBe('Mr John Andrew Smith III, DDS (Legal Name)');
            name.nameAssembly = 'F';
            expect(vm.displayName(name)).toBe('Mr Smith John Andrew III, DDS (Legal Name)');
            name.nameType = 'D';
            expect(vm.displayName(name)).toBe('Mr Smith John Andrew III, DDS (Display Name)');
        });
    });
})();
