(function () {
    'use strict';

    angular
        .module('portal.common')
        .factory('requestService', requestService)
        .config(config);

    /** @ngInject */
    function requestService ($localStorage, API, AuthAPI) {
        var service = {
            request: request,
        }
        return service;

        ////////////////////////////////////////////////////////////////////

        function request (config) {
            var token = $localStorage.jwtToken;
            if (config.url.indexOf(API) === 0 || config.url.indexOf(AuthAPI) === 0) {
                if (token) {
                    config.headers['Authorization'] = 'Bearer ' + token;
                }
            }
            return config;
        }
    }

    /** @ngInject */
    function config ($httpProvider) {
        $httpProvider.interceptors.push('requestService');
    }
})();
