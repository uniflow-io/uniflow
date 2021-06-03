const onCode = function() {
  return this.state.javascript
}

const onExecute = function(runner) {
  return runner.run(this.state.javascript)
}

export { onCode, onExecute }
