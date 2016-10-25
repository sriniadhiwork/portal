'use strict';

var NavModule = function () {
    var EC = protractor.ExpectedConditions;

    function NavModule () {
        this.root = element(by.tagName('header'));
        this.logoutButton = this.root.element(by.id('logoutButton'));
        this.toggleButton = this.root.element(by.id('nav-dropdown'));
        this.searchLink = this.root.element(by.linkText('Search'));
    }

    NavModule.prototype.gotoSearch = function () {
        this.toggleButton.click();
        this.searchLink.click();
    }

    return NavModule;
}();

module.exports = new NavModule();
