(function() {
    'use strict';

    angular
        .module('portal')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, Idle) {
        $log.info('runBlock end');
        Idle.watch();
    }
})();
