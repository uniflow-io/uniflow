const onCode = function() {}

const onExecute = function(runner) {
  let railEval = function(rail) {
    return rail
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
    return railEval(this.state.conditionRail).then(value => {
      if (value === true) {
        return railEval(this.state.executeRail).then(promiseWhile)
      }
    })
  }

  return promiseWhile()
}

export { onCode, onExecute }
