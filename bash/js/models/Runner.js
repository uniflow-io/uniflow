const components = require('../uniflow/components')
const execSh = require('exec-sh')

function Runner() {

}

Runner.prototype.run = function(stack, onRunIndex = () => {}) {
    let value, runner = {
        eval: function (code) {
            value = null
            if (code === undefined) return;

            return new Promise(function(resolve, reject) {
                execSh(code, {}, function(err, stdout, stderr) {
                    if(err) {
                        reject(stderr)
                    } else {
                        resolve(stdout)
                    }
                })
            }).then(function(stdout) {
                value = stdout
                process.stdout.write(stdout)
            })

            /*return exec(code)
                .then(function(result) {
                    value = result.stdout
                    process.stdout.write(result.stdout)
                })*/
        },
        getReturn: function () {
            return value;
        }
    };

    return stack.reduce((promise, item, index) => {
        return promise
            .then(() => {
                return onRunIndex(index);
            }).then(() => {
                let component = new components[item.component]()
                component.deserialise(item.data)
                return component.onExecute(runner);
            }).then(() => {
                return onRunIndex(null);
            });
    }, Promise.resolve());
}

module.exports = Runner
