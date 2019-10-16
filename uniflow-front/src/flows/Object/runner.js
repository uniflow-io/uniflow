const onCode = function (client) {
  if (!this.state.variable) {
    return ''
  }

  let object = this.transform()
  object = JSON.stringify(object)

  return this.state.variable + ' = ' + object
}

const onExecute = function (runner) {
  return Promise
    .resolve()
    .then(() => {
      return new Promise(resolve => {
        this.setState({running: true}, resolve)
      })
    }).then(() => {
      if (this.state.variable) {
        let context = runner.getContext()
        if (context[this.state.variable]) {
          let object = context[this.state.variable]
          let keyvaluelist = this.reverseTransform(object)
          this.setState({keyvaluelist: keyvaluelist}, this.onUpdate)
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
