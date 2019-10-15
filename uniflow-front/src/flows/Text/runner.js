const onCode = function (client) {
  if(!this.state.variable || !this.state.text) {
    return ''
  }

  let text = this.state.text
  text = text.replace(/\"/g, '\\"')

  return this.state.variable + '= "' + text + '"'
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
        let context = runner.getContext()
        if (context[this.state.variable]) {
          this.setState({ text: context[this.state.variable] }, this.onUpdate)
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
        this.setState({ running: false }, resolve)
      })
    })
}

export {onCode, onExecute}
