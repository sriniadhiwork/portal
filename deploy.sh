#!/bin/bash

git pull
bower install
gulp
cp -r dist/* /var/www/pulse/
