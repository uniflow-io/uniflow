const onCode = function() {
  return this.state.code
}

const onExecute = function(runner) {
  return runner.run(this.state.code)
}

export { onCode, onExecute }
