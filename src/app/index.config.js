(function() {
    'use strict';

    angular
        .module('portal')
        .config(config);

    /** @ngInject */
    function config($logProvider, $httpProvider, IdleProvider, KeepaliveProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Disable 401 security response
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        // Idle/keepalive settings
        IdleProvider.idle(60 * 20); // 20 minutes in seconds
        IdleProvider.timeout(false); // warning time; not implementing
        KeepaliveProvider.interval(60 * 5); // 5 minutes in seconds
    }
})();
