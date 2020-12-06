const onCode = function() {}

const onExecute = function(runner) {
  let flowsEval = function(flows) {
    return flows
      .reduce((promise, item) => {
        return promise.then(() => {
          return item.bus.emit('execute', runner)
        })
      }, Promise.resolve([]))
      .then(value => {
        return value[0]
      })
  }

  let promiseWhile = () => {
    return flowsEval(this.state.conditionFlows).then(value => {
      if (value === true) {
        return flowsEval(this.state.executeFlows).then(promiseWhile)
      }
    })
  }

  return promiseWhile()
}

export { onCode, onExecute }
