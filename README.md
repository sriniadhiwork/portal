[![Build Status](http://54.213.57.151:9090/buildStatus/icon?job=pulse-andlar-portal)](http://54.213.57.151:9090/view/PULSE/job/pulse-andlar-portal/)
[![Code Climate](https://codeclimate.com/github/andlar/portal/badges/gpa.svg)](https://codeclimate.com/github/andlar/portal)
[![Test Coverage](https://codeclimate.com/github/andlar/portal/badges/coverage.svg)](https://codeclimate.com/github/andlar/portal/coverage)

# Portal project for PULSE

## Required external packages

 * [NodeJs](https://nodejs.org/en/download/ "NodeJs Download Page")
 * Node Package Manager ``npm install npm -g``
 * Gulp ``npm install --global gulp-cli``
 * Bower ``npm install --global bower``

## Clone repository

``git clone https://github.com/pulse-admin/portal.git``

## Install internal required packages

```sh
$ cd portal
$ npm install
$ bower install
```

## Configure 'local' environment

``nano config/local.json``

## Run Portal webserver

* Run the server with ``gulp serve``
  * Server will default to http://localhost:3000
* Run the tests with ``gulp test:auto``
* Or run both with ``gulp live``

Protractor e2etests are run with ``gulp protractor``

## Dependencies

Login, and hence everything, including e2e tests, depends on the [SAML Service Provider](../saml-service-provider) application running. The default configuration expects it to be running on http://localhost:8080
