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

const onExecute = async function(runner) {
  let returnValue = null
  await new Promise(resolve => {
    let context = runner.getContext()
    if (this.state.messageVariable && context[this.state.messageVariable]) {
      this.setState({ message: context[this.state.messageVariable] }, resolve)
    } else {
      this.setState({ message: null }, resolve)
    }
  })
  await new Promise(resolve => {
    this.setState({ promptDisplay: true, input: null }, resolve)
  })
  await new Promise(resolve => {
    this.inputResolve = resolve
  })
  if (this.state.variable) {
    returnValue = runner.run(
      this.state.variable + ' = ' + JSON.stringify(this.state.input || '')
    )
  }
  await new Promise(resolve => {
    this.setState({ promptDisplay: false }, resolve)
  })
  return returnValue
}

export { onCode, onExecute }
