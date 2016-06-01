(function () {
    'use strict';

    describe('portal.common.services', function () {

        beforeEach(module('portal.common'));

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
            ',"Identity":["Bob","Jones","bob.jones@email.com"],"Authorities":["ROLE_ADMIN","DA_ADMIN"] }';
        var tokenPrefix = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.';
        var tokenSuffix = '.Fo482cebe7EfuTtGHjvgsMByC0l-V8ZULMlCNVoxWmI'

        var mock = {};
        mock.aGreeting = {id: 1, content: "Hello, world"};
        mock.aPersonalizedGreeting = {id: 1, content: "Hello, Bob"};

        beforeEach(inject(function (_commonService_, _$httpBackend_, $window, $localStorage) {
            commonService = _commonService_;
            $httpBackend = _$httpBackend_;
            mock.token = tokenPrefix + $window.btoa(jwt) + tokenSuffix;
            delete($localStorage.jwtToken);

            requestHandler.get = $httpBackend.whenGET('/rest/greeting/greeting').respond(mock.aGreeting);
            $httpBackend.whenGET('/rest/greeting/greeting?name=Bob').respond(mock.aPersonalizedGreeting);
            requestHandler.post = $httpBackend.whenPOST('/rest/authenticate/logout').respond(200);
            $httpBackend.whenGET('/auth/jwt').respond({token: mock.token});
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should return a greeting', function () {
            commonService.getGreeting().then(function (response) {
                expect(response).toEqual(mock.aGreeting);
            });
            $httpBackend.flush();
        });

        it('should return a customized greeting', function () {
            commonService.getGreeting('Bob').then(function (response) {
                expect(response).toEqual(mock.aPersonalizedGreeting);
            });
            $httpBackend.flush();
        });

        it('should reject a call that doesn\'t return an object', function () {
            requestHandler.get.respond(401, 'a rejection');
            commonService.getGreeting().then(function (response) {
                expect(response).toEqual('a rejection');
            });
            $httpBackend.flush();
        });

        it('should reject a call that doesn\'t return an object', function () {
            requestHandler.get.respond(401, 'a rejection');
            commonService.getGreeting().then(function (response) {
                expect(response).toEqual('a rejection');
            });
            $httpBackend.flush();
        });

        /*
        xit('should reject a call that doesn\'t return an object', function () {
            requestHandler.post.respond(401, {message: 'a rejection'});
            commonService.logout().then(function (response) {
                expect(response).toEqual('a rejection');
            });
            $httpBackend.flush();
        });
        */

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

        it('should not have a username if the user isn\'t logged in', function () {
            commonService.logout();
            expect(commonService.getUsername()).toEqual('');
        });

        it('should allow the user to log in', function () {
            $httpBackend.expectGET('/auth/jwt').respond(200, {token: mock.token});
            commonService.login();
            expect(commonService.isAuthenticated()).toBeFalsy();
            expect(commonService.getToken()).toBeUndefined();
            $httpBackend.flush();
            expect(commonService.isAuthenticated()).toBeTruthy();
            expect(commonService.getToken()).toEqual(mock.token);
        });

        it('should return a message if the user doesn\'t log in', function () {
            $httpBackend.expectGET('/auth/jwt').respond(401, {message: 'test'});
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
})();
