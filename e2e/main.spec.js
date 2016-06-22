'use strict';

require('jasmine-given');

describe('the main view', function () {
    var page = require('./main.po');

    Given(function () { page.visitPage(); });

    describe('the acf-entry section', function () {

        describe('should exist at load', function () {
            Then(function () { expect(page.acfEntry.root.isPresent()).toBeTruthy(); });
        });

        describe('should show options at load', function () {
            Then(function () { expect(page.acfEntry.acfSelectOptions.count()).toBeGreaterThan(0); });
        });

        describe('should not be clickable until an option is selected', function () {
            When(function () { submitAcf(page); });

            Then(function () { expect(page.acfEntry.acfSubmitBtn.isEnabled()).toBeFalsy(); });
        });

        describe('should not exist after entering a new ACF and submitting', function () {
            When(function () {
                page.acfEntry.acfNewChk.click().then(function () {
                    return enterNewAcf(page);
                }).then(function () {
                    return submitAcf(page);
                });
            });

            Then(function () { expect(page.acfEntry.root.isPresent()).toBeFalsy(); });
        });

        describe('should not exist after selecting an ACF and submitting', function () {
            When(function () {
                selectAcf(page).then(function () {
                    return submitAcf(page);
                });
            });

            Then(function () { expect(page.acfEntry.root.isPresent()).toBeFalsy(); });
        });
    });

    describe('after selecting an acf', function () {

        describe('the patient-search section', function () {
            describe('should not show errors until button focused on', function () {
                Then(function () { expect(page.patientSearch.submitBtnEl.isEnabled()).toBeTruthy(); });
            });

            /*
            describe('should not send a query without a patient ID', function () {
                When(function () { page.patientSearch.patientIdEl.clear(); });
                When(function () { page.patientSearch.submitBtnEl.click(); });

                Then(function () { expect(page.patientSearch.submitBtnEl.isEnabled()).toBeFalsy(); });
            });

            describe('should re-enable the search button when the patient id is entered', function () {
                When(function () { page.patientSearch.patientIdEl.clear(); });
                When(function () { page.patientSearch.submitBtnEl.click(); });

                Then(function () {
                    doSearch(page).then(function () {
                        Then(function () { expect(page.patientSearch.submitBtnEl.isEnabled()).toBeTruthy(); });
                    });
                });
            });
            */
        });

        describe('the patient-review section', function () {
            describe('should not exist at load', function () {
                Then(function () { expect(page.patientReview.root.isPresent()).toBeFalsy(); });
            });

            describe('should have no queries at load', function () {
                Then(function () { expect(page.patientReview.queries.count()).toBe(0) });
            });

            describe('should have one query after sending a query', function () {
                When(function () { doSearch(page); });

                Then(function () { expect(page.patientReview.queries.count()).toBe(1); });
            });

            describe('should have a way to clear a query', function () {
                When(function () {
                    doSearch(page).then(function () {
                        page.patientReview.queries.first().element(by.tagName('button')).click();
                    });
                });

                Then(function () { expect(page.patientReview.queries.count()).toBe(0); });
            });

            describe('should clear the query when a patient is chosen', function () {
                When(function () {
                    doSearch(page).then(function () {
                        return showDetails(page)
                    }).then(function () {
                        return selectPatient(page)
                    });
                });

                Then(function () { expect(page.patientReview.queries.count()).toBe(0); });
            });
        });

        describe('the acf-patient-list section', function () {
            describe('should indicate when a document is not cached', function () {
                When(function () {
                    doSearch(page).then(function () {
                        return showDetails(page)
                    }).then(function () {
                        return selectPatient(page)
                    }).then(function () {
                        return showDocuments(page);
                    });
                });

                Then(function () { expect(page.acfPatientList.documents.first().element(by.tagName('button')).getText()).toBe('Download'); });
                And(function () { expect(page.acfPatientList.documents.first().element(by.tagName('i')).getAttribute('class')).toBe('fa fa-download'); });
            });

            describe('should indicate when a document is cached', function () {
                When(function () {
                    doSearch(page).then(function () {
                        return showDetails(page)
                    }).then(function () {
                        return selectPatient(page)
                    }).then(function () {
                        return showDocuments(page);
                    }).then(function () {
                        return clickDocument(page)
                    });
                });

                Then(function () { expect(page.acfPatientList.documents.first().element(by.tagName('button')).getText()).toBe('View'); });
                And(function () { expect(page.acfPatientList.documents.first().element(by.tagName('i')).getAttribute('class')).toBe('fa fa-eye'); });
            });
        });

        describe('the document-review section', function () {
            describe('should have no documents at load', function () {
                Then(function () { expect(page.documentReview.root.isPresent()).toBeFalsy(); });
            });

            describe('should display a document when one is selected', function () {
                When(function () {
                    doSearch(page).then(function () {
                        return showDetails(page)
                    }).then(function () {
                        return selectPatient(page)
                    }).then(function () {
                        return showDocuments(page);
                    }).then(function () {
                        return clickDocument(page)
                    }).then(function () {
                        return clickDocument(page)
                    });
                });

                Then(function () { expect(page.documentReview.document.getText()).not.toBe(''); });
            });

            describe('should clear a displayed document when directed', function () {
                When(function () {
                    doSearch(page).then(function () {
                        return showDetails(page)
                    }).then(function () {
                        return selectPatient(page)
                    }).then(function () {
                        return showDocuments(page);
                    }).then(function () {
                        return clickDocument(page)
                    }).then(function () {
                        return clickDocument(page)
                    }).then(function () {
                        page.documentReview.close.click()
                    });
                });

                Then(function () { expect(page.documentReview.root.isPresent()).toBeFalsy();});
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
});

function selectAcf (page) {
    return page.acfEntry.acfSelectOptions.last().click();
}

function enterNewAcf (page) {
    return page.acfEntry.acfNewEl.sendKeys('new ACF');
}

function submitAcf (page) {
    return page.acfEntry.acfSubmitBtn.click();
}

function doSearch (page) {
    return page.patientSearch.submitBtnEl.click();
}

function showDetails (page) {
    return page.patientReview.showDetailsA.click();
}

function selectPatient (page) {
    return page.patientReview.patientResults.first().element(by.tagName('button')).click();
}

function showDocuments (page) {
    return page.acfPatientList.showDocumentsA.click();
}

function clickDocument (page) {
    return page.acfPatientList.documents.first().element(by.tagName('button')).click();
}
