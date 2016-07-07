(function () {
    'use strict';

    describe('portal.common.services', function () {

        var commonService, $httpBackend, $window, requestHandler;
        var API, AuthAPI, LogoutRedirect;

        requestHandler = {};

        var iatDate = new Date();
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + 1);
        var jwt = angular.toJson({username: 'test2', id: 2, iat: iatDate.getTime(), exp: expDate.getTime(), Identity: ['Bob','Jones','email@sample.org', {name: 'ACF Number 1', address: {}, id: 0}], Authorities: ['ROLE_ADMIN', 'DA_ADMIN']});
        var jwtWithoutAcf = angular.toJson({username: 'test2', id: 2, iat: iatDate.getTime(), exp: expDate.getTime(), Identity: ['Bob','Jones','email@sample.org', {}], Authorities: ['ROLE_ADMIN', 'DA_ADMIN']});
        var tokenPrefix = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.';
        var tokenSuffix = '.Fo482cebe7EfuTtGHjvgsMByC0l-V8ZULMlCNVoxWmI'

        var mock = {};
        mock.acfs = [{id: 1, name: 'ACF 1', address: {}}, {id: 2, name: 'ACF 2', address: {}}];
        mock.fakeDocument = {data: "<document><made><of>XML</of></made></document"};
        mock.newAcf = {name: 'New ACF'};
        mock.organizations = [{id:2, title: 'Title of a doc', url: 'http://www.example.com', status: 'Active'}, {id:3, title: 'Another title', url: 'http://www.example.com/2', status: 'Inactive'}];
        mock.patientDocuments = {results: [{id:2, title: 'Title of a doc', filetype: 'C-CDA 1'}, {id:3, title: 'Another title', filetype: 'C-CDA 2.2'}]};
        mock.patientQueryResponse = {results: [{id:2, firstName: 'Joe', lastName: 'Rogan'}, {id:3, firstName: 'Sue', lastName: 'Samson'}]};
        mock.stagePatient = { patientRecords: [0,1], id: 1, patient: { firstName: 'Joe', lastName: 'Watson' } };

        beforeEach(module('portal.common', 'portal.constants'));

        var $log;
        beforeEach(inject(function (_$log_) {
            $log = _$log_;
        }));
        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        beforeEach(inject(function (_commonService_, _$httpBackend_, _$window_, $localStorage, _LogoutRedirect_, _API_, _AuthAPI_) {
            commonService = _commonService_;
            $httpBackend = _$httpBackend_;
            $window = _$window_;
            mock.token = tokenPrefix + $window.btoa(jwt) + tokenSuffix;
            mock.tokenWOAcf = tokenPrefix + $window.btoa(jwtWithoutAcf) + tokenSuffix;
            LogoutRedirect = _LogoutRedirect_;
            API = _API_;
            AuthAPI = _AuthAPI_;
            delete($localStorage.jwtToken);

            spyOn($window.location, 'replace');
            requestHandler.createAcf = $httpBackend.whenPOST(API + '/acfs/create', mock.newAcf).respond(200, {results: {}});
            requestHandler.editAcf = $httpBackend.whenPOST(API + '/acfs/1/edit', mock.newAcf).respond(200, {acf: mock.newAcf});
            requestHandler.getAcfs = $httpBackend.whenGET(API + '/acfs').respond(200, {results: mock.acfs});
            requestHandler.getDocument = $httpBackend.whenGET(API + '/patients/3/documents/2').respond(200, {results: mock.fakeDocument});
            requestHandler.getOrganizations = $httpBackend.whenGET(API + '/organizations').respond(200, {results: mock.organizations});
            requestHandler.getRestQueryPatientDocuments = $httpBackend.whenGET(API + '/patients/3/documents').respond(200, {results: mock.patientDocuments});
            requestHandler.getSamlUserToken = $httpBackend.whenGET(AuthAPI + '/jwt').respond(200, {token: mock.token});
            requestHandler.setAcf = $httpBackend.whenPOST(AuthAPI + '/jwt/setAcf', {}).respond(200, {token: mock.token});
            requestHandler.stagePatient = $httpBackend.whenPOST(API + '/queries/1/stage', mock.stagePatient).respond(200, {});
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('user authentication issues', function () {

            it('should read a jwt to see if the user is authenticated', function () {
                expect(commonService.isAuthenticated()).toBeFalsy();
                commonService.saveToken(mock.token);
                expect(commonService.isAuthenticated()).toBeTruthy();
                expect(commonService.getToken()).toEqual(mock.token);
                commonService.logout();
                requestHandler.getSamlUserToken.respond(200, {token: 'fake token'});
                commonService.getToken(true);
                $httpBackend.flush();
                expect(commonService.getToken()).toBeUndefined();
                commonService.saveToken('invalid token format');
                expect(commonService.isAuthenticated()).toBeFalsy();
            });

            it('should know the logged in user\'s name', function () {
                commonService.saveToken(mock.token);
                expect(commonService.getUsername()).toEqual('Bob Jones');
            });

            it('should know the logged in user\'s ACF', function () {
                commonService.saveToken(mock.token);
                expect(commonService.hasAcf()).toBeTruthy();
                commonService.logout();
                expect(commonService.hasAcf()).toBeFalsy();
                commonService.saveToken(mock.tokenWOAcf);
                expect(commonService.hasAcf()).toBeFalsy();
            });

            it('should know the logged in user\'s ACF', function () {
                commonService.saveToken(mock.token);
                expect(commonService.getUserAcf().name).toEqual('ACF Number 1');
                commonService.logout();
                expect(commonService.getUserAcf()).toEqual('');
            });

            it('should not have a username if the user isn\'t logged in', function () {
                commonService.logout();
                expect(commonService.getUsername()).toEqual('');
            });

            it('should allow the user to log out', function () {
                commonService.saveToken(mock.token);
                expect(commonService.isAuthenticated()).toBeTruthy();
                commonService.logout();
                expect(commonService.isAuthenticated()).toBeFalsy();
            });

            it('should redirect the user to an external page on logout', function () {
                commonService.logout();
                expect($window.location.replace).toHaveBeenCalledWith(LogoutRedirect);
            });

            it('should call the saml SP to find the Spring Boot User Object', function () {
                commonService.getSamlUserToken();
                $httpBackend.flush();
                requestHandler.getSamlUserToken.respond(401, {message: 'test'});
                commonService.getSamlUserToken().then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should call the saml SP on getToken if the user is not logged in', function () {
                $httpBackend.expectGET(AuthAPI + '/jwt');
                commonService.getToken(true);
                $httpBackend.flush();
            });
        });

        describe('should call /rest endpoints', function () {

            it('should call /patients', function () {
                $httpBackend.expectPOST(API + '/search', {}).respond(200, {results: mock.patientQueryResponse});
                commonService.queryPatient({});
                $httpBackend.flush();
            });

            it('should reject a call that doesn\'t return an object', function () {
                $httpBackend.expectPOST(API + '/search', {}).respond(401, {message: 'a rejection'});
                commonService.queryPatient({}).then(function (response) {
                    expect(response).toEqual('a rejection');
                });
                $httpBackend.flush();
            });

            it('should call /query/patientDocuments', function () {
                commonService.queryPatientDocuments(3);
                $httpBackend.flush();
                requestHandler.getRestQueryPatientDocuments.respond(401, {message: 'test'});
                commonService.queryPatientDocuments(3).then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should return data of a document', function () {
                commonService.getDocument(3,2);
                $httpBackend.flush();
                requestHandler.getDocument.respond(401, {message: 'test'});
                commonService.getDocument(3,2).then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should call /organizations', function () {
                commonService.queryOrganizations();
                $httpBackend.flush();
                requestHandler.getOrganizations.respond(401, {message: 'test'});
                commonService.queryOrganizations().then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should call /acfs', function () {
                commonService.getAcfs();
                $httpBackend.flush();
                requestHandler.getAcfs.respond(401, {message: 'test'});
                commonService.getAcfs().then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should call /acfs/set', function () {
                commonService.setAcf({});
                $httpBackend.flush();
                requestHandler.setAcf.respond(401, {message: 'a rejection'});
                commonService.setAcf({}).then(function (response) {
                    expect(response).toEqual('a rejection');
                });
                $httpBackend.flush();
            });

            it('should call /acfs/create', function () {
                commonService.createAcf(mock.newAcf);
                $httpBackend.flush();
                requestHandler.createAcf.respond(401, {message: 'a rejection'});
                commonService.createAcf(mock.newAcf).then(function (response) {
                    expect(response).toEqual('a rejection');
                });
                $httpBackend.flush();
            });

            it('should call /acfs/{{id}}/edit', function () {
                mock.newAcf.id = 1;
                $httpBackend.expectPOST(AuthAPI + '/jwt/setAcf', mock.newAcf).respond(200, {});
                commonService.editAcf(mock.newAcf);
                $httpBackend.flush();
                requestHandler.editAcf.respond(401, {message: 'a rejection'});
                commonService.editAcf(mock.newAcf).then(function (response) {
                    expect(response).toEqual('a rejection');
                });
                $httpBackend.flush();
            });

            it('should call setAcf after calling acfs/edit', function () {
                spyOn(commonService, 'setAcf');
                mock.newAcf.id = 1;
                commonService.editAcf(mock.newAcf);
                $httpBackend.flush();
                expect(commonService.setAcf).toHaveBeenCalledWith(mock.newAcf);
            });

            it('should call /queries/{{id}}/stage', function () {
                commonService.stagePatient(mock.stagePatient);
                $httpBackend.flush();
                requestHandler.stagePatient.respond(401, {message: 'a rejection'});
                commonService.stagePatient(mock.stagePatient).then(function (response) {
                    expect(response).toEqual('a rejection');
                });
                $httpBackend.flush();
            });
        });
    });
})();
