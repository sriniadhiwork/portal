(function() {
    'use strict';

    describe('main.aiAcfPatientList', function() {
        var vm, el, $log, $q, commonService, mock;
        mock = {
            patients: [{
                firstName: 'Bob', id: 1, lastName: 'Smith',
                documents: [{id:2, title: 'Title of a doc', filetype: 'C-CDA 1'}, {id:3, title: 'Another title', filetype: 'C-CDA 2.2'}]
            }, {
                id: 2, firstName: 'Bob2', lastName: 'SmithSon',
                documents: []
            }],
            fakeDocument: {data: "<document><made><of>XML</of></made></document"},
            userAcf: 'ACF Number 1'
        };

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.cacheDocument = jasmine.createSpy('cacheDocument');
                    $delegate.getDocument = jasmine.createSpy('getDocument');
                    $delegate.getPatientsAtAcf = jasmine.createSpy('getPatientsAtAcf');
                    $delegate.getUserAcf = jasmine.createSpy('getUserAcf');
                    return $delegate;
                });
            });
            inject(function($compile, $rootScope, _$log_, _$q_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.cacheDocument.and.returnValue($q.when({data: ''}));
                commonService.getDocument.and.returnValue($q.when(angular.copy(mock.fakeDocument)));
                commonService.getPatientsAtAcf.and.returnValue($q.when(angular.copy(mock.patients)));
                commonService.getUserAcf.and.returnValue($q.when(mock.userAcf));

                el = angular.element('<ai-acf-patient-list></ai-acf-patient-list>');

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
            expect(vm.patients.length).toBe(2);
        });

        it('should have a way to cache a document', function () {
            expect(vm.patients[0].documents[0].cached).toBeUndefined();
            expect(vm.cacheDocument).toBeDefined();

            vm.cacheDocument(vm.patients[0], vm.patients[0].documents[0]);
            el.isolateScope().$digest();

            expect(commonService.cacheDocument).toHaveBeenCalledWith(1,2);
            expect(vm.patients[0].documents[0].cached).toBe(true);
        });

        it('should have a way to get a document', function () {
            var patient = vm.patients[0];
            vm.cacheDocument(patient, patient.documents[0]);
            el.isolateScope().$digest();

            vm.getDocument(patient, patient.documents[0]);
            el.isolateScope().$digest();

            expect(commonService.getDocument).toHaveBeenCalledWith(1,2);
            expect(vm.activeDocument).toEqual(patient.documents[0]);
        });

        it('should not re-call the service if the document is already cached', function () {
            var patient = vm.patients[0];
            vm.getDocument(patient, patient.documents[0]);
            el.isolateScope().$digest();

            vm.getDocument(patient, patient.documents[0]);
            el.isolateScope().$digest();
            expect(commonService.getDocument.calls.count()).toBe(1);
        });

        it('should have a way to discharge patients', function () {
            // given a patient in the queue
            expect(vm.patients.length).toBe(2);

            // when first result is cleared
            vm.dischargePatient(0);

            // then expect to have one les patient in the queue
            expect(vm.patients.length).toBe(1);
        });

        it('should not try to clear an out of bounds query', function () {
            var patientQueueLength = vm.patients.length;
            vm.dischargePatient(patientQueueLength + 1);
            expect(vm.patients.length).toBe(patientQueueLength);
        });

        it('should know the user\'s ACF', function () {
            expect(vm.getUserAcf).toBeDefined();
            vm.getUserAcf().then(function (response) {
                expect(response).toEqual(mock.userAcf);
            });
        });

        it('should call "getPatientsAtAcf" on load', function () {
            expect(commonService.getPatientsAtAcf).toHaveBeenCalled();
        });
    });
})();
