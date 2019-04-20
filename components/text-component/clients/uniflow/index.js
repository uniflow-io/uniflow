const onCompile = function(interpreter, scope, asyncWrapper) {

}

const onExecute = function(runner) {
  return Promise
    .resolve()
    .then(() => {
      return new Promise(resolve => {
        this.setState({ running: true }, resolve)
      })
    }).then(() => {
      if (this.state.variable) {
        if (runner.hasValue(this.state.variable)) {
          this.setState({ text: runner.getValue(this.state.variable) }, this.onUpdate)
        } else {
          runner.setValue(this.state.variable, this.state.text)
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
        this.setState({ running: false }, resolve)
      })
    })
}

export { onCompile, onExecute }
