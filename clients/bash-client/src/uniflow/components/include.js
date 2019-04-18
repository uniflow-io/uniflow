const Program = require('../../models/Program')

function ComponentBash() {
    this.programId = null
}

ComponentBash.prototype.deserialise = function(data) {
    let [programId] = data ? data : [null];

    this.programId = programId
}

ComponentBash.prototype.onExecute = function(runner, api, components) {
    return api.endpoint('program_data', {'id': this.programId})
        .then((response) => {
            let program = new Program(response.data),
                stack = program.deserialiseFlowData()

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
