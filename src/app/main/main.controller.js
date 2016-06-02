(function() {
    'use strict';

    angular
        .module('portal.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($log, commonService) {
        var vm = this;

        vm.isAuthenticated = isAuthenticated;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
        }

        function isAuthenticated () {
            return commonService.isAuthenticated();
        }
    }
})();
