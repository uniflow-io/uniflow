import components from '../uniflow/components'

function Runner(commandArgs, api) {
    this.commandArgs = commandArgs
    this.api = api
}

Runner.prototype.run = function(stack) {
    let commands = [], runner = {
        eval: function (code) {
            if (code === undefined) return

            commands.push(code)
        }
    }

    return stack.reduce((promise, item) => {
        return promise.then(() => {
            let component = new components[item.component]()
            component.deserialise(item.data)
            return component.onExecute(runner, this.api, components)
        })
    }, Promise.resolve())
        .then(() => {
            return new Promise((resolve, reject) => {

            })
        }).then(function(stdout) {
            process.stdout.write(stdout)
        })
}

export default Runner
