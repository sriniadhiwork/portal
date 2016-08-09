(function() {
    'use strict';

    angular
        .module('portal')
        .controller('ResourcesController', ResourcesController);

    /** @ngInject */
    function ResourcesController($log, SwaggerUrl) {
        var vm = this;

        activate();

        function activate() {
            vm.about = 'resources';
            vm.swaggerUrl = SwaggerUrl;
            $log.info(vm.about);
        }
    }
})();