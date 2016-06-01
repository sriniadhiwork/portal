(function () {
    'use strict';

    angular
        .module('portal.common')
        .constant('API', '/rest')
        .constant('AuthAPI', '/auth')
        .service('commonService', commonService);

    /** @ngInject */
    function commonService ($http, $q, API, AuthAPI, $log, $localStorage, $window) {
        var self = this;

        self.getGreeting = getGreeting;
        self.getToken = getToken;
        self.getUsername = getUsername;
        self.isAuthenticated = isAuthenticated;
        self.login = login;
        self.logout = logout;
        self.saveToken = saveToken;

        ////////////////////////////////////////////////////////////////////

        function getGreeting (name) {
            if (name) {
                return getApi('/greeting/greeting?name=' + name);
            } else {
                return getApi('/greeting/greeting');
            }
        }

        function getToken () {
            //$log.debug('in getToken', $localStorage.jwtToken);
            return $localStorage.jwtToken;
        }

        function getUsername () {
            //$log.debug('in getusername');
            if (self.isAuthenticated()) {
                var token = self.getToken();
                var identity = parseJwt(token).Identity;
                //$log.debug('identity', identity);
                return identity[0] + ' ' + identity[1];
            } else {
                self.logout();
                return '';
            }
        }

        function isAuthenticated () {
            var token = self.getToken();
            if (token) {
                var params = parseJwt(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        }

        function login () {
            return getApi('/jwt', AuthAPI)
                .then(function (response) {
                    //$log.debug('calling jwt', response);
                    self.saveToken(response.token);
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function logout () {
            delete($localStorage.jwtToken);
        }

        function saveToken (token) {
            $localStorage.jwtToken = token;
        }

        ////////////////////////////////////////////////////////////////////

        function getApi (endpoint, api) {
            if (api === null || angular.isUndefined(api))
                api = API;
            return $http.get(api + endpoint)
                .then(function(response) {
                    return response.data;
                }, function (response) {
                    return $q.reject(response);
                });
        }

        function parseJwt (token) {
            var base64 = token.split('.')[1].replace('-','+').replace('_','/');
            return angular.fromJson($window.atob(base64));
        }
        /*
        function postApi (endpoint, postObject) {
            return $http.post(API + endpoint, postObject)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    return $q.reject(response);
                });
        }
        */
    }
})();
