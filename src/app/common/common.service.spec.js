(function () {
    'use strict';

    describe('portal.common.services', function () {

        var commonService, $httpBackend, $window, requestHandler;
        var API, AuthAPI, LogoutRedirect;

        requestHandler = {};

        var mock = {};
        mock.userAcf = {name: 'ACF Number 1', address: {}, id: 0};
        var user = {
            user_id: 'user_id',
            username: 'username',
            auth_source: 'auth_source',
            full_name: 'full_name',
            organization: 'organization',
            purpose_for_use: 'purpose_for_use',
            role: 'role',
            acf: mock.userAcf,
            authorities: ['ROLE_ADMIN']
        };
        var iatDate = new Date();
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + 1);
        var jwt = angular.toJson({sub: user.username, iat: iatDate.getTime(), exp: expDate.getTime(), Identity: [user.user_id, user.username, user.auth_source, user.full_name, user.organization, user.purpose_for_use, user.role, mock.userAcf], Authorities: user.authorities});
        var jwtWithoutAcf = angular.toJson({sub: user.username, iat: iatDate.getTime(), exp: expDate.getTime(), Identity: [user.user_id, user.username, user.auth_source, user.full_name, user.organization, user.purpose_for_use, user.role, {}], Authorities: user.authorities});

        var tokenPrefix = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.';
        var tokenSuffix = '.Fo482cebe7EfuTtGHjvgsMByC0l-V8ZULMlCNVoxWmI'

        mock.acfs = [{id: 1, name: 'ACF 1', address: {}}, {id: 2, name: 'ACF 2', address: {}}];
        mock.fakeDocument = {data: '<document><made><of>XML</of></made></document'};
        mock.newAcf = {name: 'New ACF'};
        mock.locations = [{id:2, title: 'Title of a doc', url: 'http://www.example.com', status: 'Active'}, {id:3, title: 'Another title', url: 'http://www.example.com/2', status: 'Inactive'}];
        mock.patientDocuments = {results: [{id:2, title: 'Title of a doc', filetype: 'C-CDA 1'}, {id:3, title: 'Another title', filetype: 'C-CDA 2.2'}]};
        mock.patientQueryResponse = {results: [{id:2, givenName: 'Joe', familyName: 'Rogan'}, {id:3, givenName: 'Sue', familyName: 'Samson'}]};
        mock.stagePatient = { patientRecords: [0,1], id: 1, patient: { givenName: 'Joe', familyName: 'Watson' } };

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
            requestHandler.cacheDocument = $httpBackend.whenGET(API + '/patients/3/documents/2').respond(200, true);
            requestHandler.cancelQueryLocation = $httpBackend.whenPOST(API + '/queries/1/2/cancel', {}).respond(200, true);
            requestHandler.clearQuery = $httpBackend.whenPOST(API + '/queries/1/delete', {}).respond(200, true);
            requestHandler.createAcf = $httpBackend.whenPOST(API + '/acfs/create', mock.newAcf).respond(200, mock.newAcf);
            requestHandler.dischargePatient = $httpBackend.whenPOST(API + '/patients/1/delete', {}).respond(200, true);
            requestHandler.editAcf = $httpBackend.whenPOST(API + '/acfs/1/edit', mock.newAcf).respond(200, {acf: mock.newAcf});
            requestHandler.getAcfs = $httpBackend.whenGET(API + '/acfs').respond(200, {results: mock.acfs});
            requestHandler.getDocument = $httpBackend.whenGET(API + '/patients/3/documents/2?cacheOnly=false').respond(200, mock.fakeDocument);
            requestHandler.getLocations = $httpBackend.whenGET(API + '/locations').respond(200, {results: mock.locations});
            requestHandler.getLocationStatistics = $httpBackend.whenGET(API + '/locations/statistics').respond(200, {results: mock.locations});
            requestHandler.getQueries = $httpBackend.whenGET(API + '/queries').respond(200, {results: mock.patientQueryResponse});
            requestHandler.getPatientsAtAcf = $httpBackend.whenGET(API + '/patients').respond(200, {results: mock.patientQueryResponse});
            requestHandler.getRestQueryPatientDocuments = $httpBackend.whenGET(API + '/patients/3/documents').respond(200, {results: mock.patientDocuments});
            requestHandler.getSamlUserToken = $httpBackend.whenGET(AuthAPI + '/jwt').respond(200, {token: mock.token});
            requestHandler.refreshToken = $httpBackend.whenGET(AuthAPI + '/jwt/keepalive').respond(200, {token: mock.token});
            requestHandler.setAcf = $httpBackend.whenPOST(AuthAPI + '/jwt/setAcf', {}).respond(200, {token: mock.token});
            requestHandler.stagePatient = $httpBackend.whenPOST(API + '/queries/1/stage', mock.stagePatient).respond(200, {});
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('utility functions', function () {
            it('should have a function to assemble names', function () {
                expect(commonService.displayName).toBeDefined();
            });

            it('should display names correctly', function () {
                var name = {
                    givenName: ['John', 'Andrew'],
                    familyName: 'Smith',
                    nameType: {code: 'L', description: 'Legal Name'}
                };
                expect(commonService.displayName(name)).toBe('John Andrew Smith (Legal Name)');
                name.prefix = 'Mr';
                expect(commonService.displayName(name)).toBe('Mr John Andrew Smith (Legal Name)');
                name.suffix = 'III';
                expect(commonService.displayName(name)).toBe('Mr John Andrew Smith III (Legal Name)');
                name.profSuffix = 'DDS';
                expect(commonService.displayName(name)).toBe('Mr John Andrew Smith III, DDS (Legal Name)');
                name.nameAssembly = {code: 'F'};
                expect(commonService.displayName(name)).toBe('Mr Smith John Andrew III, DDS (Legal Name)');
                name.nameType = {code: 'D'};
                expect(commonService.displayName(name)).toBe('Mr Smith John Andrew III, DDS (Display Name)');
            });

            it('should display a message on names with missing required elements', function () {
                var name = {};
                expect(commonService.displayName(name)).toBe('(improper)');
                name.givenName = ['John', 'Andrew'];
                expect(commonService.displayName(name)).toBe('John Andrew (improper)');
                name.givenName = [];
                expect(commonService.displayName(name)).toBe('(improper)');
                name.familyName = 'Smith';
                expect(commonService.displayName(name)).toBe('Smith (improper)');
            });

            it('should have a function to join names', function () {
                expect(commonService.displayNames).toBeDefined();
            });

            it('should display names correctly', function () {
                var names = [{
                    givenName: ['John', 'Andrew'],
                    familyName: 'Smith',
                    nameType: {code: 'L', description: 'Legal Name'}
                },{
                    givenName: ['Sue', 'Mary'],
                    familyName: 'Smith',
                    nameType: {code: 'L', description: 'Legal Name'}
                }];
                expect(commonService.displayNames(names, '-')).toBe('John Andrew Smith (Legal Name)-Sue Mary Smith (Legal Name)');
            });

            it('should display names correctly', function () {
                var names = undefined;
                expect(commonService.displayNames(names, '-')).toBe('');
            });

            it('should have a function to get a friendly full name', function () {
                expect(commonService.friendlyFullName).toBeDefined();
            });

            it('should return a friendly full name', function () {
                var name = {
                    givenName: ['John', 'Andrew'],
                    familyName: 'Smith',
                    nameType: {code: 'L', description: 'Legal Name'}
                };
                expect(commonService.friendlyFullName(name)).toEqual('John Andrew Smith');
            });
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
                expect(commonService.getUserName()).toEqual('full_name');
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
                expect(commonService.getUserName()).toEqual('');
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
                requestHandler.getSamlUserToken.respond(401, {error: 'test'});
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

            it('should have a way to display the token parameters', function () {
                commonService.saveToken(mock.token);
                var storedJwt = commonService.getTokenVals();
                expect(storedJwt).toEqual(angular.fromJson(jwt));
            });

            it('should have a way to get the entire user\'s identity', function () {
                expect(commonService.getUserIdentity).toBeDefined();
                expect(commonService.getUserIdentity()).not.toEqual(user);
                commonService.saveToken(mock.token);
                expect(commonService.getUserIdentity()).toEqual(user);
            });

            it('should have a way to refresh the token', function () {
                commonService.refreshToken().then(function (response) {
                    expect(response).toEqual(mock.token);
                });
                $httpBackend.flush();
                requestHandler.refreshToken.respond(200, {token: 'fake token'});
                commonService.refreshToken().then(function (response) {
                    expect(response).toBeNull;
                });
                $httpBackend.flush();
                requestHandler.refreshToken.respond(401, {error: 'test'});
                commonService.refreshToken().then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should be able to clear the user\'s ACF', function () {
                commonService.saveToken(mock.token);
                commonService.clearToken();
                expect(commonService.hasAcf()).toBeFalsy();
            });
        });

        describe('should call /rest endpoints', function () {

            it('should call /patients', function () {
                $httpBackend.expectPOST(API + '/search', {}).respond(200, {results: mock.patientQueryResponse});
                commonService.searchForPatient({});
                $httpBackend.flush();
            });

            it('should reject a call that doesn\'t return an object', function () {
                $httpBackend.expectPOST(API + '/search', {}).respond(401, {error: 'a rejection'});
                commonService.searchForPatient({}).then(function (response) {
                    expect(response).toEqual('a rejection');
                });
                $httpBackend.flush();
            });

            it('should call /queries', function () {
                commonService.getQueries();
                $httpBackend.flush();
                requestHandler.getQueries.respond(401, {error: 'test'});
                commonService.getQueries().then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should call /queries/id/delete', function () {
                commonService.clearQuery(1);
                $httpBackend.flush();
                requestHandler.clearQuery.respond(401, {error: 'test'});
                commonService.clearQuery(1).then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should call /queries/locationid/queryid/cancel', function () {
                commonService.cancelQueryLocation(1,2);
                $httpBackend.flush();
                requestHandler.cancelQueryLocation.respond(401, {error: 'test'});
                commonService.cancelQueryLocation(1,2).then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should call /patients/id/delete', function () {
                commonService.dischargePatient(1);
                $httpBackend.flush();
                requestHandler.dischargePatient.respond(401, {error: 'test'});
                commonService.dischargePatient(1).then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should call /query/patientDocuments', function () {
                commonService.searchForPatientDocuments(3);
                $httpBackend.flush();
                requestHandler.getRestQueryPatientDocuments.respond(401, {error: 'test'});
                commonService.searchForPatientDocuments(3).then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should return data of a document', function () {
                commonService.getDocument(3,2);
                $httpBackend.flush();
                requestHandler.getDocument.respond(401, {error: 'test'});
                commonService.getDocument(3,2).then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should cache documents', function () {
                commonService.cacheDocument(3,2);
                $httpBackend.flush();
                requestHandler.cacheDocument.respond(401, {error: 'test'});
                commonService.cacheDocument(3,2).then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should call /locations', function () {
                commonService.queryLocations();
                $httpBackend.flush();
                requestHandler.getLocations.respond(401, {error: 'test'});
                commonService.queryLocations().then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should call /locations/statistics', function () {
                commonService.getLocationStatistics();
                $httpBackend.flush();
                requestHandler.getLocationStatistics.respond(401, {error: 'test'});
                commonService.getLocationStatistics().then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should call /acfs', function () {
                commonService.getAcfs();
                $httpBackend.flush();
                requestHandler.getAcfs.respond(401, {error: 'test'});
                commonService.getAcfs().then(function (response) {
                    expect(response.message).toEqual('test');
                });
                $httpBackend.flush();
            });

            it('should clear the token if an error comes back saying the ACF doesn\'t exist', function () {
                spyOn(commonService, 'clearToken');
                requestHandler.getAcfs.respond(401, {error: 'ACF something does not exist!'});
                commonService.getAcfs();
                $httpBackend.flush();
                expect(commonService.clearToken).toHaveBeenCalled();
            });

            it('should redirect the user if an error comes back saying the ACF doesn\'t exist', function () {
                requestHandler.getAcfs.respond(401, {error: 'ACF something does not exist!'});
                commonService.getAcfs();
                $httpBackend.flush();
                expect($window.location.replace).toHaveBeenCalledWith('#/');
            });

            it('should call /acfs/set', function () {
                commonService.setAcf({});
                $httpBackend.flush();
                requestHandler.setAcf.respond(401, {error: 'a rejection'});
                commonService.setAcf({}).then(function (response) {
                    expect(response).toEqual('a rejection');
                });
                $httpBackend.flush();
            });

            it('should call /acfs/create', function () {
                commonService.createAcf(mock.newAcf);
                $httpBackend.flush();
                requestHandler.createAcf.respond(401, {error: 'a rejection'});
                commonService.createAcf(mock.newAcf).then(function (response) {
                    expect(response).toEqual('a rejection');
                });
                $httpBackend.flush();
            });

            it('should call /acfs/{{id}}/edit', function () {
                mock.newAcf.id = 1;
                $httpBackend.expectPOST(AuthAPI + '/jwt/setAcf', {acf: mock.newAcf}).respond(200, {});
                commonService.editAcf(mock.newAcf);
                $httpBackend.flush();
                requestHandler.editAcf.respond(401, {error: 'a rejection'});
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
                expect(commonService.setAcf).toHaveBeenCalledWith({acf: mock.newAcf});
            });

            it('should call /queries/{{id}}/stage', function () {
                commonService.stagePatient(mock.stagePatient);
                $httpBackend.flush();
                requestHandler.stagePatient.respond(401, {error: 'a rejection'});
                commonService.stagePatient(mock.stagePatient).then(function (response) {
                    expect(response).toEqual('a rejection');
                });
                $httpBackend.flush();
            });

            it('should call /patients', function () {
                expect(commonService.getPatientsAtAcf).toBeDefined();
                commonService.getPatientsAtAcf();
                $httpBackend.flush();
                requestHandler.getPatientsAtAcf.respond(401, {error: 'a rejection'});
                commonService.getPatientsAtAcf().then(function (response) {
                    expect(response).toEqual('a rejection');
                });
                $httpBackend.flush();
            });
        });
    });
})();
