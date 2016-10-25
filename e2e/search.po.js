'use strict';

var SearchPage = function () {
    function SearchPage () {
        this.nav = {root: element(by.tagName('header'))};
        this.nav.logoutButton = this.nav.root.element(by.tagName('button'));

        this.patientSearch = {root: element(by.css('.patient-search'))};
        this.patientSearch.pageTitle = this.patientSearch.root.element(by.tagName('h1'));
        this.patientSearch.givenNameEl = this.patientSearch.root.element(by.id('givenName'));
        this.patientSearch.familyNameEl = this.patientSearch.root.element(by.id('familyName'));
        this.patientSearch.dobEl = this.patientSearch.root.element(by.id('dob'));
        this.patientSearch.genderEl = this.patientSearch.root.element(by.id('gender'));
        this.patientSearch.submitBtnEl = this.patientSearch.root.element(by.id('queryFormSubmit'));

        this.patientReview = {root: element(by.css('.patient-review'))};
        this.patientReview.showDetailsA = this.patientReview.root.all(by.tagName('tfoot')).first().element(by.tagName('a'));
        this.patientReview.queries = this.patientReview.root.all(by.repeater('query in vm.patientQueries'));
        this.patientReview.patientResults = this.patientReview.queries.first().all(by.repeater('patient in query.results'));
    }

    SearchPage.prototype.visitPage = function () {
        browser.get('#/search');
    }

    return SearchPage;
}();

module.exports = new SearchPage();
