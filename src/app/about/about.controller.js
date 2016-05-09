(function() {
    'use strict';

    angular
        .module('portal')
        .controller('AboutController', AboutController);

    /** @ngInject */
    function AboutController($log) {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate() {
            vm.about = 'about';
            $log.info(vm.about);
        }
    }
})();
