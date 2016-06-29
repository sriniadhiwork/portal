(function () {
    'use strict';

    describe('Service Unit Tests', function() {

        var httpProviderIt, requestService, $httpBackend, token = 'a token', $localStorage;

        beforeEach(function() {
            module('portal.common', function ($httpProvider) {
                httpProviderIt = $httpProvider;
            });

            inject(function (_requestService_, _$httpBackend_, _$localStorage_) {
                requestService = _requestService_;
                $httpBackend = _$httpBackend_;
                $localStorage = _$localStorage_;
                $localStorage.jwtToken = '';
            })
        });

        describe('RequestService Tests', function() {

            it('should be defined', function () {
                expect(requestService).toBeDefined();
            });

            describe('HTTP tests', function () {

                it('should have the requestService as an interceptor', function () {
                    expect(httpProviderIt.interceptors).toContain('requestService');
                });

                it('should put the token in the headers after setting', function() {
                    $localStorage.jwtToken = token;
                    $httpBackend.when('GET', 'http://example.com', null, function(headers) {
                        expect(headers.Authorization).toBe('Bearer ' + token);
                    }).respond(200, {name: 'example' });
                });

                it('should not place a token in the http request headers if no token is set', function() {
                    var config = requestService.request({headers: {} });
                    expect(config.headers['Authorization']).toBe(undefined);
                });

                it('should place a token in the http request headers after a token is set', function() {
                    $localStorage.jwtToken = token;
                    var config = requestService.request({headers: {} });
                    expect(config.headers['Authorization']).toBe('Bearer ' + token);
                });
            });
        });
    });
})();
