/**
 * This file uses the Page Object pattern to define the acf page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var AcfPage = function () {
    function AcfPage () {
        this.root = element(by.css('.acf'));
        this.acfSelectEl = this.root.element(by.id('selectAcf'));
        this.acfSelectOptions = this.acfSelectEl.all(by.tagName('option'));
        this.acfNewNameEl = this.root.element(by.id('acfName'));
        this.acfNewChk = this.root.element(by.id('createNewAcf'));
        this.acfSubmitBtn = this.root.element(by.id('acfSubmit'));
    }

    AcfPage.prototype.enterNewAcf = function (acfName) {
        return this.acfNewNameEl.sendKeys(acfName);
    }

    AcfPage.prototype.selectAcf = function () {
        return this.acfSelectOptions.last().click();
    }

    AcfPage.prototype.submitAcf = function () {
        return this.acfSubmitBtn.click();
    }

    return AcfPage
}()

module.exports = new AcfPage();
