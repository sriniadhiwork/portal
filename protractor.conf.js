'use strict';

var paths = require('./.yo-rc.json')['generator-gulp-angular'].props.paths;

// An example configuration file.
exports.config = {
    // The address of a running selenium server.
    //seleniumAddress: 'http://localhost:4444/wd/hub',
    //seleniumServerJar: deprecated, this should be set on node_modules/protractor/config.json

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': [
                'disable-extensions'
            ]
        }
    },

    baseUrl: 'http://localhost:3000',

    // Spec patterns are relative to the current working directory when
    // protractor is called.
    specs: [paths.e2e + '/**/*.js'],

    suites: {
        main: paths.e2e + '/**/main*.js',
        search: paths.e2e + '/**/search*.js'
    },

    onPrepare: function() {
        // The require statement must be down here, since jasmine-reporters@1.0
        // needs jasmine to be in the global and protractor does not guarantee
        // this until inside the onPrepare function.
        var jasmineReporters = require('jasmine-reporters');
        var jasmineSpecReporter = require('jasmine-spec-reporter');
        var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
        jasmine.getEnv().addReporter(
            new jasmineReporters.JUnitXmlReporter({
                consolidateAll: true,
                savePath: 'test_reports',
                filePrefix: 'e2e_junit'
            })
        );
        jasmine.getEnv().addReporter(
            new jasmineSpecReporter({
                displayStackTrace: 'all',
                displaySpecDuration: true,
                displaySuiteNumber: true
            })
        );
        jasmine.getEnv().addReporter(
            new Jasmine2HtmlReporter({
                savePath: 'test_reports/e2e_report/'
            })
        );
        browser.driver.manage().window().maximize();
    },

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        print: function () {},
        defaultTimeoutInterval: 30000
    }
};
