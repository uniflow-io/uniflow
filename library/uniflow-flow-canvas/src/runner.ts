const onCode = function() {}

const onExecute = function(runner) {
  let context = runner.getContext()
  if (this.state.variable) {
    context[this.state.variable] = this.canvas
  }
  return this.canvas
}

export { onCode, onExecute }
