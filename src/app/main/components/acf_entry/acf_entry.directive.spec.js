(function() {
    'use strict';

    describe('main.aiAcfEntry', function() {
        var $compile, $rootScope, vm, el, $log, $q, commonService, mock;
        mock = { acfs: [{id: 1, name: 'ACF 1', address: {}}, {id: 2, name: 'ACF 2', address: {}}]};

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getAcfs = jasmine.createSpy('getAcfs');
                    $delegate.createAcf = jasmine.createSpy('createAcf');
                    $delegate.setAcf = jasmine.createSpy('setAcf');
                    return $delegate;
                });
            });
            inject(function(_$compile_, _$rootScope_, _$log_, _$q_, _commonService_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.getAcfs.and.returnValue($q.when({acfs: mock.acfs}));
                commonService.setAcf.and.returnValue($q.when({}));
                commonService.createAcf.and.returnValue($q.when({response: {name: 'new acf', address: {}, id: 3}}));

                el = angular.element('<ai-acf-entry></ai-acf-entry>');

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
        });

        it('should have a function to get active ACFs', function () {
            expect(vm.getAcfs).toBeDefined();
        });

        it('should call commonService.getAcfs on load', function () {
            expect(commonService.getAcfs).toHaveBeenCalled();
            expect(vm.acfs.length).toBe(2);
        });

        it('should set createNewAcf to true if getAcfs has 0 acfs', function () {
            commonService.getAcfs.and.returnValue($q.when({acfs: []}));
            vm.getAcfs();
            el.isolateScope().$digest();
            expect(commonService.getAcfs).toHaveBeenCalled();
            expect(vm.acfs.length).toBe(0);
            expect(vm.createNewAcf).toBe(true);
        });

        it('should set acfs to an empty array if the server fails', function () {
            commonService.getAcfs.and.returnValue($q.reject({}));
            vm.getAcfs();
            el.isolateScope().$digest();
            expect(commonService.getAcfs).toHaveBeenCalled();
            expect(vm.acfs.length).toBe(0);
            expect(vm.createNewAcf).toBe(true);
        });

        it('should have a function to submit the active ACF', function () {
            expect(vm.acfSubmit).toBeDefined();
        });

        it('should call commonService.createAcf if one is in the newAcf field', function () {
            vm.newAcf = 'New Acf';
            vm.createNewAcf = true;
            vm.acfSubmit();
            expect(commonService.createAcf).toHaveBeenCalled();
        });

        it('should not call commonService.createAcf if there isn\'t one in the newAcf field', function () {
            vm.newAcf = '';
            vm.createNewAcf = false;
            vm.acfSubmit();
            expect(commonService.createAcf).not.toHaveBeenCalled();
        });

        it('should call commonService.setAcf if there is one selected', function () {
            vm.newAcf = '';
            vm.createNewAcf = false;
            vm.selectAcf = vm.acfs[0];
            vm.acfSubmit();
            expect(commonService.setAcf).toHaveBeenCalled();
        });

        it('should not call commonService.setAcf if the checkbox isnt\'t checked', function () {
            vm.selectAcf = null;
            vm.createNewAcf = false;
            vm.acfSubmit();
            expect(commonService.setAcf).not.toHaveBeenCalled();
        });

        it('should call setAcf after createAcf', function () {
            vm.newAcf = 'New Acf';
            vm.createNewAcf = true;
            vm.acfSubmit();
            el.isolateScope().$digest();
            expect(commonService.setAcf).toHaveBeenCalled();
        });
    });
})();
