var xtend = require('xtend')
var config = require('rc')('upmon')
var through = require('through')
var messageBird = require('./messagebird')

module.exports = function (opts) {
  opts = opts || {}

  if (config.messagebird || opts.messagebird) {
    return messageBird(xtend(config.messagebird, opts.messagebird))
  }

  throw new Error('Missing SMS config')
}