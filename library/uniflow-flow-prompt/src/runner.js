const onCode = function() {
  if (!this.state.variable) {
    return ''
  }

  if (this.props.client === 'node') {
    return `
    (function() {
      return new Promise(function(resolve) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
    
        rl.question(${
          this.state.messageVariable
            ? this.state.messageVariable
            : JSON.stringify('prompt')
        } + ': ', function(answer) {
          ${this.state.variable} = answer
    
          rl.close()
        });
    
        rl.on('close', () => {
          resolve()
        })
      })
    })()
    `
  }
}

const onExecute = function(runner) {
  let returnValue = null
  return new Promise(resolve => {
    let context = runner.getContext()
    if (this.state.messageVariable && context[this.state.messageVariable]) {
      this.setState({ message: context[this.state.messageVariable] }, resolve)
    } else {
      this.setState({ message: null }, resolve)
    }
  })
    .then(() => {
      return new Promise(resolve => {
        this.setState({ promptDisplay: true, input: null }, resolve)
      })
    })
    .then(() => {
      return new Promise(resolve => {
        this.inputResolve = resolve
      })
    })
    .then(() => {
      if (this.state.variable) {
        returnValue = runner.run(
          this.state.variable + ' = ' + JSON.stringify(this.state.input || '')
        )
      }
    })
    .then(() => {
      return new Promise(resolve => {
        this.setState({ promptDisplay: false }, resolve)
      })
    })
    .then(() => {
      return returnValue
    })
}

export { onCode, onExecute }
