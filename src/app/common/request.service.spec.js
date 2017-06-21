(function () {
    'use strict';

    describe('Service Unit Tests', function () {

        var httpProviderIt, requestService, $httpBackend, $localStorage, API, AuthAPI, mock;
        mock = {
            token: 'a token',
            config: {
                headers: {},
                url: '',
            },
        }

        beforeEach(function () {
            module('portal.common', 'portal.constants', function ($httpProvider) {
                httpProviderIt = $httpProvider;
            });

            inject(function (_$httpBackend_, _$localStorage_, _API_, _AuthAPI_, _requestService_) {
                requestService = _requestService_;
                $httpBackend = _$httpBackend_;
                $localStorage = _$localStorage_;
                API = _API_;
                AuthAPI = _AuthAPI_;
                $localStorage.jwtToken = '';

                mock.config.url = API;
            })
        });

        describe('RequestService Tests', function () {

            it('should be defined', function () {
                expect(requestService).toBeDefined();
            });

            describe('HTTP tests', function () {

                it('should have the requestService as an interceptor', function () {
                    expect(httpProviderIt.interceptors).toContain('requestService');
                });

                it('should put the token in the headers after setting', function () {
                    $localStorage.jwtToken = mock.token;
                    $httpBackend.when('GET', API, null, function (headers) {
                        expect(headers.Authorization).toBe('Bearer ' + mock.token);
                    }).respond(200, {name: 'example' });
                });

                it('should put the token in the headers after setting', function () {
                    $localStorage.jwtToken = mock.token;
                    $httpBackend.when('GET', AuthAPI, null, function (headers) {
                        expect(headers.Authorization).toBe('Bearer ' + mock.token);
                    }).respond(200, {name: 'example' });
                });

                it('should not place a token in the http request headers if no token is set', function () {
                    var config = requestService.request(mock.config);
                    expect(config.headers['Authorization']).toBeUndefined();
                });

                it('should not place a token in the http request headers if not our API', function () {
                    var notOurConfig = angular.copy(mock.config);
                    notOurConfig.url = 'http://www.example.com';
                    var config = requestService.request(notOurConfig);
                    expect(config.headers['Authorization']).toBeUndefined();
                });

                it('should place a token in the http request headers after a token is set', function () {
                    $localStorage.jwtToken = mock.token;
                    var config = requestService.request(mock.config);
                    expect(config.headers['Authorization']).toBe('Bearer ' + mock.token);
                });
            });
        });
    });
})();
