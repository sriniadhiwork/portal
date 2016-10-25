'use strict';

require('jasmine-given');

describe('the search view', function () {
    var main = require('./main.po');
    var acf = require('./acf.po');
    var search = require('./search.po');
    var nav = require('./nav.po');

    beforeAll(function () {
        main.visitPage();
        acf.acfNewChk.click().then(function () {
            return acf.enterNewAcf('New ACF' + Math.random());
        }).then(function () {
            return acf.submitAcf();
        });
    });

    beforeEach(function () {
        nav.gotoSearch();
    });

    describe('on search page load', function () {

        describe('the patient-search section', function () {

            describe('should exist', function () {
                Then(function () { expect(search.patientSearch.root.isPresent()).toBeTruthy(); });
            });

            describe('should not show errors until the search button is focused on', function () {
                Then(function () { expect(search.patientSearch.submitBtnEl.isEnabled()).toBeTruthy(); });
            });

            describe('should not send a query without name, birthday, and gender', function () {
                When(function () { search.patientSearch.submitBtnEl.click(); });

                Then(function () { expect(search.patientSearch.submitBtnEl.isEnabled()).toBeFalsy(); });
            });

            describe('should re-enable the search button when name, birthday, and gender are entered', function () {
                Then(function () {
                    doSearch(search).then(function () {
                        Then(function () { expect(search.patientSearch.submitBtnEl.isEnabled()).toBeTruthy(); });
                    });
                });
            });
        });
    });
});

function doSearch (search) {
    search.patientSearch.givenNameEl.sendKeys('Given');
    search.patientSearch.familyNameEl.sendKeys('Family');
    search.patientSearch.dobEl.sendKeys('1990-01-02');
    search.patientSearch.genderEl.sendKeys('F');
    return search.patientSearch.submitBtnEl.click();
}
