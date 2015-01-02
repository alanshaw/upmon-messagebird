var through = require('through2')
var request = require('request')

var url = 'https://rest.messagebird.com/messages'

function sendSMS (type, accessKey, originator, recipients, lastPing, ping) {
  request.post({
    url: url,
    headers: {
      Authorization: 'AccessKey ' + accessKey
    },
    form: {
      originator: originator,
      recipients: recipients,
      body: type + ' ' + ping.url + ' (' + ping.status + ') at ' + new Date(ping.timestamp)
    }
  }, function (er, httpRes, body) {
    if (er) console.error('Failed to send ' + type + ' sms', opts, er, info)
  })
}

var sendFailSMS = sendSMS.bind(null, 'FAIL')
var sendRecoverSMS = sendSMS.bind(null, 'RECOVER')

module.exports = function (opts) {
  opts = opts || {}

  var lastPings = {}

  return through(function (chunk, enc, cb) {
    var ping

    try {
      ping = JSON.parse(chunk)
    } catch (er) {
      return cb(er)
    }

    var lastPing = lastPings[ping.url]

    if (lastPing) {
      if (lastPing.status == 200 && ping.status != 200) {
        this.sendFailSMS(opts.accessKey, opts.originator, opts.recipients, lastPing, ping)
      } else if (lastPing.status != 200 && ping.status == 200) {
        this.sendRecoverSMS(opts.accessKey, opts.originator, opts.recipients, lastPing, ping)
      }
    }

    lastPings[ping.url] = ping

    this.push(chunk)
    cb()
  })
}