(function () {
    'use strict';

    angular
        .module('portal')
        .controller('StatusController', StatusController);

    /** @ngInject */
    function StatusController($log) {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate() {
            vm.about = 'status';
            $log.info(vm.about);
        }
    }
})();
