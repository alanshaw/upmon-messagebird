var xtend = require('xtend')
var config = require('rc')('upmon')
var ndjson = require('ndjson')
var combine = require('stream-combiner2')
var messageBird = require('./messagebird')

config.sms = config.sms || {}

module.exports = function (opts) {
  opts = opts || {}

  if (config.sms.messagebird || opts.messagebird) {
    return combine(
      ndjson.parse(),
      messageBird(xtend(config.sms.messagebird, opts.messagebird)),
      ndjson.stringify()
    )
  }

  throw new Error('Missing SMS config')
}