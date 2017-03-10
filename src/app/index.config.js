(function () {
    'use strict';

    angular
        .module('portal')
        .config(config);

    /** @ngInject */
    function config($logProvider, $httpProvider, IdleProvider, KeepaliveProvider, KeepaliveInterval, IdleTimeout, IdleWarn) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Disable 401 security response
        //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        // Idle/keepalive settings
        IdleProvider.idle(60 * IdleTimeout); // duration in seconds
        IdleProvider.timeout(60 * IdleWarn); // warning time in seconds
        KeepaliveProvider.interval(60 * KeepaliveInterval); // duration in seconds
    }
})();
