/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function () {
    function MainPage () {
        this.nav = {root: element(by.tagName('header'))};
        this.nav.logoutButton = this.nav.root.element(by.tagName('button'));

        this.fakeLogin = {root: element(by.id('.fake-login'))};
        this.fakeLogin.submit = this.fakeLogin.root.element(by.id('bypassSaml'));
    }

    MainPage.prototype.visitPage = function () {
        browser.get('/');
    }

    return MainPage
}()

module.exports = new MainPage();
