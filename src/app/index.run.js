(function () {
    'use strict';

    angular
        .module('portal')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log) {
        $log.info('runBlock end');
    }
})();
