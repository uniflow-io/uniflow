const onCode = function (client) {
  if (!this.state.variable) {
    return ''
  }

  let value = this.state.selected || ''
  value = JSON.stringify(value)

  return this.state.variable + ' = ' + value
}

const onExecute = function (runner) {
  return Promise
    .resolve()
    .then(() => {
      return new Promise(resolve => {
        this.setState({running: true}, resolve)
      })
    }).then(() => {
      if (this.state.variable && runner.hasValue(this.state.variable)) {
        this.setState({choices: runner.getValue(this.state.variable)}, this.onUpdate)

        runner.setValue(this.state.variable, this.state.selected)
      }
      if (this.state.variable) {
        let context = runner.getContext()
        if (context[this.state.variable]) {
          this.setState({choices: context[this.state.variable]}, this.onUpdate)
        } else {
          runner.run(onCode.bind(this)('uniflow'))
        }
      }
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
