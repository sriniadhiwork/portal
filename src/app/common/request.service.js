(function () {
    'use strict';

    angular
        .module('portal.common')
        .service('requestService', requestService)
        .config(config);

    /** @ngInject */
    function requestService ($localStorage) {
        var self = this;

        self.request = request;

        ////////////////////////////////////////////////////////////////////

        function request(config) {
            var token = $localStorage.jwtToken;
            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token;
            }
            return config;
        }
    }

    /** @ngInject */
    function config($httpProvider) {
        $httpProvider.interceptors.push('requestService');
    }
})();
