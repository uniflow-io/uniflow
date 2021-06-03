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

  return flowsEval(this.state.if.conditionFlows).then(value => {
    if (value === true) {
      return flowsEval(this.state.if.executeFlows)
    }

    return this.state.elseIfs
      .reduce((promise, elseIf) => {
        return promise.then(isResolved => {
          if (!isResolved) {
            return flowsEval(elseIf.conditionFlows).then(value => {
              if (value === true) {
                return flowsEval(elseIf.executeFlows).then(() => {
                  return true
                })
              }

              return false
            })
          }

          return isResolved
        })
      }, Promise.resolve(false))
      .then(isResolved => {
        if (!isResolved && this.state.else) {
          return flowsEval(this.state.else.executeFlows)
        }
      })
  })
}

export { onCode, onExecute }
