(function () {
    'use strict';

    angular
        .module('portal.common')
        .service('commonService', commonService);

    /** @ngInject */
    function commonService ($http, $q, API, AuthAPI, LogoutRedirect, $log, $localStorage, $window) {
        var self = this;

        self.cacheDocument = cacheDocument;
        self.clearQuery = clearQuery;
        self.createAcf = createAcf;
        self.dischargePatient = dischargePatient;
        self.displayName = displayName
        self.editAcf = editAcf;
        self.getAcfs = getAcfs;
        self.getDocument = getDocument;
        self.getQueries = getQueries;
        self.getPatientsAtAcf = getPatientsAtAcf;
        self.getSamlUserToken = getSamlUserToken;
        self.getToken = getToken;
        self.getTokenVals = getTokenVals;
        self.getUserAcf = getUserAcf;
        self.getUserIdentity = getUserIdentity;
        self.getUsername = getUsername;
        self.hasAcf = hasAcf;
        self.isAuthenticated = isAuthenticated;
        self.logout = logout;
        self.queryOrganizations = queryOrganizations;
        self.refreshToken = refreshToken;
        self.saveToken = saveToken;
        self.searchForPatient = searchForPatient;
        self.searchForPatientDocuments = searchForPatientDocuments;
        self.setAcf = setAcf;
        self.stagePatient = stagePatient;

        ////////////////////////////////////////////////////////////////////

        function cacheDocument (patientId, documentId) {
            return enhancedGet('/patients/' + patientId + '/documents/' + documentId);
        }

        function clearQuery (queryId) {
            return enhancedPost('/queries/' + queryId + '/delete', {});
        }

        function createAcf (newAcf) {
            return enhancedPost('/acfs/create', newAcf);
        }

        function dischargePatient (patientId) {
            return enhancedPost('/patients/' + patientId + '/delete', {});
        }

        function displayName (name) {
            var ret = '';
            ret += name.givens.join(' ');
            if (name.nameAssembly === 'F') {
                ret = name.family + ' ' + ret;
            } else {
                ret += ' ' + name.family;
            }
            if (name.prefix) {
                ret = name.prefix + ' ' + ret;
            }
            if (name.suffix) {
                ret += ' ' + name.suffix;
            }
            if (name.profSuffix) {
                ret += ', ' + name.profSuffix;
            }
            for (var i = 0; i < self.nameTypes.length; i++) {
                if (name.nameType === self.nameTypes[i].code) {
                    ret += ' (' + self.nameTypes[i].value + ')';
                }
            }
            return ret;
        }

        function editAcf (anAcf) {
            return postApi('/acfs/' + anAcf.id + '/edit', anAcf)
                .then(function (response) {
                    self.setAcf(response);
                    return $q.when(response);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function getAcfs () {
            return enhancedGet('/acfs');
        }

        function getDocument (patientId, documentId) {
            return enhancedGet('/patients/' + patientId + '/documents/' + documentId + '?cacheOnly=false');
        }

        function getQueries () {
            return enhancedGet('/queries');
        }

        function getPatientsAtAcf () {
            return enhancedGet('/patients');
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

        function getTokenVals () {
            var token = parseJwt(self.getToken());
            return token;
        }

        function getUserAcf () {
            if (self.hasAcf()) {
                var token = self.getToken();
                var identity = parseJwt(token).Identity;
                var acf = angular.fromJson(identity[3]);
                return acf;
            } else {
                return '';
            }
        }

        function getUserIdentity () {
            var user = { givenName: null, familyName: null, email: null, username: null, authorities: [] };
            if (self.isAuthenticated()) {
                var token = parseJwt(self.getToken());
                var identity = token.Identity;
                var authorities = token.Authorities;
                user.givenName = identity[0];
                user.familyName = identity[1];
                user.email = identity[2];
                user.authorities = authorities;
                user.username = token.sub;
            }
            return user;
        }

        function getUsername () {
            if (self.isAuthenticated()) {
                var token = self.getToken();
                var identity = parseJwt(token).Identity;
                return identity[0] + ' ' + identity[1];
            } else {
                return '';
            }
        }

        function hasAcf () {
            if (self.isAuthenticated()) {
                var token = self.getToken();
                var identity = parseJwt(token).Identity;
                if (identity[3] && angular.fromJson(identity[3]) && angular.isString(angular.fromJson(identity[3]).name))
                    return true;
                else
                    return false;
            } else {
                return false;
            }
        }
        function isAuthenticated () {
            var valid;
            var token = self.getToken();
            if (token) {
                var params = parseJwt(token);
                if (params)
                    valid =  Math.round(new Date().getTime() / 1000) <= params.exp;
                else
                    valid = false;
                if (!valid)
                    delete($localStorage.jwtToken);
            } else {
                valid = false;
            }
            return valid;
        }

        function logout () {
            delete($localStorage.jwtToken);
            $window.location.replace(LogoutRedirect);
        }

        function queryOrganizations () {
            return enhancedGet('/organizations');
        }

        function refreshToken () {
            return getApi('/jwt/keepalive', AuthAPI)
                .then(function (response) {
                    if (validTokenFormat(response.token)) {
                        self.saveToken(response.token);
                        return $q.when(response.token);
                    } else {
                        return $q.when(null);
                    }
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function saveToken (token) {
            $localStorage.jwtToken = token;
        }

        function searchForPatient (queryObj) {
            return enhancedPost('/search', queryObj);
        }

        function searchForPatientDocuments (patientId) {
            return enhancedGet('/patients/' + patientId + '/documents');
        }

        function setAcf (acf) {
            return postApi('/jwt/setAcf', acf, AuthAPI)
                .then(function (response) {
                    self.saveToken(response.token);
                    return $q.when(response.token);
                }, function (error) {
                    return $q.reject(error);
                });
        }

        function stagePatient (patient) {
            return enhancedPost('/queries/' + patient.id + '/stage', patient);
        }

        ////////////////////////////////////////////////////////////////////

        function enhancedGet (endpoint) {
            return $http.get(API + endpoint)
                .then(function(response) {
                    return $q.when(response.data);
                }, function (response) {
                    return $q.reject(response);
                });
        }

        function enhancedPost (endpoint, postObject) {
            return $http.post(API + endpoint, postObject)
                .then(function (response) {
                    return $q.when(response.data);
                }, function (response) {
                    return $q.reject(response);
                });
        }

        function getApi (endpoint, api) {
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

        function postApi (endpoint, postObject, api) {
            if (api === null || angular.isUndefined(api))
                api = API;
            return $http.post(api + endpoint, postObject)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    return $q.reject(response);
                });
        }

        function validTokenFormat(token) {
            return (angular.isString(token) && token.match(/.*\..*\..*/));
        }

        self.nameTypes = [
            { code: 'A', value: 'Alias Name' },
            { code: 'B', value: 'Name at Birth' },
            { code: 'C', value: 'Adopted Name' },
            { code: 'D', value: 'Display Name' },
            { code: 'I', value: 'Licensing Name' },
            { code: 'L', value: 'Legal Name' },
            { code: 'M', value: 'Maiden Name' },
            { code: 'N', value: 'Nickname /"Call me" Name/Street Name' },
            { code: 'S', value: 'Coded Pseudo-Name to ensure anonymity' },
            { code: 'T', value: 'Indigenous/Tribal/Community Name' },
            { code: 'U', value: 'Unspecified' }
        ];
    }
})();
