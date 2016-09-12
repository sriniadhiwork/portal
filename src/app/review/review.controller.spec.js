(function() {
    'use strict';

    describe('review.controller', function() {
        var vm, scope, commonService, $log, $location;

        beforeEach(function () {
            module('portal.review', 'portal.constants', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.refreshToken = jasmine.createSpy('refreshToken');
                    $delegate.isAuthenticated = jasmine.createSpy('isAuthenticated');
                    $delegate.hasAcf = jasmine.createSpy('hasAcf');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    return $delegate;
                });
            });

            inject(function (_commonService_, _$log_, _$location_, $controller, $q, $rootScope) {
                commonService = _commonService_;
                $log = _$log_;
                $location = _$location_;
                commonService.isAuthenticated.and.returnValue(true);
                commonService.hasAcf.and.returnValue(true);

                scope = $rootScope.$new();
                vm = $controller('ReviewController', {$scope: scope});
                //scope.$digest();
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

        it('should have a function to scroll', function () {
            expect(vm.scrollTo).toBeDefined();
        });

        it('should set the location', function () {
            vm.scrollTo('anId');
            expect($location.hash()).toBe('anId');
        });

        it('should have a function to refresh the token', function () {
            expect(vm.refreshToken).toBeDefined();
        });

        it('should call the refreshToken function on a Keepalive ping', function () {
            spyOn(vm, 'refreshToken');
            scope.$emit('Keepalive');
            scope.$digest();
            expect(vm.refreshToken).toHaveBeenCalled();
        });

        it('should call commonService.refreshToken on refreshToken', function () {
            vm.refreshToken();
            scope.$digest();
            expect(commonService.refreshToken).toHaveBeenCalled();
        });

        describe('handlers and triggers', function () {
            it('should have a function to register handlers', function () {
                expect(vm.registerHandler).toBeDefined();
            });

            it('should add a handler function is one is passed in', function () {
                expect(vm.handlers.length).toBe(0);
                vm.registerHandler(function () {});
                expect(vm.handlers.length).toBe(1);
            });

            it('should remove handlers when scope is destroyed', function () {
                expect(vm.handlers.length).toBe(0);
                var removeHandler = vm.registerHandler(function () {});
                expect(vm.handlers.length).toBe(1);
                removeHandler();
                expect(vm.handlers.length).toBe(0);
            });

            it('should have a function to trigger handlers', function () {
                expect(vm.triggerHandlers).toBeDefined();
            });

            it('should call handler functions when triggered', function () {
                this.aFunc = function () {};
                spyOn(this, 'aFunc');
                vm.registerHandler(this.aFunc);
                vm.triggerHandlers();
                expect(this.aFunc).toHaveBeenCalled();
            });
        });
    });
})();
