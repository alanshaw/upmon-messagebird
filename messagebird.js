var through = require('through2')
var request = require('request')

function sendSMS (type, url, accessKey, originator, recipients, lastPing, ping) {
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
  }, function (er, res, body) {
    if (er) console.error('Failed to send ' + type + ' sms', er)
  })
}

var sendFailSMS = sendSMS.bind(null, 'FAIL')
var sendRecoverSMS = sendSMS.bind(null, 'RECOVER')

function isString (str) {
  return Object.prototype.toString.call(str) == '[object String]'
}

module.exports = function (opts) {
  opts = opts || {}
  opts.url = opts.url || 'https://rest.messagebird.com/messages'

  var lastPings = {}

  return through.obj(function (chunk, enc, cb) {
    var ping

    if (Buffer.isBuffer(chunk) || isString(chunk)) {
      try {
        ping = JSON.parse(chunk)
      } catch (er) {
        return cb(er)
      }
    } else {
      ping = chunk
    }

    var lastPing = lastPings[ping.url]

    if (lastPing) {
      if (lastPing.status == 200 && ping.status != 200) {
        sendFailSMS(opts.url, opts.accessKey, opts.originator, opts.recipients, lastPing, ping)
      } else if (lastPing.status != 200 && ping.status == 200) {
        sendRecoverSMS(opts.url, opts.accessKey, opts.originator, opts.recipients, lastPing, ping)
      }
    }

    lastPings[ping.url] = ping

    this.push(chunk)
    cb()
  })
}