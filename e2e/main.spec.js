'use strict';

require('jasmine-given');

describe('the main view', function () {
    var page = require('./main.po');

    Given(function () { page.visitPage(); });

    describe('the patient-search section', function () {
        describe('should not send a query without a patient ID', function () {
            When(function () { page.patientSearch.patientIdEl.clear(); });

            Then(function () { expect(page.patientSearch.submitBtnEl.isEnabled()).toBeFalsy(); });
        });
    });

    describe('the patient-review section', function () {
        describe('should not exist at load', function () {
            Then(function () { expect(page.patientReview.root.isPresent()).toBeFalsy(); });
        });

        describe('should have no queries at load', function () {
            Then(function () { expect(page.patientReview.queries.count()).toBe(0) });
        });
/*
        describe('should have one query after sending a query', function () {
            doSearch(page).then(function () {
                Then(function () { expect(page.patientReview.queries.count()).toBe(1); });
            });
        });
/*
        describe('should shrink patients down to one when one is chosen', function () {
            doSearch(page).then(function () {
                return showDetails(page)
            }).then(function () {
                Then(function () { expect(page.patientReview.patients.count()).toBeGreaterThan(1); });
                return selectPatient(page)
            }).then(function () {
                Then(function () { expect(page.patientReview.patients.count()).toBe(1); });
            });
        });
/*
        describe('should indicated when a document is cached', function () {
            doSearch(page).then(function () {
                return showDetails(page)
            }).then(function () {
                return selectPatient(page)
            }).then(function () {
                return cacheDocument(page)
            }).then(function () {
                Then(function () { expect(page.patientReview.patients.first().all(by.tagName('li')).first().element(by.tagName('button')).getAttribute('class')).toBe('fa fa-eye'); });
            });
        });
        */
    });

    describe('the document-review section', function () {
        describe('should have no documents at load', function () {
            Then(function () { expect(page.documentReview.root.isPresent()).toBeFalsy(); });
        });
    });
});

function doSearch (page) {
    page.patientSearch.patientIdEl.sendKeys('test');
    return page.patientSearch.submitBtnEl.click();
}

function showDetails (page) {
    return page.patientReview.showDetailsA.click();
}

function selectPatient (page) {
    return page.patientReview.patients.first().element(by.tagName('button')).click();
}

function cacheDocument (page) {
    return page.patientReview.patients.first().all(by.tagName('li')).first().element(by.tagName('button')).click();
}
