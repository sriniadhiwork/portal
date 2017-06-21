(function () {
    'use strict';

    describe('portal.aiLocationStatus', function () {
        var $compile, $rootScope, vm, el, $log, $q, $interval, commonService, mock;
        mock = {};
        mock.statistics = [{"location":{"id":4,"externalId":null,"status":{"id":null,"name":"Active"},"parentOrgName":null,"name":"San Ramon Regional Medical Center","description":null,"type":"Hospital","address":null,"externalLastUpdateDate":null,"creationDate":null,"lastModifiedDate":null,"endpoints":[]},"calculationStart":null,"calculationEnd":null,"calculationNumRequests":null,"patientDiscoveryStats":{"requestCount":2,"requestSuccessCount":2,"requestFailureCount":0,"requestCancelledCount":0,"requestAvgCompletionSeconds":0,"requestSuccessAvgCompletionSeconds":0,"requestFailureAvgCompletionSeconds":null,"requestCancelledAvgCompletionSeconds":null}},{"location":{"id":3,"externalId":null,"status":{"id":null,"name":"Active"},"parentOrgName":null,"name":"Contra Costa Regional Medical Center","description":null,"type":"Hospital","address":null,"externalLastUpdateDate":null,"creationDate":null,"lastModifiedDate":null,"endpoints":[]},"calculationStart":null,"calculationEnd":null,"calculationNumRequests":null,"patientDiscoveryStats":{"requestCount":2,"requestSuccessCount":2,"requestFailureCount":0,"requestCancelledCount":0,"requestAvgCompletionSeconds":0,"requestSuccessAvgCompletionSeconds":0,"requestFailureAvgCompletionSeconds":null,"requestCancelledAvgCompletionSeconds":null}},{"location":{"id":2,"externalId":null,"status":{"id":null,"name":"Active"},"parentOrgName":null,"name":"John Muir Medical Center (Walnut Creek)","description":null,"type":"Hospital","address":null,"externalLastUpdateDate":null,"creationDate":null,"lastModifiedDate":null,"endpoints":[]},"calculationStart":null,"calculationEnd":null,"calculationNumRequests":null,"patientDiscoveryStats":{"requestCount":2,"requestSuccessCount":2,"requestFailureCount":0,"requestCancelledCount":0,"requestAvgCompletionSeconds":0,"requestSuccessAvgCompletionSeconds":0,"requestFailureAvgCompletionSeconds":null,"requestCancelledAvgCompletionSeconds":null}},{"location":{"id":1,"externalId":null,"status":{"id":null,"name":"Active"},"parentOrgName":null,"name":"John Muir Medical Center","description":null,"type":"Hospital","address":null,"externalLastUpdateDate":null,"creationDate":null,"lastModifiedDate":null,"endpoints":[]},"calculationStart":null,"calculationEnd":null,"calculationNumRequests":null,"patientDiscoveryStats":{"requestCount":2,"requestSuccessCount":2,"requestFailureCount":0,"requestCancelledCount":0,"requestAvgCompletionSeconds":0,"requestSuccessAvgCompletionSeconds":0,"requestFailureAvgCompletionSeconds":null,"requestCancelledAvgCompletionSeconds":null}}]
        mock.chart = {type:'PieChart',options:{title:'San Ramon Regional Medical Center (average response time: 0s)',is3D:true},data:{cols:[{id:'s',label:'Status',type:'string'},{id:'c',label:'Count',type:'number'}],rows:[{c:[{v:'Success'},{v:2}]},{c:[{v:'Failed'},{v:0}]},{c:[{v:'Cancelled'},{v:0}]}]}}

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getLocationStatistics = jasmine.createSpy('getLocationStatistics');
                    $delegate.isAuthenticated = jasmine.createSpy('isAuthenticated');
                    return $delegate;
                });
            });
            inject(function (_$compile_, _$interval_, _$log_, _$q_, _$rootScope_, _commonService_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                $q = _$q_;
                $interval = _$interval_;
                commonService = _commonService_;
                commonService.getLocationStatistics.and.returnValue($q.when(mock.statistics));
                commonService.isAuthenticated.and.returnValue(true);

                el = angular.element('<ai-location-status></ai-location-status>');

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

        it('should load the queried Locations on load', function () {
            expect(vm.locationStatistics.length).toBe(4);
        });

        it('should call commonService.queryLocationStatistics on load', function () {
            expect(commonService.getLocationStatistics).toHaveBeenCalled();
        });

        it('should make the statistics arrays', function () {
            expect(vm.locationStatistics[0].statistics).toEqual(mock.chart);
        });

        it('should leave statistics as null if the location has no requests', function () {
            expect(vm.locationStatistics[0].statistics).toBeDefined();
            mock.statistics[0].patientDiscoveryStats.requestCount = 0;
            $interval.flush(vm.INTERVAL_MILLIS);
            expect(vm.locationStatistics[0].statistics).toBe(null);
        });

        it('should re-query the location statistics on a regular interval', function () {
            expect(commonService.getLocationStatistics.calls.count()).toBe(1);
            $interval.flush(vm.INTERVAL_MILLIS);
            expect(commonService.getLocationStatistics.calls.count()).toBe(2);
            $interval.flush(vm.INTERVAL_MILLIS);
            expect(commonService.getLocationStatistics.calls.count()).toBe(3);
        });

        it('should be able to stop the statistics interval', function () {
            expect(vm.stopIntervalStatistics).toBeDefined();
            expect(vm.stopStatistics).toBeDefined();
            vm.stopIntervalStatistics();
            expect(vm.stopStatistics).not.toBeDefined();
        });

        it('should not call commonService.queryLocationStatistics if not authenticated', function () {
            expect(commonService.getLocationStatistics.calls.count()).toBe(1);
            commonService.isAuthenticated.and.returnValue(false);
            vm.getLocationStatistics();
            el.isolateScope().$digest();
            expect(commonService.getLocationStatistics.calls.count()).toBe(1);
        });
    });
})();
