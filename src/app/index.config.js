(function() {
    'use strict';

    angular
        .module('portal')
        .config(config);

    /** @ngInject */
    function config($logProvider, $httpProvider, IdleProvider, KeepaliveProvider, KeepaliveInterval, IdleTimeout) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Disable 401 security response
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        // Idle/keepalive settings
        IdleProvider.idle(60 * IdleTimeout); // duration in seconds
        IdleProvider.timeout(false); // warning time; not implementing
        KeepaliveProvider.interval(60 * KeepaliveInterval); // duration in seconds
    }
})();
