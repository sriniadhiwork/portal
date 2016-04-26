'use strict';

require('jasmine-given');

describe('The main view', function () {
    var page = require('./main.po');

    describe('visiting the main page', function () {
        Given(function () { page.visitPage(); });

        Then(function () { expect(page.h1El.getText()).toBe('\'Allo, \'Allo!'); })
        Then(function () { expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/); })
        Then(function () { expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman'); });
        Then(function () { expect(page.thumbnailEls.count()).toBeGreaterThan(5); })
    });

});
