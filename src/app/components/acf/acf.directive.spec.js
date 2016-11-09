(function() {
    'use strict';

    describe('portal.aiAcf', function() {
        var $compile, $rootScope, vm, el, $log, $q, commonService, mock, $location;
        mock = {};
        mock.acfs = [{id: 1, name: 'ACF 1', address: {}}, {id: 2, name: 'ACF 2', address: {}}];
        mock.fakeAcf = { name: 'fake', address: {city: 'city', lines: ['','123 Main St']}};
        mock.badRequest = {
            status: 400,
            error: 'ACF name is required.'
        };

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.createAcf = jasmine.createSpy('createAcf');
                    $delegate.editAcf = jasmine.createSpy('editAcf');
                    $delegate.getAcfs = jasmine.createSpy('getAcfs');
                    $delegate.getUserAcf = jasmine.createSpy('getUserAcf');
                    $delegate.hasAcf = jasmine.createSpy('hasAcf');
                    $delegate.setAcf = jasmine.createSpy('setAcf');
                    return $delegate;
                });
            });
            inject(function(_$compile_, _$rootScope_, _$log_, _$q_, _commonService_, _$location_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                $q = _$q_;
                $location = _$location_;
                commonService = _commonService_;
                commonService.createAcf.and.returnValue($q.when({response: {name: 'new acf', address: {}, id: 3}}));
                commonService.editAcf.and.returnValue($q.when(mock.acfs[1]));
                commonService.getAcfs.and.returnValue($q.when(mock.acfs));
                commonService.getUserAcf.and.returnValue(mock.acfs[0]);
                commonService.hasAcf.and.returnValue(true);
                commonService.setAcf.and.returnValue($q.when({}));

                el = angular.element('<ai-acf mode="select"></ai-acf>');

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

        it('should set acfs to an empty array if the server fails', function () {
            commonService.getAcfs.and.returnValue($q.reject({}));
            vm.getAcfs();
            el.isolateScope().$digest();
            expect(commonService.getAcfs).toHaveBeenCalled();
            expect(vm.acfs.length).toBe(0);
        });

        it('should have a function to submit the active ACF', function () {
            expect(vm.acfSubmit).toBeDefined();
        });

        it('should call commonService.createAcf if one is in the acf.name field', function () {
            vm.acf = angular.copy(mock.fakeAcf);
            vm.mode = 'enter';
            vm.acfSubmit();
            expect(commonService.createAcf).toHaveBeenCalled();
        });

        it('should not call commonService.createAcf if there isn\'t one in the acf.name field', function () {
            vm.acf = {};
            vm.mode = 'enter';
            vm.acfSubmit();
            expect(commonService.createAcf).not.toHaveBeenCalled();
        });

        it('should call commonService.setAcf if there is one selected', function () {
            vm.selectAcf = vm.acfs[0];
            vm.acfSubmit();
            expect(commonService.setAcf).toHaveBeenCalled();
        });

        it('should not call commonService.setAcf if the checkbox isnt\'t checked', function () {
            vm.selectAcf = null;
            vm.acfSubmit();
            expect(commonService.setAcf).not.toHaveBeenCalled();
        });

        it('should show an error if create goes wrong', function () {
            vm.acf = angular.copy(mock.fakeAcf);
            vm.mode = 'enter';
            commonService.createAcf.and.returnValue($q.reject({data: mock.badRequest}));
            vm.acfSubmit();
            el.isolateScope().$digest();
            expect(vm.errorMessage).toBe(mock.badRequest.error);
        });

        it('should call setAcf after createAcf', function () {
            vm.acf = angular.copy(mock.fakeAcf);
            vm.mode = 'enter';
            vm.acfSubmit();
            el.isolateScope().$digest();
            expect(commonService.setAcf).toHaveBeenCalled();
        });

        it('should know if the user has an ACF', function () {
            expect(vm.hasAcf).toBeDefined();
            expect(vm.hasAcf()).toBeTruthy();
        });

        it('should have a function to get the user\`s ACF', function () {
            expect(vm.getUserAcf).toBeDefined();
        });

        it('should call commonService.getUserAcf on load', function () {
            expect(commonService.getUserAcf).toHaveBeenCalled();
            expect(vm.acf).toBe(mock.acfs[0]);
        });

        it('should set acf to a blank-ish acf object if the user doesn\'t have an ACF', function () {
            commonService.getUserAcf.and.returnValue('');
            vm.getUserAcf();
            expect(vm.acf).toEqual({address: {lines: ['']}});
        });

        it('should add an address object if it doesn\'t have one', function () {
            var full = angular.copy(mock.acfs[0]);
            var empty = angular.copy(full);
            delete(empty.address);
            commonService.getUserAcf.and.returnValue(empty);
            vm.getUserAcf();
            expect(vm.acf).toEqual(full);
        });

        it('should add an address object if the acf is null', function () {
            var newAcf = angular.copy(mock.acfs[0]);
            delete(newAcf.id);
            delete(newAcf.name);
            commonService.getUserAcf.and.returnValue(null);
            vm.getUserAcf();
            expect(vm.acf).toEqual(newAcf);
        });

        it('should add an address object if the address is null', function () {
            var full = angular.copy(mock.acfs[0]);
            var empty = angular.copy(full);
            empty.address = null;
            commonService.getUserAcf.and.returnValue(empty);
            vm.getUserAcf();
            expect(vm.acf).toEqual(full);
        });

        it('should put a lines object in the acf address if it doesn\'t have one', function () {
            var fullLines = angular.copy(mock.acfs[0]);
            var emptyLines = angular.copy(fullLines);
            delete(emptyLines.address.lines);
            commonService.getUserAcf.and.returnValue(emptyLines);
            vm.getUserAcf();
            expect(vm.acf).toEqual(fullLines);
        });

        it('should have a function to edit the current ACF', function () {
            expect(vm.editAcf).toBeDefined();
        });

        it('should call commonService.editAcf when one is edited', function () {
            vm.editAcf();
            expect(commonService.editAcf).toHaveBeenCalledWith(mock.acfs[0]);
        });

        it('should turn off editing after editAcf is called', function () {
            vm.mode = 'edit';
            vm.editAcf();
            expect(vm.mode).toBe('view');
        });

        it('should set the local acf to the edited acf', function () {
            vm.editAcf();
            el.isolateScope().$digest();
            expect(vm.acf).toBe(mock.acfs[1]);
        });

        it('should have a function to cancel editing', function () {
            expect(vm.cancelEditing).toBeDefined();
        });

        it('should call commonService.getUserAcf on cancel', function () {
            vm.cancelEditing();
            expect(commonService.getUserAcf).toHaveBeenCalled();
        });

        it('should have a function to submit the form on enter', function () {
            expect(vm.submitForm).toBeDefined();
        });

        it('should call the edit form function on enter if user has acf', function () {
            vm.queryForm.$invalid = false;
            vm.mode = 'edit';
            spyOn(vm, 'editAcf');
            vm.submitForm();
            expect(vm.editAcf).toHaveBeenCalled();
        });

        it('should call acfSubmit on enter if the user has no acf', function () {
            vm.queryForm.$invalid = false;
            commonService.hasAcf.and.returnValue(false);
            spyOn(vm, 'acfSubmit');
            vm.submitForm();
            el.isolateScope().$digest();
            expect(vm.acfSubmit).toHaveBeenCalled();
        });

        it('should not allow submitForm to be called if the form is invalid', function () {
            spyOn(vm, 'editAcf');
            vm.queryForm.$invalid = true;
            vm.mode = 'edit';
            vm.submitForm()
            expect(vm.editAcf).not.toHaveBeenCalled();
        });

        it('should remove empty lines from the address on "create"', function () {
            var updAcf = angular.copy(mock.fakeAcf);
            updAcf.address.lines = ['123 Main St'];
            vm.acf = angular.copy(mock.fakeAcf);
            vm.mode = 'enter';
            vm.acfSubmit();
            expect(commonService.createAcf).toHaveBeenCalledWith(updAcf);
        });

        it('should not send an empty array of lines on "create"', function () {
            var updAcf = angular.copy(mock.fakeAcf);
            delete updAcf.address.lines
            vm.acf = angular.copy(mock.fakeAcf);
            vm.acf.address.lines[1] = '';
            vm.mode = 'enter';
            vm.acfSubmit();
            expect(commonService.createAcf).toHaveBeenCalledWith(updAcf);
        });

        it('should redirect the user to /search on acf creation', function () {
            vm.acf = angular.copy(mock.fakeAcf);
            vm.mode = 'enter';
            spyOn($location, 'path');

            vm.acfSubmit();
            el.isolateScope().$digest();

            expect($location.path).toHaveBeenCalledWith('/search');
        });

        it('should redirect the user to /search on acf selection', function () {
            vm.selectAcf = vm.acfs[0];
            spyOn($location, 'path');

            vm.acfSubmit();
            el.isolateScope().$digest();

            expect($location.path).toHaveBeenCalledWith('/search');
        });

        it('should know what mode the user is in', function () {
            expect(vm.mode).toBe('select');
        });

        it('should switch to "enter" if there are no ACFs', function () {
            commonService.getAcfs.and.returnValue($q.when([]));
            $compile(el)($rootScope.$new());
            $rootScope.$digest();
            vm = el.isolateScope().vm;
            expect(vm.mode).toBe('enter');
        });

        it('should switch to "enter" if getAcfs fails', function () {
            commonService.getAcfs.and.returnValue($q.reject({}));
            $compile(el)($rootScope.$new());
            $rootScope.$digest();
            vm = el.isolateScope().vm;
            expect(vm.mode).toBe('enter');
        });

        it('should not switch to "enter" if mode is "display"', function () {
            el = angular.element('<ai-acf mode="display"></ai-acf>');
            commonService.getAcfs.and.returnValue($q.when([]));
            $compile(el)($rootScope.$new());
            $rootScope.$digest();
            vm = el.isolateScope().vm;
            expect(vm.mode).toBe('display');
            commonService.getAcfs.and.returnValue($q.reject({}));
            $compile(el)($rootScope.$new());
            $rootScope.$digest();
            vm = el.isolateScope().vm;
            expect(vm.mode).toBe('display');
        });

        it('should know if the entered new ACF name matches one that already exists', function () {
            vm.acf = angular.copy(mock.fakeAcf);
            vm.mode = 'enter';
            expect(vm.validName()).toBe(true);
            vm.acf.name = 'ACF 1';
            expect(vm.validName()).toBe(false);
        });
    });
})();
