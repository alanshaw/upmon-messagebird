var xtend = require('xtend')
var config = require('rc')('upmon')
var messageBird = require('./messagebird')

config.sms = config.sms || {}

module.exports = function (opts) {
  opts = opts || {}

  if (config.sms.messagebird || opts.messagebird) {
    return messageBird(xtend(config.sms.messagebird, opts.messagebird))
  }

  throw new Error('Missing SMS config')
}