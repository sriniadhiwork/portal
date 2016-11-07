(function() {
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
                switch (date.length) {
                case 6:
                    obj = new Date(Date.UTC(parseInt(date.substring(0,4)),
                                            parseInt(date.substring(4,6)) - 1));
                    ret = $filter('date')(obj, 'MMM, yyyy', 'UTC');
                    break;
                case 8:
                    obj = new Date(Date.UTC(parseInt(date.substring(0,4)),
                                            parseInt(date.substring(4,6)) - 1,
                                            parseInt(date.substring(6,8))));
                    ret = $filter('date')(obj, 'MMM dd, yyyy', 'UTC');
                    break;
                case 10:
                    obj = new Date(Date.UTC(parseInt(date.substring(0,4)),
                                            parseInt(date.substring(4,6)) - 1,
                                            parseInt(date.substring(6,8)),
                                            parseInt(date.substring(8,10))));
                    ret = $filter('date')(obj, 'MMM dd, yyyy h a', 'UTC');
                    break;
                case 12:
                    obj = new Date(Date.UTC(parseInt(date.substring(0,4)),
                                            parseInt(date.substring(4,6)) - 1,
                                            parseInt(date.substring(6,8)),
                                            parseInt(date.substring(8,10)),
                                            parseInt(date.substring(10,12))));
                    ret = $filter('date')(obj, 'MMM dd, yyyy h:mm a', 'UTC');
                    break;
                case 14:
                    obj = new Date(Date.UTC(parseInt(date.substring(0,4)),
                                            parseInt(date.substring(4,6)) - 1,
                                            parseInt(date.substring(6,8)),
                                            parseInt(date.substring(8,10)),
                                            parseInt(date.substring(10,12)),
                                            parseInt(date.substring(12,14))));
                    ret = $filter('date')(obj, 'MMM dd, yyyy h:mm:ss a', 'UTC');
                    break;
                }
                ret += z;
                return ret;
            }
            return ehealthdate;
        });
})();
