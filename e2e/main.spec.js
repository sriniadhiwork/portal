'use strict';

require('jasmine-given');

describe('the main view', function () {
    var page = require('./main.po');

    Given(function () { page.visitPage(); });

    describe('the patient-search section', function () {
        describe('should not show errors until button focused on', function () {
            When(function () { page.patientSearch.patientIdEl.clear(); });

            Then(function () { expect(page.patientSearch.submitBtnEl.isEnabled()).toBeTruthy(); });
        });

        describe('should not send a query without a patient ID', function () {
            When(function () { page.patientSearch.patientIdEl.clear(); });
            When(function () { page.patientSearch.submitBtnEl.click(); });

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

        describe('should have one query after sending a query', function () {
            Then(function () {
                doSearch(page).then(function () {
                    Then(function () { expect(page.patientReview.queries.count()).toBe(1); });
                });
            });
        });

        describe('should have a way to clear a query', function () {
            Then(function () {
                doSearch(page).then(function () {
                    page.patientReview.queries.first().element(by.tagName('button')).click().then(function () {
                        expect(page.patientReview.queries.count()).toBe(0);
                    });
                });
            });
        });

        describe('should shrink patients down to one when one is chosen', function () {
            Then(function () {
                doSearch(page).then(function () {
                    return showDetails(page)
                }).then(function () {
                    Then(function () { expect(page.patientReview.patients.count()).toBeGreaterThan(1); });
                    return selectPatient(page)
                }).then(function () {
                    Then(function () { expect(page.patientReview.patients.count()).toBe(1); });
                });
            });
        });

        describe('should indicate when a document is not cached', function () {
            Then(function () {
                doSearch(page).then(function () {
                    return showDetails(page)
                }).then(function () {
                    return selectPatient(page)
                }).then(function () {
                    page.patientReview.documents.first().element(by.tagName('button')).getText().then(function (text) {
                        expect(text).toBe('Download');
                    });
                    page.patientReview.documents.first().element(by.tagName('i')).getAttribute('class').then(function (text) {
                        expect(text).toBe('fa fa-download');
                    });
                });
            });
        });

        describe('should indicate when a document is cached', function () {
            Then(function () {
                doSearch(page).then(function () {
                    return showDetails(page)
                }).then(function () {
                    return selectPatient(page)
                }).then(function () {
                    return clickDocument(page)
                }).then(function () {
                    page.patientReview.documents.first().element(by.tagName('button')).getText().then(function (text) {
                        expect(text).toBe('View');
                    });
                    page.patientReview.documents.first().element(by.tagName('i')).getAttribute('class').then(function (text) {
                        expect(text).toBe('fa fa-eye');
                    });
                });
            });
        });
    });

    describe('the document-review section', function () {
        describe('should have no documents at load', function () {
            Then(function () { expect(page.documentReview.root.isPresent()).toBeFalsy(); });
        });

        describe('should display a document when one is selected', function () {
            Then(function () {
                doSearch(page).then(function () {
                    return showDetails(page)
                }).then(function () {
                    return selectPatient(page)
                }).then(function () {
                    return clickDocument(page)
                }).then(function () {
                    return clickDocument(page)
                }).then(function () {
                    page.documentReview.document.getText().then(function (text) {
                        expect(text).not.toBe('');
                    });
                });
            });
        });

        describe('should clear a displayed document when directed', function () {
            Then(function () {
                doSearch(page).then(function () {
                    return showDetails(page)
                }).then(function () {
                    return selectPatient(page)
                }).then(function () {
                    return clickDocument(page)
                }).then(function () {
                    return clickDocument(page)
                }).then(function () {
                    page.documentReview.close.click().then(function () {
                        expect(page.documentReview.root.isPresent()).toBeFalsy();
                    });
                });
            });
        });
    });

    describe('the organization status section', function () {
        describe('should exist on page load', function () {
            Then(function () { expect(page.organizationStatus.root.isPresent()).toBeTruthy(); });
        });

        describe('should have more than 0 organizations', function () {
            Then(function () { expect(page.organizationStatus.organizations.count()).toBeGreaterThan(0); });
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

function clickDocument (page) {
    return page.patientReview.documents.first().element(by.tagName('button')).click();
}
