(function() {
    'use strict';

    describe('main.aiAcfPatientList', function() {
        var vm, el, $log, $q, commonService, mock;
        mock = {patientDocuments: {results: [{id:2, title: 'Title of a doc', filetype: 'C-CDA 1'}, {id:3, title: 'Another title', filetype: 'C-CDA 2.2'}]}};
        mock.fakeDocument = {data: "<document><made><of>XML</of></made></document"};
        mock.userAcf = 'ACF Number 1';

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.queryPatientDocuments = jasmine.createSpy();
                    $delegate.getDocument = jasmine.createSpy();
                    $delegate.getUserAcf = jasmine.createSpy('commonService.getUserAcf');
                    return $delegate;
                });
            });
            inject(function($compile, $rootScope, _$log_, _$q_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.queryPatientDocuments.and.returnValue($q.when(mock.patientDocuments));
                commonService.getDocument.and.returnValue($q.when(mock.fakeDocument));
                commonService.getUserAcf.and.returnValue($q.when(mock.userAcf));

                el = angular.element('<ai-acf-patient-list patients="[{firstName: \'Bob\', id: 1, lastName: \'Smith\', documents: [{},{}]}, {id: 2, firstName: \'Bob\', lastName: \'Smith\'}]"></ai-acf-patient-list>');

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

        it('should have a way to activate a document', function () {
            //given
            var patient = vm.patients[0];
            vm.getDocument(patient, patient.documents[0]);
            el.isolateScope().$digest();

            //when
            vm.activateDocument(patient.documents[0]);

            //then
            expect(vm.activeDocument).toEqual(patient.documents[0]);
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
            expect(vm.patients.length).toBe(2);

            vm.dischargePatient(2);

            expect(vm.patients.length).toBe(2);
        });

        it('should know the user\'s ACF', function () {
            expect(vm.getUserAcf).toBeDefined();
            vm.getUserAcf().then(function (response) {
                expect(response).toEqual(mock.userAcf);
            });
        });
    });
})();
