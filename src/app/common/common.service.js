(function () {
    'use strict';

    angular
        .module('portal.common')
        .constant('API', '/rest')
        .service('commonService', commonService);

    /** @ngInject */
    function commonService ($http, $q, API, $log, $localStorage, $window) {
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
            return $localStorage.jwtToken;
        }

        function getUsername () {
            if (self.isAuthenticated()) {
                var token = self.getToken();
                var identity = parseJwt(token).Identity;
                return identity[2] + ' ' + identity[3];
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

        function login (userObject) {
            return postApi('/authenticate/authenticate', userObject)
                .then(function (response) {
                    $log.debug(response);
                    self.saveToken(response.data);
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function logout () {
            postApi('/authenticate/logout', {})
                .then(function () {
                    delete($localStorage.jwtToken);
                });
        }

        function saveToken (token) {
            $localStorage.jwtToken = token;
        }

        ////////////////////////////////////////////////////////////////////

        function getApi (endpoint) {
            return $http.get(API + endpoint)
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

        function postApi (endpoint, postObject) {
            return $http.post(API + endpoint, postObject)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    return $q.reject(response);
                });
        }
    }
})();
