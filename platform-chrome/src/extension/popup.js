import Api from '../models/Api'
import Runner from '../models/Runner'
import History from '../models/History'

(function () {
    function addEvent(parent, evt, selector, handler) {
        parent.addEventListener(evt, function(event) {
            if (event.target.matches(selector + ', ' + selector + ' *')) {
                handler.apply(event.target.closest(selector), arguments);
            }
        }, false);
    }

    chrome.storage.sync.get({
        apiKey: '',
        env: 'prod'
    }, function(options) {
        const refreshButton = document.getElementById('refresh');
        const goToOptionsButton = document.getElementById('go-to-options');
        const historyElement = document.getElementById('history')

        let api = new Api(options.env, options.apiKey)

        goToOptionsButton.addEventListener('click', () => {
            if (chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
            } else {
                window.open(chrome.runtime.getURL('options.html'));
            }
        });

        addEvent(historyElement, 'click', 'a', (e) => {
            e.preventDefault()

            let itemId = e.target.getAttribute('href')
            api.endpoint('history_data', {'id': itemId})
                .then((response) => {
                    let history = new History(response.data),
                        stack = history.deserialiseFlowData(),
                        runner = new Runner(api)

                    runner.run(stack);
                })
        })

        const refresh = () => {
            api.endpoint('history')
                .then((response) => {
                    let items = []
                    for(let i = 0; i < response.data.length; i++) {
                        let item = response.data[i]
                        const template = `<div class="row"><div class="col-6-sm">${item.title}</div><div class="col-6-sm"><a href="${item.id}">run</a></div></div>`

                        items.push(template)
                    }

                    historyElement.innerHTML = items.join('');
                })
        }

        refreshButton.addEventListener('click', refresh);
        refresh()
    });
})()
