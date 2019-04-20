const onCompile = function(interpreter, scope, asyncWrapper) {
  [this.state.conditionStack, this.state.executeStack]
    .forEach(stack => {
      stack.forEach(item => {
        item.bus.emit('compile', interpreter, scope)
      })
    })
}

const onExecute = function(runner) {
  return Promise
    .resolve()
    .then(() => {
      return new Promise(resolve => {
        this.setState({ running: true }, resolve)
      })
    }).then(() => {
      let stackEval = function (stack) {
        return stack.reduce((promise, item) => {
          return promise.then(() => {
            return item.bus.emit('execute', runner)
          })
        }, Promise.resolve()).then(() => {
          return runner.getReturn()
        })
      }

      let promiseWhile = () => {
        return stackEval(this.state.conditionStack)
          .then(value => {
            if (value === true) {
              return stackEval(this.state.executeStack).then(promiseWhile)
            }
          })
      }

      return promiseWhile()
    })
    .then(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 500)
      })
    })
    .then(() => {
      return new Promise(resolve => {
        this.setState({ running: false }, resolve)
      })
    })
}

export { onCompile, onExecute }
