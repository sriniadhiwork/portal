(function () {
    'use strict';

    describe('login.directive', function () {

        var vm, el, $log, commonService;

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.isAuthenticated = function () { return true };
                    $delegate.login = function () { return { then: function (callback) { return callback({}); }}};
                    $delegate.logout = function () { return { then: function (callback) { return callback({}); }}};
                    return $delegate;
                });
            });
            inject(function ($compile, $rootScope, _$log_, _commonService_) {
                $log = _$log_;
                commonService = _commonService_;

                el = angular.element('<ai-login></ai-login>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm

                vm.username = 'bob';
                vm.password = 'pword';
                vm.userObject = {username: vm.username, password: vm.password};
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                $log.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function() {
            expect(vm).toEqual(jasmine.any(Object));
            expect(vm.activityEnum).toEqual({
                LOGIN: 1,
                NONE: 2
            });
        });

        it('should have a login function', function () {
            expect(vm.login).toBeDefined();
        });

        it('should have an initial action', function () {
            expect(vm.activity).toEqual(vm.activityEnum.LOGIN);
        });

        it('should call the commonService on login', function () {
            spyOn(commonService, 'login').and.callThrough();
            vm.login();
            expect(commonService.login).toHaveBeenCalledWith(vm.userObject);
        });

        it('should set the activity to none after logging in', function () {
            spyOn(commonService, 'login').and.callThrough();
            vm.login();
            expect(vm.activity).toEqual(vm.activityEnum.NONE);
        });

        it('should have a logout function that calls the commonService logout function', function () {
            spyOn(commonService, 'logout').and.callThrough();
            vm.logout();
            expect(commonService.logout).toHaveBeenCalled();
            expect(vm.activity).toEqual(vm.activityEnum.LOGIN);
        });
    });
})();
