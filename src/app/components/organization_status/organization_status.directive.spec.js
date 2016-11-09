(function() {
    'use strict';

    describe('portal.aiOrganizationStatus', function() {
        var $compile, $rootScope, vm, el, $log, $q, $interval, commonService, mock;
        mock = {};
        mock.statistics = [
            {org:{name:'Santa Cruz',id:1,organizationId:null,adapter:'eHealth',active:true},calculationStart:null,calculationEnd:null,calculationNumRequests:null,patientDiscoveryStats:{requestCount:1,requestSuccessCount:1,requestFailureCount:0,requestCancelledCount:0,requestAvgCompletionSeconds:78,requestSuccessAvgCompletionSeconds:78,requestFailureAvgCompletionSeconds:null,requestCancelledAvgCompletionSeconds:null}},
            {org:{name:'Sutter Health',id:2,organizationId:null,adapter:'eHealth',active:true},calculationStart:null,calculationEnd:null,calculationNumRequests:null,patientDiscoveryStats:{requestCount:1,requestSuccessCount:1,requestFailureCount:0,requestCancelledCount:0,requestAvgCompletionSeconds:69,requestSuccessAvgCompletionSeconds:69,requestFailureAvgCompletionSeconds:null,requestCancelledAvgCompletionSeconds:null}},
            {org:{name:'Dignity Health',id:3,organizationId:null,adapter:'eHealth',active:true},calculationStart:null,calculationEnd:null,calculationNumRequests:null,patientDiscoveryStats:{requestCount:1,requestSuccessCount:1,requestFailureCount:0,requestCancelledCount:0,requestAvgCompletionSeconds:63,requestSuccessAvgCompletionSeconds:63,requestFailureAvgCompletionSeconds:null,requestCancelledAvgCompletionSeconds:null}}];
        mock.chart = {type:'PieChart',options:{title:'Santa Cruz (average response time: 78s)',is3D:true},data:{cols:[{id:'s',label:'Status',type:'string'},{id:'c',label:'Count',type:'number'}],rows:[{c:[{v:'Success'},{v:1}]},{c:[{v:'Failed'},{v:0}]},{c:[{v:'Cancelled'},{v:0}]}]}}

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getOrganizationStatistics = jasmine.createSpy('getOrganizationStatistics');
                    return $delegate;
                });
            });
            inject(function(_$compile_, _$rootScope_, _$log_, _$q_, _$interval_, _commonService_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                $q = _$q_;
                $interval = _$interval_;
                commonService = _commonService_;
                commonService.getOrganizationStatistics.and.returnValue($q.when(mock.statistics));

                el = angular.element('<ai-organization-status></ai-organization-status>');

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

        it('should load the queried Organizations on load', function () {
            expect(vm.organizationStatistics.length).toBe(3);
        });

        it('should call commonService.queryOrganizationStatistics on load', function () {
            expect(commonService.getOrganizationStatistics).toHaveBeenCalled();
        });

        it('should make the statistics arrays', function () {
            expect(vm.organizationStatistics[0].statistics).toEqual(mock.chart);
        });

        it('should leave statistics as null if the organization has no requests', function () {
            expect(vm.organizationStatistics[0].statistics).toBeDefined();
            mock.statistics[0].patientDiscoveryStats.requestCount = 0;
            $interval.flush(vm.INTERVAL_MILLIS);
            expect(vm.organizationStatistics[0].statistics).toBe(null);
        });

        it('should re-query the organization statistics on a regular interval', function () {
            expect(commonService.getOrganizationStatistics.calls.count()).toBe(1);
            $interval.flush(vm.INTERVAL_MILLIS);
            expect(commonService.getOrganizationStatistics.calls.count()).toBe(2);
            $interval.flush(vm.INTERVAL_MILLIS);
            expect(commonService.getOrganizationStatistics.calls. count()).toBe(3);
        });

        it('should be able to stop the statistics interval', function () {
            expect(vm.stopIntervalStatistics).toBeDefined();
            expect(vm.stopStatistics).toBeDefined();
            vm.stopIntervalStatistics();
            expect(vm.stopStatistics).not.toBeDefined();
        });
    });
})();
