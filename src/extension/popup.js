import Api from '../models/Api'

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
        const historyElement = document.getElementById('history');

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

            console.log(itemId)
        })

        const refresh = () => {
            let api = new Api(options.env, options.apiKey)
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
