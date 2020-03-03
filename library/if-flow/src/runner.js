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

  return railEval(this.state.if.conditionRail).then(value => {
    if (value === true) {
      return railEval(this.state.if.executeRail)
    }

    return this.state.elseIfs
      .reduce((promise, elseIf) => {
        return promise.then(isResolved => {
          if (!isResolved) {
            return railEval(elseIf.conditionRail).then(value => {
              if (value === true) {
                return railEval(elseIf.executeRail).then(() => {
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
          return railEval(this.state.else.executeRail)
        }
      })
  })
}

export { onCode, onExecute }
