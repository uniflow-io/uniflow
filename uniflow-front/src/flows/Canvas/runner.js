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
      console.log(this.canvas)
      let context = runner.getContext()
      if (this.state.variable) {
        context[this.state.variable] = this.canvas
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
