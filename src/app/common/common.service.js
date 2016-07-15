(function () {
    'use strict';

    angular
        .module('portal.common')
        .service('commonService', commonService);

    /** @ngInject */
    function commonService ($http, $q, API, AuthAPI, LogoutRedirect, $log, $localStorage, $window) {
        var self = this;

        self.addAcf = addAcf;
        self.getAcfs = getAcfs;
        self.getDocument = getDocument
        self.getToken = getToken;
        self.getUserAcf = getUserAcf;
        self.getUsername = getUsername;
        self.isAuthenticated = isAuthenticated;
        self.login = login;
        self.logout = logout;
        self.queryOrganizations = queryOrganizations;
        self.queryPatient = queryPatient;
        self.queryPatientDocuments = queryPatientDocuments;
        self.saveToken = saveToken;
        self.setAcf = setAcf;

        ////////////////////////////////////////////////////////////////////

        function addAcf (newAcf) {
            return postApi('/acfs/add', {name: newAcf})
                .then(function (response) {
                    self.saveToken(response); //DEBUG
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function getAcfs () {
            return getApi('/acfs')
                .then(function (response) {
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function getDocument (patientId, documentId) {
            return getApi('/query/patient/' + patientId + '/documents/' + documentId)
                .then(function (response) {
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function getToken () {
            return $localStorage.jwtToken;
        }

        function getUserAcf () {
            if (self.isAuthenticated()) {
                var token = self.getToken();
                var identity = parseJwt(token).Identity;
                return identity[4];
            } else {
                self.logout();
                return '';
            }
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

        function login () {
            // fake login function
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
            $window.location.replace(LogoutRedirect);
        }

        function queryOrganizations () {
            return getApi('/organizations')
                .then(function (response) {
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function queryPatient (queryObj) {
            return postApi('/query/patient', queryObj)
                .then(function (response) {
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function queryPatientDocuments (patientId) {
            return getApi('/query/patient/' + patientId + '/documents')
                .then(function (response) {
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function saveToken (token) {
            $localStorage.jwtToken = token;
        }

        function setAcf (acf) {
            return postApi('/acfs/set', acf)
                .then(function (response) {
                    self.saveToken(response); //DEBUG
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
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
