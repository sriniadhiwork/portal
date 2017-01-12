(function() {
    'use strict';

    describe('main.controller', function() {
        var vm, scope, commonService, $log, $window, location, ctrl;

        beforeEach(function () {
            module('portal.main', 'portal.constants', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.isAuthenticated = jasmine.createSpy('isAuthenticated');
                    $delegate.hasAcf = jasmine.createSpy('hasAcf');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    return $delegate;
                });
            });

            inject(function (_commonService_, _$log_, $controller, $q, $rootScope, _$location_, _$window_) {
                commonService = _commonService_;
                $log = _$log_;
                ctrl = $controller;
                location = _$location_;
                $window = _$window_;
                commonService.isAuthenticated.and.returnValue(true);
                commonService.hasAcf.and.returnValue(false);

                spyOn($window.location, 'replace');

                scope = $rootScope.$new();
                vm = $controller('MainController');
                scope.$digest();

                vm.dhvForm = {
                    submit: function () { }
                };
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should know if the user is authenticated', function () {
            expect(vm.isAuthenticated).toBeDefined();
            expect(vm.isAuthenticated()).toBeTruthy();
        });

        it('should know if the user has an ACF', function () {
            expect(vm.hasAcf).toBeDefined();
            commonService.hasAcf.and.returnValue(true);
            scope.$digest();
            expect(vm.hasAcf()).toBeTruthy();
        });

        it('should redirect the user to search if they have an acf', function () {
            commonService.hasAcf.and.returnValue(true);
            spyOn(location, 'path');
            vm = ctrl('MainController');
            scope.$digest();
            expect(location.path).toHaveBeenCalledWith('/search');
        });

        it('should not redirect the user to DHV if they\'re not logged in and we\'re not integrated with DHV', function () {
            spyOn(vm.dhvForm, 'submit');
            commonService.isAuthenticated.and.returnValue(false);
            scope.$digest();
            vm.integratedWithDHV = false;
            vm.redirectToDhv();

            expect(vm.dhvForm.submit).not.toHaveBeenCalled();
        });

        it('should redirect the user to DHV if they\'re not logged in and we\'re integrated with DHV', function () {
            spyOn(vm.dhvForm, 'submit');
            commonService.isAuthenticated.and.returnValue(false);
            scope.$digest();
            vm.integratedWithDHV = true;
            vm.redirectToDhv();

            expect(vm.dhvForm.submit).toHaveBeenCalled();
        });

        it('should not redirect the user to DHV if they\'re logged in and we\'re integrated with DHV', function () {
            spyOn(vm.dhvForm, 'submit');
            commonService.isAuthenticated.and.returnValue(true);
            vm.integratedWithDHV = true;
            scope.$digest();

            expect(vm.dhvForm.submit).not.toHaveBeenCalled();
        });
    });
})();
