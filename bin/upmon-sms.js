#!/usr/bin/env node
var upmonSMS = require('../')
process.stdin.pipe(upmonSMS()).pipe(process.stdout)
