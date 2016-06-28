(function() {
    'use strict';

    describe('main.controller', function() {
        var vm, scope, commonService, $httpBackend, $window, requestHandler = {}, AuthAPI;

        var iatDate = new Date();
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + 1);
        var jwt = '{"username": "test2","id": ' + 2 + ',"iat": ' + iatDate.getTime() + ', "exp": ' + expDate.getTime() +
            ',"Identity":[-1,"ADMIN","Bob","Jones",{"name":"ACF Number 1"}],"Authorities":["ROLE_ADMIN","DA_ADMIN"] }';
        var tokenPrefix = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.';
        var tokenSuffix = '.Fo482cebe7EfuTtGHjvgsMByC0l-V8ZULMlCNVoxWmI'
        var mock = {};

        beforeEach(function () {
            module('portal.main', 'portal.constants');

            inject(function (_commonService_, _$httpBackend_, _$window_, $controller, $q, $rootScope, _AuthAPI_) {
                commonService = _commonService_;
                $httpBackend = _$httpBackend_;
                $window = _$window_;
                AuthAPI = _AuthAPI_;
                mock.token = tokenPrefix + $window.btoa(jwt) + tokenSuffix;
                scope = $rootScope.$new();
                vm = $controller('MainController');
                scope.$digest();

                requestHandler.getAcfs = $httpBackend.whenGET(AuthAPI + '/jwt').respond(200, {results: mock.token});
            });
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should know if the user is authenticated', function () {
            spyOn(commonService, 'isAuthenticated').and.returnValue(true);
            expect(vm.isAuthenticated).toBeDefined();
            expect(vm.isAuthenticated()).toBeTruthy();
        });

        it('should know if the user has an ACF', function () {
            spyOn(commonService, 'hasAcf').and.returnValue(true);
            expect(vm.hasAcf).toBeDefined();
            expect(vm.hasAcf()).toBeTruthy();
        });
    });
})();
