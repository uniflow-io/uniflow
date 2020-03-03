const onCode = function() {
  if (!this.state.variable) {
    return ''
  }

  let text = this.state.textList || []
  text = JSON.stringify(text)

  return this.state.variable + ' = ' + text
}

const onExecute = function(runner) {
  if (this.state.variable) {
    let context = runner.getContext()
    if (context[this.state.variable]) {
      this.setState({ text: context[this.state.variable] }, this.onUpdate)
    } else {
      return runner.run(onCode.bind(this)('uniflow'))
    }
  }
}

export { onCode, onExecute }
