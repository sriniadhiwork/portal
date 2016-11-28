(function() {
    'use strict';

    describe('navbar.directive', function() {
        var vm, el, scope, $log, $q, commonService;
        var mock = {statistics: [
            {location:{name:'Santa Cruz',id:1,locationId:null,adapter:'eHealth',active:true},calculationStart:null,calculationEnd:null,calculationNumRequests:null,patientDiscoveryStats:{requestCount:1,requestSuccessCount:1,requestFailureCount:0,requestCancelledCount:0,requestAvgCompletionSeconds:78,requestSuccessAvgCompletionSeconds:78,requestFailureAvgCompletionSeconds:null,requestCancelledAvgCompletionSeconds:null}},
            {location:{name:'Sutter Health',id:2,locationId:null,adapter:'eHealth',active:true},calculationStart:null,calculationEnd:null,calculationNumRequests:null,patientDiscoveryStats:{requestCount:1,requestSuccessCount:1,requestFailureCount:0,requestCancelledCount:0,requestAvgCompletionSeconds:69,requestSuccessAvgCompletionSeconds:69,requestFailureAvgCompletionSeconds:null,requestCancelledAvgCompletionSeconds:null}},
            {location:{name:'Dignity Health',id:3,locationId:null,adapter:'eHealth',active:true},calculationStart:null,calculationEnd:null,calculationNumRequests:null,patientDiscoveryStats:{requestCount:1,requestSuccessCount:1,requestFailureCount:0,requestCancelledCount:0,requestAvgCompletionSeconds:63,requestSuccessAvgCompletionSeconds:63,requestFailureAvgCompletionSeconds:null,requestCancelledAvgCompletionSeconds:null}}]};

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getLocationStatistics = jasmine.createSpy('getLocationStatistics');
                    $delegate.getUserAcf = jasmine.createSpy('getUserAcf');
                    $delegate.getUsername = jasmine.createSpy('getUsername');
                    $delegate.hasAcf = jasmine.createSpy('hasAcf');
                    $delegate.isAuthenticated = jasmine.createSpy('isAuthenticated');
                    $delegate.logout = jasmine.createSpy('logout');
                    $delegate.refreshToken = jasmine.createSpy('refreshToken');
                    return $delegate;
                });
            });
            inject(function($compile, $rootScope, _$log_, _$q_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.getLocationStatistics.and.returnValue($q.when(mock.statistics));

                el = angular.element('<ai-navbar></ai-navbar>');

                scope = $rootScope.$new()
                $compile(el)(scope);
                scope.$digest();
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

        it('should know if the user is logged in', function () {
            expect(vm.isAuthenticated).toBeDefined();
            vm.isAuthenticated();
            expect(commonService.isAuthenticated).toHaveBeenCalled();
        });

        it('should know the user\'s username', function () {
            expect(vm.getUsername).toBeDefined();
            vm.getUsername();
            expect(commonService.getUsername).toHaveBeenCalled();
        });

        it('should know if the user has an ACF', function () {
            expect(vm.hasAcf).toBeDefined();
            vm.hasAcf();
            expect(commonService.hasAcf).toHaveBeenCalled();
        });

        it('should know the user\'s ACF', function () {
            expect(vm.getUserAcf).toBeDefined();
            vm.getUserAcf();
            expect(commonService.getUserAcf).toHaveBeenCalled();
        });

        it('should have a way to log out', function () {
            expect(vm.logout).toBeDefined();
            vm.logout();
            expect(commonService.logout).toHaveBeenCalled();
        });

        it('should call the commonService.refreshToken on a Keepalive ping', function () {
            scope.$broadcast('Keepalive');
            scope.$digest();
            expect(commonService.refreshToken).toHaveBeenCalled();
        });
    });
})();
