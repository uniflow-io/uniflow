import Api from '../models/Api'

(function () {
    const refreshButton = document.getElementById('refresh');
    const historyElement = document.getElementById('history');

    const refresh = () => {
        let api = new Api('prod', 'qNFN9tqqg0tKq7GMPQy1r3nskFMntRjc')
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
})()
