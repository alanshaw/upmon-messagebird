# upmon-sms [![Build Status](https://travis-ci.org/alanshaw/upmon-sms.svg?branch=master)](https://travis-ci.org/alanshaw/upmon-sms) [![Dependency Status](https://david-dm.org/alanshaw/upmon-sms.svg?style=flat)](https://david-dm.org/alanshaw/upmon-sms) [![Coverage Status](https://img.shields.io/coveralls/alanshaw/upmon-sms/master.svg?style=flat)](https://coveralls.io/r/alanshaw/upmon-sms)

Send an SMS message when [upmon](https://github.com/alanshaw/upmon) detects a failure.

## Getting started

1. `npm install -g upmon upmon-sms`
2. Create a new `$HOME/.upmonrc` file and add config:

    ```js
    {
      "ping": {
        // Time in ms between pings
        "interval": 5000,
        // URL's of services to ping
        "services": ["http://localhost:8000/"]
      },
      "sms": {
        // SMS provider config
        "messagebird": {
          "accessKey": "live_hy6ggbrRf4Bvfe48GGip8MtJM",
          "originator": "447000000000",
          "recipients": "447000000000"
        }
      }
    }
    ```

3. `upmon | upmon-sms`

## Supported providers

* MessageBird ([messagebird.com](https://www.messagebird.com))

Please PR and add more!

## Build your own monitor

Want to run upmon from [boss](https://www.npmjs.com/package/process-boss) or [pm2](https://www.npmjs.com/package/pm2)?

Create a new project, add a `.upmonrc` config file, install the upmon modules you need, and pipe them together!

**monitor.js**
```js
var upmon = require('upmon')
var sms = require('upmon-sms')
var mail = require('upmon-mail')

upmon().pipe(sms()).pipe(mail()).pipe(process.stdout)
```

```sh
pm2 start monitor.js
```
