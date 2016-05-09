(function() {
    'use strict';

    describe('controllers', function(){
        var vm;
        var $timeout;
        var toastr;
        var scope;

        beforeEach(module('portal'));
        beforeEach(inject(function(_$controller_, _$timeout_, _webDevTec_, _toastr_, _commonService_, $q, $rootScope) {
            spyOn(_webDevTec_, 'getTec').and.returnValue([{}, {}, {}, {}, {}]);
            spyOn(_toastr_, 'info').and.callThrough();
            spyOn(_commonService_, 'getGreeting').and.returnValue($q.when({id: 1, content: 'Hello, World!'}));

            scope = $rootScope.$new();
            vm = _$controller_('MainController');
            $timeout = _$timeout_;
            toastr = _toastr_;
            scope.$digest();
        }));

        it('should have a timestamp creation date', function() {
            expect(vm.creationDate).toEqual(jasmine.any(Number));
        });

        it('should define animate class after delaying timeout ', function() {
            $timeout.flush();
            expect(vm.classAnimation).toEqual('pulse');
        });

        it('should show a Toastr info and stop animation when invoke showToastr()', function() {
            vm.showToastr();
            expect(toastr.info).toHaveBeenCalled();
            expect(vm.classAnimation).toEqual('');
        });

        it('should define more than 5 awesome things', function() {
            expect(angular.isArray(vm.awesomeThings)).toBeTruthy();
            expect(vm.awesomeThings.length === 5).toBeTruthy();
        });

        it('should load a greeting', function () {
            expect(vm.greeting).toEqual('Hello, World!');
        });
    });
})();
