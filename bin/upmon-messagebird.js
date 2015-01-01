#!/usr/bin/env node
var upmonMessageBird = require('../')
process.stdin.pipe(upmonMessageBird()).pipe(process.stdout)
