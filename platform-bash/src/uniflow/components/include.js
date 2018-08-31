const History = require('../../models/History')

function ComponentBash() {
    this.historyId = null
}

ComponentBash.prototype.deserialise = function(data) {
    let [historyId] = data ? data : [null];

    this.historyId = historyId
}

ComponentBash.prototype.onExecute = function(runner, api, components) {
    return api.endpoint('history_data', {'id': this.historyId})
        .then((response) => {
            let history = new History(response.data),
                stack = history.deserialiseFlowData()

            return stack.reduce((promise, item) => {
                return promise.then(() => {
                    let component = new components[item.component]()
                    component.deserialise(item.data)
                    return component.onExecute(runner, api)
                })
            }, Promise.resolve())
        })
}

module.exports = ComponentBash
