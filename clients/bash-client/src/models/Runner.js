const bashBridge = require('../bridges/bash')
const vm = require('vm')

function Runner(commandArgs, api) {
  this.commandArgs = commandArgs
  this.api = api
}

Runner.prototype.run = function (stack) {
  const context = new vm.createContext({
    Bash: bashBridge(this.commandArgs)
  });

  return stack.reduce((promise, flow) => {
    return promise.then(() => {
      return vm.runInContext(flow.code || '', context);
    })
  }, Promise.resolve())
}

module.exports = Runner
