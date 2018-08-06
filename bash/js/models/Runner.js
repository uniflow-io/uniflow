const components = require('../uniflow/components')
const execSh = require('exec-sh')

function Runner() {

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
            return component.onExecute(runner)
        })
    }, Promise.resolve())
        .then(() => {
            return new Promise(function(resolve, reject) {
                execSh(commands.join("\n"), {}, function(err, stdout, stderr) {
                    if(err) {
                        reject(stderr)
                    } else {
                        resolve(stdout)
                    }
                })
            })
        }).then(function(stdout) {
            process.stdout.write(stdout)
        })
}

module.exports = Runner
