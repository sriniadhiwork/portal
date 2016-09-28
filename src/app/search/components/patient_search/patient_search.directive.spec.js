(function() {
    'use strict';

    describe('search.aiPatientSearch', function() {
        var $compile, $rootScope, vm, el, $log, $q, commonService, mock;
        mock = {patientSearch: {results: [{id:2, givenName: 'Joe', familyName: 'Rogan'}, {id:3, givenName: 'Sue', familyName: 'Samson'}]}};

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.searchForPatient = jasmine.createSpy('commonService.searchForPatient');
                    return $delegate;
                });
            });
            inject(function(_$compile_, _$rootScope_, _$log_, _$q_, _commonService_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.searchForPatient.and.returnValue($q.when(mock.patientSearch));

                el = angular.element('<ai-patient-search></ai-patient-search>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;

                vm.queryForm = {
                    $error: { required: [1, 2], invalid: [3], notAnError: 4 },
                    $setDirty: function () { this.$dirty = true;
                                             this.$pristine = false;
                                           },
                    $setPristine: function () { this.$pristine = true; },
                    $setUntouched: function () { this.$untouched = true; }
                };
                vm.query = { givenName: 'fake', familyName: 'name' };
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

        it('should know how many errors the queryForm has', function () {
            expect(vm.errorCount()).toBe(3);
        });

        it('should have a function to query for patients', function () {
            expect(vm.searchForPatient).toBeDefined();
        });

        describe('submitting the search form', function () {
            beforeEach(function () {
                vm.queryForm.givenName = 'bob';
                vm.queryForm.familyName = 'jones';
                vm.queryForm.dob = new Date();
                vm.queryForm.gender = 'M';
                vm.queryForm.$setDirty();
            });

            it('should call commonService.searchForPatient on query', function () {
                vm.searchForPatient();
                expect(commonService.searchForPatient).toHaveBeenCalled();
            });

            it('should clear the query fields on a search', function () {
                vm.searchForPatient();
                expect(vm.query).toEqual({});
            });

            it('should wipe the form on a search', function () {
                vm.searchForPatient();
                expect(vm.queryForm.$pristine).toBe(true);
            });

            it('should hide errors on a search', function () {
                vm.searchForPatient();
                expect(vm.showFormErrors).toBe(false);
            });

            it('should set the addresses to blank on a search', function () {
                vm.query.addresses = [{},{}];
                vm.searchForPatient();
                expect(vm.query.addresses).toBeUndefined();
            });

            it('should tell the controller that a search was performed', function () {
                spyOn(vm,'triggerHandlers');
                vm.searchForPatient();
                el.isolateScope().$digest();
                expect(vm.triggerHandlers).toHaveBeenCalled();
            });
        });

        it('should not let a search be performed without required parameters', function () {
            vm.query = {};
            vm.queryForm.$invalid = true;
            vm.searchForPatient();
            expect(commonService.searchForPatient).not.toHaveBeenCalled();
            vm.queryForm.$setDirty();
            vm.query = { givenName: 'fake' };
            vm.searchForPatient();
            expect(commonService.searchForPatient).not.toHaveBeenCalled();
            vm.query = { familyName: 'last' };
            vm.searchForPatient();
            expect(commonService.searchForPatient).not.toHaveBeenCalled();
            vm.query = { dob: 'dob' };
            vm.searchForPatient();
            expect(commonService.searchForPatient).not.toHaveBeenCalled();
            vm.query = { gender: 'M' };
            vm.queryForm.$invalid = false;
            vm.searchForPatient();
            expect(commonService.searchForPatient).toHaveBeenCalled();
        });
    });
})();
