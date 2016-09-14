(function() {
    'use strict';

    describe('main.controller', function() {
        var vm, scope, commonService, $log;

        beforeEach(function () {
            module('portal.main', 'portal.constants', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.isAuthenticated = jasmine.createSpy('isAuthenticated');
                    $delegate.hasAcf = jasmine.createSpy('hasAcf');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    return $delegate;
                });
            });

            inject(function (_commonService_, _$log_, $controller, $q, $rootScope) {
                commonService = _commonService_;
                $log = _$log_;
                commonService.isAuthenticated.and.returnValue(true);
                commonService.hasAcf.and.returnValue(true);

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
            expect(vm.hasAcf()).toBeTruthy();
        });
    });
})();
