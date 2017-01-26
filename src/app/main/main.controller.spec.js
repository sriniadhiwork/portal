(function () {
    'use strict';

    describe('main.controller', function () {
        var vm, scope, commonService, $log, $window, location, ctrl, mock, $q;
        mock = {
            token: 'a token here'
        };

        beforeEach(function () {
            module('portal.main', 'portal.constants', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.isAuthenticated = jasmine.createSpy('isAuthenticated');
                    $delegate.hasAcf = jasmine.createSpy('hasAcf');
                    $delegate.getSamlUserToken = jasmine.createSpy('getSamlUserToken');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    return $delegate;
                });
            });

            inject(function (_commonService_, _$log_, $controller, $rootScope, _$location_, _$window_, _$q_) {
                $log = _$log_;
                ctrl = $controller;
                location = _$location_;
                $window = _$window_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.isAuthenticated.and.returnValue(true);
                commonService.hasAcf.and.returnValue(false);
                commonService.getSamlUserToken.and.returnValue($q.when(mock.token));
                commonService.getToken.and.returnValue(mock.token);

                spyOn($window.location, 'replace');

                scope = $rootScope.$new();
                vm = $controller('MainController');
                scope.$digest();
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

        it('should call for a SAML based user token', function () {
            expect(commonService.getSamlUserToken).toHaveBeenCalled();
        });

        it('should call for the PULSE token if the SAML request returns a token', function () {
            expect(commonService.getToken).toHaveBeenCalledWith(true);
        });

        it('should redirect the user to search if they have an acf', function () {
            commonService.hasAcf.and.returnValue(true);
            vm = ctrl('MainController');
            spyOn(location, 'path');
            scope.$digest();
            expect(location.path).toHaveBeenCalledWith('/search');
        });

        it('should not redirect the user to search if they do not have an acf', function () {
            vm = ctrl('MainController');
            spyOn(location, 'path');
            scope.$digest();
            expect(location.path).not.toHaveBeenCalledWith('/search');
        });

        it('should be ready to redirect the user to DHV if they don\'t have a SAML based token', function () {
            expect(vm.willRedirect).toBe(false);
            commonService.getSamlUserToken.and.returnValue($q.reject('no token'));
            vm = ctrl('MainController');
            scope.$digest();
            expect(vm.willRedirect).toBe(true);
        });
    });
})();
