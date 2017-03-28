(function () {
    'use strict';

    angular
        .module('portal')
        .config(config);

    /** @ngInject */
    function config($logProvider, $httpProvider, IdleProvider, KeepaliveProvider, KeepaliveInterval, IdleTimeout, IdleWarn) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Idle/keepalive settings
        IdleProvider.idle(60 * IdleTimeout); // duration in seconds
        IdleProvider.timeout(60 * IdleWarn); // warning time in seconds
        KeepaliveProvider.interval(60 * KeepaliveInterval); // duration in seconds
    }
})();
