var http = require('http')
var test = require('tape')
var formBody = require('body/form')
var ping = require('upmon')
var sms = require('../')

test('Fail and recover', function (t) {
  t.plan(10)

  var reqCount = 0
  var accessKey = 'live_hy6ggbrRf4Bvfe48GGip8MtJM'
  var originator = '447000000000'
  var recipients = '447000000001'

  var server = http.createServer(function (req, res) {
    res.statusCode = reqCount == 1 ? 500 : 200
    reqCount++
    res.end()
  }).listen(1337)

  var txtCount = 0

  var mockMessageBirdServer = http.createServer(function (req, res) {
    t.equal(req.headers['authorization'], 'AccessKey ' + accessKey, 'AccessKey in Authorization header')

    formBody(req, res, function (er, body) {
      t.ifError(er, 'No error parsing request body')
      t.equal(body.originator, originator, 'Originator in body')
      t.equal(body.recipients, recipients, 'Recipients in body')

      if (!txtCount) {
        t.ok(body.body.indexOf('FAIL http://localhost:1337') > -1, 'Fail sms sent')
      } else {
        t.ok(body.body.indexOf('RECOVER http://localhost:1337') > -1, 'Recover sms sent')
        pinger.destroy()
        server.close(function () {
          mockMessageBirdServer.close(t.end)
        })
      }

      txtCount++
      res.end()
    })
  }).listen(1338)

  var pinger = ping({
    interval: 1000,
    services: ['http://localhost:1337']
  })
  var txter = sms({
    messagebird: {
      url: 'http://localhost:1338',
      accessKey: accessKey,
      originator: originator,
      recipients: recipients
    }
  })

  pinger.pipe(txter)
})