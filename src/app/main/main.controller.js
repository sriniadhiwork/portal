(function() {
    'use strict';

    angular
        .module('portal.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($log, commonService) {
        var vm = this;

        vm.hasAcf = hasAcf;
        vm.isAuthenticated = isAuthenticated;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            commonService.getToken(true);
        }

        function hasAcf () {
            return commonService.hasAcf();
        }

        function isAuthenticated () {
            return commonService.isAuthenticated();
        }
    }
})();
