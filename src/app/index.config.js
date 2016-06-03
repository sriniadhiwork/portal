(function() {
    'use strict';

    angular
        .module('portal')
        .config(config);

    /** @ngInject */
    function config($logProvider, $httpProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Disable 401 security response
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }

})();
