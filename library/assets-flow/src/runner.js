const onCode = function() {
  if (!this.state.variable) {
    return ''
  }

  let assets = this.state.assets.reduce(function(data, asset) {
    data[asset[0]] = asset[1]
    return data
  }, {})

  return this.state.variable + ' = ' + JSON.stringify(assets)
}

const onExecute = function(runner) {
  if (this.state.variable) {
    return runner.run(onCode.bind(this)('uniflow'))
  }
}

export { onCode, onExecute }
