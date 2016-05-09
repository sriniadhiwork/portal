(function() {
    'use strict';

    angular
        .module('portal')
        .config(config);

    /** @ngInject */
    function config($logProvider, toastrConfig, $httpProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Set options third-party lib
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = true;
        toastrConfig.progressBar = true;

        // Disable 401 security response
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }

})();
