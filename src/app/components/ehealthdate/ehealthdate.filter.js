(function () {
    'use strict';

    angular
        .module('portal')
        .filter('ehealthdate', function ($filter) {
            function ehealthdate (date) {
                if (!date) {
                    return '';
                }
                var ret = date.substring(0, 4);
                var z = '';
                if (date.indexOf('-') > 0 || date.indexOf('+') > 0) { // pull off timezone if it exists
                    z = ' UTC' + date.substring(date.length - 5);
                    date = date.substring(0, date.length - 5);
                }
                var obj;
                obj = new Date(Date.UTC(parseInt(date.substring(0,4)),
                                        parseInt(date.substring(4,6)) - 1,
                                        parseInt(date.substring(6,8))));
                ret = $filter('date')(obj, 'MMM dd, yyyy', 'UTC');
                ret += z;
                return ret;
            }
            return ehealthdate;
        });
})();
