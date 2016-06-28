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
        self.getSamlUserToken = getSamlUserToken;
        self.getToken = getToken;
        self.getUserAcf = getUserAcf;
        self.getUsername = getUsername;
        self.hasAcf = hasAcf;
        self.isAuthenticated = isAuthenticated;
        self.logout = logout;
        self.queryOrganizations = queryOrganizations;
        self.queryPatient = queryPatient;
        self.queryPatientDocuments = queryPatientDocuments;
        self.saveToken = saveToken;
        self.setAcf = setAcf;

        ////////////////////////////////////////////////////////////////////

        function addAcf (newAcf) {
            return postApi('/acfs/create', {name: newAcf})
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
            return getApi('/patients/' + patientId + '/documents/' + documentId)
                .then(function (response) {
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function getSamlUserToken () {
            return getApi('/jwt', AuthAPI)
                .then(function (response) {
                    return $q.when(response.token);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function getToken (callApi) {
            var token = $localStorage.jwtToken;
            if (!token && callApi) {
                self.getSamlUserToken().then(function(token) {
                    if (validTokenFormat(token)) {
                        self.saveToken(token);
                        return token;
                    } else {
                        return null
                    }
                });
            }
            return token;
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

        function hasAcf () {
            if (self.isAuthenticated()) {
                var token = self.getToken();
                var identity = parseJwt(token).Identity;
                if (identity[4] && angular.isString(identity[4].name))
                    return true;
                else
                    return false;
            } else {
                self.logout();
                return false;
            }
        }
        function isAuthenticated () {
            var token = self.getToken();
            if (token) {
                var params = parseJwt(token);
                if (params)
                    return Math.round(new Date().getTime() / 1000) <= params.exp;
                else
                    return false;
            } else {
                return false;
            }
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
            return postApi('/search', queryObj)
                .then(function (response) {
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function queryPatientDocuments (patientId) {
            return getApi('/patients/' + patientId + '/documents')
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
            if (validTokenFormat(token)) {
                var base64 = token.split('.')[1].replace('-','+').replace('_','/');
                return angular.fromJson($window.atob(base64));
            } else {
                return null;
            }
        }

        function postApi (endpoint, postObject) {
            return $http.post(API + endpoint, postObject)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    return $q.reject(response);
                });
        }

        function validTokenFormat(token) {
            return (angular.isString(token) && token.match(/.*\..*\..*/));
        }
    }
})();
