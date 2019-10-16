const onCode = function (client) {
}

const onExecute = function (runner) {
  return Promise
    .resolve()
    .then(() => {
      return new Promise(resolve => {
        this.setState({running: true}, resolve)
      })
    }).then(() => {
      return new Promise(resolve => {
        let context = runner.getContext()
        if (this.state.messageVariable && context[this.state.messageVariable]) {
          this.setState({message: context[this.state.messageVariable]}, resolve)
        } else {
          this.setState({message: null}, resolve)
        }
      })
        .then(() => {
          return new Promise(resolve => {
            this.setState({promptDisplay: true, input: null}, resolve)
          })
        })
        .then(() => {
          return new Promise(resolve => {
            this.inputResolve = resolve
          })
        })
        .then(() => {
          if (this.state.variable) {
            runner.run(this.state.variable + ' = ' + JSON.stringify(this.state.input || ''))
          }
        })
        .then(() => {
          return new Promise(resolve => {
            this.setState({promptDisplay: false}, resolve)
          })
        })
    })
    .then(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 500)
      })
    })
    .then(() => {
      return new Promise(resolve => {
        this.setState({running: false}, resolve)
      })
    })
}


export {onCode, onExecute}
