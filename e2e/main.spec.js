'use strict';

require('jasmine-given');

describe('the main view', function () {
    var main = require('./main.po');
    var organizationStatus = require('./organizationStatus.po');
    var acf = require('./acf.po');

    /*
    beforeAll(function () {
        main.visitPage();
        fakeLogin(main);
    });
    */

    Given(function () {
        main.visitPage();
    });

    afterEach(function () {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    describe('the acf-entry section', function () {

        describe('should exist at load', function () {
            Then(function () { expect(acf.root.isPresent()).toBeTruthy(); });
        });

        describe('should show options at load', function () {
            Then(function () { expect(acf.acfSelectOptions.count()).toBeGreaterThan(0); });
        });

        describe('should not be clickable until an option is selected', function () {
            When(function () { acf.submitAcf(); });

            Then(function () { expect(acf.acfSubmitBtn.isEnabled()).toBeFalsy(); });
        });

        describe('should change to display after entering a new ACF and submitting', function () {
            When(function () {
                acf.acfNewChk.click().then(function () {
                    return acf.enterNewAcf('New ACF' + Math.random());
                }).then(function () {
                    return acf.submitAcf();
                });
            });

            Then(function () { expect(acf.acfSubmitBtn.isPresent()).toBeFalsy(); });
        });

        describe('should change to display after selecting an ACF and submitting', function () {
            When(function () {
                acf.selectAcf().then(function () {
                    return acf.submitAcf();
                });
            });

            Then(function () { expect(acf.acfSubmitBtn.isPresent()).toBeFalsy(); });
        });
    });

    describe('after selecting an acf', function () {

        Given(function () {
            acf.selectAcf().then(function () {
                return acf.submitAcf();
            });
        });

        describe('the organization status section', function () {
            describe('should exist on load', function () {
                Then(function () { expect(organizationStatus.root.isPresent()).toBeTruthy(); });
            });

            describe('when toggled open', function () {

                Given(function () {
                    organizationStatus.togglePanel();
                });

                describe('should have more than 0 organizations', function () {
                    Then(function () { expect(organizationStatus.organizations.count()).toBeGreaterThan(0); });
                });
            });
        });
    });
});

function fakeLogin (page) {
    page.fakeLogin.submit.click();
}
