const onCode = function() {
  if (!this.state.variable) {
    return ''
  }

  let object = this.transform()
  object = JSON.stringify(object)

  return this.state.variable + ' = ' + object
}

const onExecute = function(runner) {
  if (this.state.variable) {
    let context = runner.getContext()
    if (context[this.state.variable]) {
      let object = context[this.state.variable]
      let keyValueList = this.reverseTransform(object)
      this.setState({ keyValueList: keyValueList }, this.onUpdate)
    } else {
      return runner.run(onCode.bind(this)('uniflow'))
    }
  }
}

export { onCode, onExecute }
