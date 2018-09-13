import Api from '../models/Api'
import Runner from '../models/Runner'
import History from '../models/History'

(function() {
    let api = null;

    browser.runtime.onMessage.addListener(function (message) {
        if(message.channel === 'run' && api) {
            api.endpoint('history_data', {'id': message.id})
                .then((response) => {
                    let history = new History(response.data),
                        stack = history.deserialiseFlowData(),
                        runner = new Runner(api)

                    runner.run(stack);
                })
        } else if(message.channel === 'refresh') {
            chrome.storage.sync.get({
                apiKey: '',
                env: 'prod'
            }, function(options) {
                api = new Api(options.env, options.apiKey);

                api.endpoint('history')
                    .then((response) => {
                        browser.runtime.sendMessage({
                            channel: 'refresh-data',
                            data: response.data
                        })
                    })
            })
        }
    })
})()
