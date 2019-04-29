#! /usr/bin/env node

var shell = require("shelljs");

shell.exec('rm -rf build/');
shell.exec('npm run build');
shell.exec('./node_modules/.bin/wdio wdio.conf.js');
