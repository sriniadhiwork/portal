(function () {
    'use strict';

    describe('portal.common.services', function () {

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

        var commonService, $httpBackend, requestHandler;

        requestHandler = {};

        var iatDate = new Date();
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + 1);
        var jwt = '{"username": "test2","id": ' + 2 + ',"iat": ' + iatDate.getTime() + ', "exp": ' + expDate.getTime() +
            ',"Identity":[-1,"ADMIN","Bob","Jones",{"name":"ACF Number 1"}],"Authorities":["ROLE_ADMIN","DA_ADMIN"] }';
        var tokenPrefix = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.';
        var tokenSuffix = '.Fo482cebe7EfuTtGHjvgsMByC0l-V8ZULMlCNVoxWmI'

        var mock = {};
        mock.patientQueryResponse = {results: [{id:2, firstName: 'Joe', lastName: 'Rogan'}, {id:3, firstName: 'Sue', lastName: 'Samson'}]};
        mock.patientDocuments = {results: [{id:2, title: 'Title of a doc', filetype: 'C-CDA 1'}, {id:3, title: 'Another title', filetype: 'C-CDA 2.2'}]};
        mock.fakeDocument = {data: "<document><made><of>XML</of></made></document"};
        mock.organizations = [{id:2, title: 'Title of a doc', url: 'http://www.example.com', status: 'Active'}, {id:3, title: 'Another title', url: 'http://www.example.com/2', status: 'Inactive'}];
        mock.acfs =[{id: 1, name: 'ACF 1', address: {}}, {id: 2, name: 'ACF 2', address: {}}];
        mock.newAcf = 'New ACF';

        beforeEach(inject(function (_commonService_, _$httpBackend_, $window, $localStorage) {
            commonService = _commonService_;
            $httpBackend = _$httpBackend_;
            mock.token = tokenPrefix + $window.btoa(jwt) + tokenSuffix;
            delete($localStorage.jwtToken);

            requestHandler.getAuthJwt = $httpBackend.whenGET('/auth/jwt').respond(200, {token: mock.token});
            requestHandler.getRestQueryPatientDocuments = $httpBackend.whenGET('/rest/query/patient/3/documents').respond(200, {results: mock.patientDocuments});
            requestHandler.getDocument = $httpBackend.whenGET('/rest/query/patient/3/documents/2').respond(200, {results: mock.fakeDocument});
            requestHandler.getOrganizations = $httpBackend.whenGET('/rest/organizations').respond(200, {results: mock.organizations});
            requestHandler.getAcfs = $httpBackend.whenGET('/rest/acfs').respond(200, {results: mock.acfs});
            requestHandler.setAcf = $httpBackend.whenPOST('/rest/acfs/set', {}).respond(200, {results: {}});
            requestHandler.addAcf = $httpBackend.whenPOST('/rest/acfs/add', {name: mock.newAcf}).respond(200, {results: {}});
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
            });

            it('should know the logged in user\'s name', function () {
                commonService.saveToken(mock.token);
                expect(commonService.getUsername()).toEqual('Bob Jones');
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

            it('should allow the user to log in', function () {
                //$httpBackend.expectGET('/auth/jwt').respond(200, {token: mock.token});
                commonService.login();
                expect(commonService.isAuthenticated()).toBeFalsy();
                expect(commonService.getToken()).toBeUndefined();
                $httpBackend.flush();
                expect(commonService.isAuthenticated()).toBeTruthy();
                expect(commonService.getToken()).toEqual(mock.token);
            });

            it('should return a message if the user doesn\'t log in', function () {
                requestHandler.getAuthJwt.respond(401, {message: 'test'});
                commonService.login().then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should allow the user to log out', function () {
                commonService.saveToken(mock.token);
                expect(commonService.isAuthenticated()).toBeTruthy();
                commonService.logout();
                expect(commonService.isAuthenticated()).toBeFalsy();
            });
        });

        describe('should call /rest endpoints', function () {

            it('should call /query/patient', function () {
                $httpBackend.expectPOST('/rest/query/patient', {}).respond(200, {results: mock.patientQueryResponse});
                commonService.queryPatient({});
                $httpBackend.flush();
            });

            it('should reject a call that doesn\'t return an object', function () {
                $httpBackend.expectPOST('/rest/query/patient', {}).respond(401, {message: 'a rejection'});
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

            it('should call /acfs/add', function () {
                commonService.addAcf(mock.newAcf);
                $httpBackend.flush();
                requestHandler.addAcf.respond(401, {message: 'a rejection'});
                commonService.addAcf(mock.newAcf).then(function (response) {
                    expect(response).toEqual('a rejection');
                });
                $httpBackend.flush();
            });
        });
    });
})();
