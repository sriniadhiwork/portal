(function() {
    'use strict';

    angular
        .module('portal')
        .filter('prettyprint', function () {
            function prettyprint (text) {
                text = text.replace(/</g,'&lt;').replace(/>/g,'&gt;');
                return prettyPrintOne(text, '', false);
            }
            return prettyprint;
        });
})();
