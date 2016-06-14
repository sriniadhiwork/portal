/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function () {
    function MainPage () {
        /*
        this.thumbnailEls = element(by.css('body')).all(by.repeater('awesomeThing in main.awesomeThings'));
        */

        this.patientSearch = {root: element(by.css('.patient-search'))};
        this.patientSearch.firstNameEl = this.patientSearch.root.element(by.id('firstName'));
        this.patientSearch.patientIdEl = this.patientSearch.root.element(by.id('patientId'));
        this.patientSearch.submitBtnEl = this.patientSearch.root.element(by.tagName('button'));

        this.patientReview = {root: element(by.css('.patient-review'))};
        this.patientReview.showDetailsA = this.patientReview.root.all(by.tagName('tfoot')).first().element(by.tagName('a'));
        this.patientReview.queries = this.patientReview.root.all(by.repeater('query in vm.patientResults')); //by.tagName('tbody')).first().all(by.tagName('tr'));
        this.patientReview.patients = this.patientReview.root.all(by.repeater('patient in query.results')); //by.tagName('tbody')).last().all(by.tagName('tr'));
        //this.patientReview.documents = this.patientReview.root.all(by.tagName('tbody')).last().all(by.tagName('tr')).last().all(by.repeater('doc in patient.documents'));
        this.patientReview.documents = this.patientReview.root.all(by.repeater('doc in patient.documents'));

        this.documentReview = {root: element(by.css('.document-review'))};
    }

    MainPage.prototype.visitPage = function () {
        browser.get('/');
    }

    return MainPage
}()

module.exports = new MainPage();
