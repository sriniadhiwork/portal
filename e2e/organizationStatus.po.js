/**
 * This file uses the Page Object pattern to define the organizationStatus page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var OrganizationStatusPage = function () {
    function OrganizationStatusPage () {
        this.root = element(by.css('.organization-status'));
        this.panelHeading = this.root.element(by.css('.panel-heading'));
        this.panelDisplayButton = this.panelHeading.element(by.tagName('button'));
        this.organizations = this.root.all(by.repeater('org in vm.organizations'));
    }

    OrganizationStatusPage.prototype.togglePanel = function () {
        return this.panelDisplayButton.click();
    }

    return OrganizationStatusPage
}()

module.exports = new OrganizationStatusPage();
