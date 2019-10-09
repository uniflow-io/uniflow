const bashBridge = require('../bridges/bash')
const consoleBridge = require('../bridges/console')
const vm = require('vm')

function Runner(commandArgs, api) {
  this.commandArgs = commandArgs
  this.api = api
}

Runner.prototype.run = function (stack) {
  const context = new vm.createContext({
    Bash: bashBridge(this.commandArgs),
    console: consoleBridge,
  });

  return stack.reduce((promise, flow) => {
    return promise.then(() => {
      return vm.runInContext(flow.code || '', context);
    })
  }, Promise.resolve())
}

module.exports = Runner
