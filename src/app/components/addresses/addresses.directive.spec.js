(function () {
    'use strict';

    describe('portal.aiAddresses', function () {
        var $compile, $rootScope, vm, el, $log, mock;
        mock = {
            addresses: [ { lines: ['line 1', 'line 2'], city: 'city', state: 'state', zipcode: 'zip'} ]
        };

        beforeEach(function () {
            module('portal');
            inject(function (_$compile_, _$rootScope_, _$log_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;

                el = angular.element('<ai-addresses addresses=\'' + angular.toJson(mock.addresses) + '\'></ai-addresses>');

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
            expect(vm.addresses.length).toBe(1);
            expect(vm.addresses).toEqual(mock.addresses);
        });

        it('should initiate an array of addresses if not given one', function () {
            el = angular.element('<ai-addresses></ai-addresses>');

            $compile(el)($rootScope.$new());
            $rootScope.$digest();
            vm = el.isolateScope().vm;

            expect(vm.addresses.length).toBe(1);
            expect(vm.addresses).toEqual([{lines: ['']}]);
        });

        it('should have a function to add an address', function () {
            expect(vm.addAddress).toBeDefined();
        });

        it('should add a blank address when called', function () {
            vm.addAddress();
            expect(vm.addresses.length).toBe(2);
        });

        it('should make sure the blank address has lines', function () {
            vm.addAddress();
            expect(vm.addresses[1]).toEqual({lines: ['']});
        });

        it('should have a function to remove an address', function () {
            expect(vm.removeAddress).toBeDefined();
        });

        it('should not allow an address to be removed if there are only 1', function () {
            vm.removeAddress(0);
            expect(vm.addresses.length).toBe(1);
        });

        it('should remove an address when told', function () {
            vm.addAddress();
            vm.removeAddress(1);
            expect(vm.addresses.length).toBe(1);
        });

        it('should have a function to add a street line', function () {
            expect(vm.addLine).toBeDefined();
        });

        it('should add a blank line when called', function () {
            vm.addLine(vm.addresses[0]);
            expect(vm.addresses[0].lines.length).toBe(3);
        });

        it('should have a function to remove a street line', function () {
            expect(vm.removeLine).toBeDefined();
        });

        it('should remove a street line when told', function () {
            vm.addLine(vm.addresses[0]);
            vm.removeLine(vm.addresses[0],0);
            expect(vm.addresses[0].lines.length).toBe(2);
        });

        it('should not remove a street line if there are only 1 left', function () {
            vm.removeLine(vm.addresses[0],0);
            vm.removeLine(vm.addresses[0],0);
            expect(vm.addresses[0].lines.length).toBe(1);
        });

        it('should have a function to submit the form', function () {
            expect(vm.submitForm).toBeDefined();
        });

        it('should know if more lines can be added', function () {
            expect(vm.canAddLines(vm.addresses[0])).toBe(true);
            vm.maxLines = 2;
            expect(vm.canAddLines(vm.addresses[0])).toBe(false);
            vm.maxLines = 3;
            expect(vm.canAddLines(vm.addresses[0])).toBe(true);
        });
    });
})();
