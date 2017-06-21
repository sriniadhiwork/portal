(function () {
    'use strict';

    describe('ehealthdate.filter', function () {
        var $log, $filter;

        beforeEach(function () {
            module('portal');
            inject(function (_$filter_, _$log_) {
                $filter = _$filter_;
                $log = _$log_;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should diplay nothing if bad input', function () {
            expect($filter('ehealthdate')()).toBe('');
            expect($filter('ehealthdate')(null)).toBe('');
        });

        it('should display years', function () {
            var date = '1999';
            var result = $filter('ehealthdate')(date);
            expect(result).toEqual(date);
        });

        it('should display years and timezone', function () {
            var date = '1999-0300';
            var result = $filter('ehealthdate')(date);
            expect(result).toBe('1999 UTC-0300');
        });

        it('should display years and months', function () {
            var date = '199903';
            var result = $filter('ehealthdate')(date);
            expect(result).toBe('Mar, 1999');
        });

        it('should display years, months, and days', function () {
            var date = '19990319';
            var result = $filter('ehealthdate')(date);
            expect(result).toBe('Mar 19, 1999');
        });

        it('should display years, months, days, and hours', function () {
            var date = '1999031914';
            var result = $filter('ehealthdate')(date);
            expect(result).toBe('Mar 19, 1999 2 PM');
        });

        it('should display years, months, days, hours, and minutes', function () {
            var date = '199903191432';
            var result = $filter('ehealthdate')(date);
            expect(result).toBe('Mar 19, 1999 2:32 PM');
        });

        it('should display years, months, days, hours, and minutes', function () {
            var date = '199903190232';
            var result = $filter('ehealthdate')(date);
            expect(result).toBe('Mar 19, 1999 2:32 AM');
        });

        it('should display years, months, days, hours, minutes, and seconds', function () {
            var date = '19990319143212';
            var result = $filter('ehealthdate')(date);
            expect(result).toBe('Mar 19, 1999 2:32:12 PM');
        });

        it('should display years, months, days, hours, minutes, seconds, and timezone', function () {
            var date = '19990319143212+0300';
            var result = $filter('ehealthdate')(date);
            expect(result).toBe('Mar 19, 1999 2:32:12 PM UTC+0300');
        });
    });
})();
