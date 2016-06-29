'use strict';

var paths = require('./.yo-rc.json')['generator-gulp-angular'].props.paths;

// An example configuration file.
exports.config = {
    // The address of a running selenium server.
    //seleniumAddress: 'http://localhost:4444/wd/hub',
    //seleniumServerJar: deprecated, this should be set on node_modules/protractor/config.json

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:3000',

    // Spec patterns are relative to the current working directory when
    // protractor is called.
    specs: [paths.e2e + '/**/*.js'],

    onPrepare: function() {
        // The require statement must be down here, since jasmine-reporters@1.0
        // needs jasmine to be in the global and protractor does not guarantee
        // this until inside the onPrepare function.
        var jasmineReporters = require('jasmine-reporters');
        var jasmineSpecReporter = require('jasmine-spec-reporter');
        jasmine.getEnv().addReporter(
            new jasmineReporters.JUnitXmlReporter({
                consolidateAll: true,
                savePath: 'test_reports',
                filePrefix: 'e2e_junit'
            })
        );
        jasmine.getEnv().addReporter(new jasmineSpecReporter({
            displayStackTrace: 'all',
            displaySpecDuration: true,
            displaySuiteNumber: true
        }));
    },

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        print: function () {},
        defaultTimeoutInterval: 30000
    }
};
