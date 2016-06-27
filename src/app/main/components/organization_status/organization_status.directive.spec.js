(function() {
    'use strict';

    describe('main.aiOrganizationStatus', function() {
        var vm, el, $log, $q, $interval, commonService, mock;
        mock = {organizations: {results: [{id:2, title: 'Title of a doc', url: 'http://www.example.com', status: 'Active'}, {id:3, title: 'Another title', url: 'http://www.example.com/2', status: 'Inactive'}]}};

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.queryOrganizations = jasmine.createSpy();
                    return $delegate;
                });
            });
            inject(function($compile, $rootScope, _$log_, _$q_, _$interval_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                $interval = _$interval_;
                commonService = _commonService_;
                commonService.queryOrganizations.and.returnValue($q.when(mock.organizations));

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

        it('should have a function to query for patient documents', function () {
            expect(vm.queryOrganizations).toBeDefined();
        });

        it('should call commonService.queryOrganizations on load', function () {
            expect(commonService.queryOrganizations).toHaveBeenCalled();
        });

        it('should load the queried Organizations on load', function () {
            expect(vm.organizations.length).toBe(2);
        });

        it('should re-query the organizations on a regular interval', function () {
            expect(commonService.queryOrganizations.calls.count()).toBe(1);
            $interval.flush(vm.INTERVAL_MILLIS);
            expect(commonService.queryOrganizations.calls.count()).toBe(2);
            $interval.flush(vm.INTERVAL_MILLIS);
            expect(commonService.queryOrganizations.calls.count()).toBe(3);
        });

        it('should be able to stop the interval', function () {
            expect(vm.stopInterval).toBeDefined();
            expect(vm.stop).toBeDefined();
            vm.stopInterval();
            expect(vm.stop).not.toBeDefined();
        });
    });
})();
