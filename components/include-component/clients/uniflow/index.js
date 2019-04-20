const onCompile = function(interpreter, scope, asyncWrapper) {
  return this.getFlow(this.state.programId).then(() => {
    let flow = this.stack.getState()
    return flow.reduce((promise, item) => {
      return promise.then(() => {
        return item.bus.emit('compile', interpreter, scope, asyncWrapper)
      })
    }, Promise.resolve())
  })
}

const onExecute = function(runner) {
  return Promise.resolve()
    .then(() => {
      return new Promise(resolve => {
        this.setState({ running: true }, resolve)
      })
    })
    .then(() => {
      let flow = this.stack.getState()
      return flow.reduce((promise, item) => {
        return promise.then(() => {
          return item.bus.emit('execute', runner)
        })
      }, Promise.resolve())
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
